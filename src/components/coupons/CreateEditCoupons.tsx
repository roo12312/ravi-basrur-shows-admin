"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import Select from "react-select";
import * as z from "zod";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import useMutationData from "@/hooks/supabase/useMutationData";
import useFetchData from "@/hooks/supabase/useFetchData";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { Textarea } from "../ui/textarea";

const applicableOptions = [
  { value: "movies", label: "Movies" },
  { value: "documentaries", label: "Documentaries" },
  { value: "shows", label: "Shows" },
  { value: "all", label: "All" },
];

// Zod schema for validation
const formSchema = z.object({
  coupon: z.string().min(1, "Coupon code is required"),
  description: z.string(),
  coupon_amount: z.number().optional(),
  coupon_percentage: z.number().optional(),
  coupon_max_discount: z.number().optional(),
  valid_until: z.date({ required_error: "Expiration date is required" }),
  max_uses: z.number().positive("Must be at least 1"),
  applicable_for: z.array(z.string()),
  is_draft: z.boolean().optional(),
});

type CouponType = z.infer<typeof formSchema>;

export function CreateEditCoupons({
  open = false,
  editCouponId,
}: {
  open: boolean;
  editCouponId?: string | null | undefined;
}) {
  const defaultValues = {
    coupon: undefined, // Coupon code (name)
    description: undefined, // Coupon description
    coupon_amount: undefined, // Coupon amount (ensure it's numeric)
    coupon_percentage: undefined,
    coupon_max_discount: undefined,
    valid_until: undefined, // Valid until date (should be a string or empty)
    is_draft: true, // Draft status (boolean)
    max_uses: undefined, // Maximum uses for the coupon
    applicable_for: undefined, // Applicable for field (e.g., 'electronics', 'fashion', etc.)
    created_at: undefined, // Created at (date string or empty)
    updated_at: undefined, // Updated at (date string or empty)
  };
  const form = useForm<CouponType>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const edit = !!editCouponId;
  const rotuer = useRouter();
  const mutate = useMutationData();

  const generateRandomCoupon = () => {
    const randomCode = Math.random()
      .toString(36)
      .substring(2, 16)
      .toUpperCase();
    form.setValue("coupon", randomCode);
  };
  const onClose = () => {
    form.reset(defaultValues);
    rotuer.back();
  };
  const onSubmit = async (data: CouponType) => {
    try {
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("coupons")
          .insert({
            coupon: data.coupon,
            description: data.description,
            coupon_amount: data.coupon_amount || null, // Handle optional fields
            coupon_percentage: data.coupon_percentage || null,
            coupon_max_discount: data.coupon_max_discount || null,
            valid_until: data.valid_until, // Already converted to Date
            max_uses: data.max_uses,
            is_draft: data.is_draft,
            applicable_for: data.applicable_for, // Array of applicable categories
          })
          .select(),
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Coupon has been created.");
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding Coupon.");
    }
  };

  const coupon = useFetchData({
    query: supabase
      .from("coupons")
      .select()
      .match({ id: editCouponId })
      .single(),
    options: {
      enabled: edit,
    },
  });

  useEffect(() => {
    if (coupon.data) {
      form.reset({
        coupon: coupon.data.coupon, // Coupon code (name)
        description: coupon.data.description, // Coupon code (name)
        coupon_amount: coupon.data.coupon_amount ?? undefined, // Coupon amount (ensure it's numeric if necessary)
        coupon_max_discount: coupon.data.coupon_max_discount ?? undefined,
        coupon_percentage: coupon.data.coupon_percentage ?? undefined,
        valid_until: coupon.data.valid_until
          ? new Date(coupon.data.valid_until)
          : "", // Formatting the date correctly
        is_draft: coupon.data.is_draft, // Whether the coupon is in draft state
        max_uses: coupon.data.max_uses, // max_uses field
        applicable_for: coupon.data.applicable_for, // Applicable for field
        created_at: coupon.data.created_at, // Created date (if needed)
        updated_at: coupon.data.updated_at, // Last updated date (if needed)
        // Add other fields if there are more columns in your coupon table
      });
    } else {
      form.reset(defaultValues); // Reset the form to default values if no coupon data
    }
  }, [coupon.data]);

  const onSubmitEdit = async (data: CouponType) => {
    console.log(data);

    try {
      if (!coupon.data) return; // Ensure we have the coupon data

      // Prepare the data for update
      const rsp = await mutate.mutateAsync({
        query: supabase
          .from("coupons")
          .update({
            coupon: data.coupon,
            description: data.description,
            coupon_amount: data.coupon_amount || null, // Handle optional fields
            coupon_percentage: data.coupon_percentage || null,
            coupon_max_discount: data.coupon_max_discount || null,
            valid_until: data.valid_until, // Already converted to Date
            max_uses: data.max_uses,
            is_draft: data.is_draft,
            applicable_for: data.applicable_for,
          })
          .match({ id: coupon.data.id }) // Match the coupon by its id
          .select(), // Optionally select updated columns if needed
      });

      console.log(rsp);

      if (rsp.data) {
        toast("Coupon has been updated.");
        onClose(); // Close modal or handle state
      }
    } catch (err) {
      console.log("err coupon", err);
      toast.error("Error updating coupon");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onClose={onClose}>
        <DialogHeader>
          <DialogTitle>
            {editCouponId ? "Edit Coupon" : "Create Coupon"}
          </DialogTitle>
          <DialogDescription>
            Fill in the coupon details below
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          {edit && coupon.isLoading && <Skeleton className="w-full h-20" />}
          {!coupon.isLoading && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(edit ? onSubmitEdit : onSubmit)}
                className="space-y-4 w-full"
              >
                <FormField
                  control={form.control}
                  name="coupon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Code</FormLabel>
                      <div className="flex space-x-2 items-center">
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter or generate code"
                            {...field}
                          />
                        </FormControl>
                        <Button type="button" onClick={generateRandomCoupon}>
                          Generate
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type Here"
                          className="resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coupon_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Amount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter coupon amount"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="coupon_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter percentage (optional)"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coupon_max_discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Discount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter max discount (optional)"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="valid_until"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Until</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={
                            field.value
                              ? `${new Date(
                                  field.value
                                ).getFullYear()}-${String(
                                  new Date(field.value).getMonth() + 1
                                ).padStart(2, "0")}-${String(
                                  new Date(field.value).getDate()
                                ).padStart(2, "0")}T${String(
                                  new Date(field.value).getHours()
                                ).padStart(2, "0")}:${String(
                                  new Date(field.value).getMinutes()
                                ).padStart(2, "0")}`
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_uses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Uses</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter max uses"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="applicable_for"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicable For</FormLabel>
                      <FormControl>
                        <Select
                          isMulti
                          options={applicableOptions}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          value={applicableOptions.filter((option) =>
                            field.value?.includes(option.value)
                          )}
                          onChange={(selected) =>
                            field.onChange(
                              selected.map((option) => option.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_draft"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormLabel>Is Draft</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(value) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={form.formState.isSubmitting}
                  className="ml-auto w-full mt-5"
                  type="submit"
                >
                  Save
                </Button>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
