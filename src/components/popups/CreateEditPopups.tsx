"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase/client";
import useMutationData from "@/hooks/supabase/useMutationData";
import { toast } from "sonner";
import useFetchData from "@/hooks/supabase/useFetchData";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import UppyComponent from "@/components/ui/UppyComponent";
import useUpsertToStorage from "@/hooks/supabase/upsertToStorage";
import { format } from "date-fns";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { DateTimePicker } from "../ui/DateTimePicker";

// Schema for Popups form
const formSchema = z
  .object({
    title: z.string().min(1, "Title is required."),
    content: z.object({
      media: z.object({
        "mobile-image-9x16": z.union([
          z.string(), // For URLs
          z.any(), // For File objects
        ]),
        "desktop-image-16x9": z.union([
          z.string(), // For URLs
          z.any(), // For File objects
        ]),
      }),
      buttonText: z.string(),
      redirectUrl: z.string(),
    }),
    start_date: z.date({ required_error: "Start date is required." }),
    end_date: z.date({ required_error: "End date is required." }),
    is_draft: z.boolean(),
  })
  .superRefine(({ start_date, end_date }, ctx) => {
    if (end_date <= start_date) {
      ctx.addIssue({
        path: ["end_date"],
        message: "End date must be after start date.",
        code: "custom",
      });
    }
  });

type PopupType = z.infer<typeof formSchema>;

export function CreateEditPopup({
  open = false,
  editPopupId,
}: {
  open: boolean;
  editPopupId?: string | null | undefined;
}) {
  const edit = !!editPopupId;
  const router = useRouter();
  const mutate = useMutationData();
  const defaultValues: PopupType = {
    title: "",
    content: {
      media: {
        "mobile-image-9x16": "",
        "desktop-image-16x9": "",
      },
      buttonText: "",
      redirectUrl: "",
    },
    start_date: new Date(),
    end_date: new Date(),
    is_draft: true,
  };

  const form = useForm<PopupType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const popup = useFetchData({
    query: supabase.from("popups").select().match({ id: editPopupId }).single(),
    options: {
      enabled: edit,
    },
  });

  useEffect(() => {
    if (popup.data) {
      form.reset({
        ...popup.data,
        start_date: new Date(popup.data.start_date),
        end_date: new Date(popup.data.end_date),
      });
    } else {
      form.reset(defaultValues);
    }
  }, [popup.data]);

  const onClose = () => {
    form.reset(defaultValues);
    router.back();
  };

  const upsertFile = useUpsertToStorage();

  const onSubmit = async (data: PopupType) => {
    try {
      console.log({ data });
      const mobileImageId = await upsertFile({
        image: data.content.media["mobile-image-9x16"],
        bucket: "popup_images",
      });

      const desktopImageId = await upsertFile({
        image: data.content.media["desktop-image-16x9"],
        bucket: "popup_images",
      });

      const query = edit
        ? supabase
            .from("popups")
            .update({
              ...data,
              content: {
                ...data.content,
                media: {
                  "mobile-image-9x16": mobileImageId,
                  "desktop-image-16x9": desktopImageId,
                },
              },
            })
            .match({ id: editPopupId })
            .select()
        : supabase
            .from("popups")
            .insert({
              ...data,
              content: {
                ...data.content,
                media: {
                  "mobile-image-9x16": mobileImageId,
                  "desktop-image-16x9": desktopImageId,
                },
              },
            })
            .select();

      const rsp = await mutate.mutateAsync({ query });

      if (rsp.data) {
        toast(edit ? "Popup has been updated." : "Popup has been created.");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error(edit ? "Error updating popup." : "Error creating popup.");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>{edit ? "Edit Popup" : "Add Popup"}</DialogTitle>
          <DialogDescription>
            {edit ? "Edit" : "Add"} popup details below.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] w-full mb-5">
          {edit && popup.isLoading && <Skeleton className="w-full h-20" />}
          {!popup.isLoading && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Popup title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content.media.mobile-image-9x16"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Image (9x16)</FormLabel>
                      <FormControl>
                        <UppyComponent
                          field={field}
                          bucket={"popup_images"}
                          aspectRatio={9 / 16}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content.media.desktop-image-16x9"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desktop Image (16x9)</FormLabel>
                      <FormControl>
                        <UppyComponent
                          field={field}
                          bucket={"popup_images"}
                          aspectRatio={16 / 9}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content.buttonText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter button text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content.redirectUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Redirect URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter redirect URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row justify-center items-center gap-5">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl className="flex-1">
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "text-left",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? format(field.value, "PPP hh:mm aa")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0">
                            <DateTimePicker
                              field={field}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row justify-center items-center gap-5">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl className="flex-1">
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "text-left",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? format(field.value, "PPP hh:mm aa")
                                  : "Pick a date"}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0">
                            <DateTimePicker
                              field={field}
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_draft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mr-5">Draft</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="ml-auto w-full "
                >
                  {edit ? "Update" : "Submit"}
                </Button>
              </form>
            </Form>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
