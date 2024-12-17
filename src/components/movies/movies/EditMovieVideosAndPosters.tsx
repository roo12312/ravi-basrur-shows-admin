"use client";
import { AlertTriangleIcon, Copy, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "../../ui/scroll-area";
import { supabase } from "@/lib/supabase/client";
import useMutationData from "@/hooks/supabase/useMutationData";
import { toast } from "sonner";
import useFetchData from "@/hooks/supabase/useFetchData";
import { useEffect, useMemo } from "react";
import { Skeleton } from "../../ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  AsyncCreatableSelect,
  AsyncSelect,
} from "@/components/ui/react-select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import UppyComponent from "@/components/ui/UppyComponent";
import useUpsertToStorage from "@/hooks/supabase/upsertToStorage";

const deletedIds = (array1 = [], array2 = []) => {
  const deleted_ids = [];
  array2.forEach((d) => {
    if (array1.find((dd) => d._id === dd._id)) {
    } else {
      deleted_ids.push(d._id);
    }
  });

  return deleted_ids;
};
const formSchema = z.object({
  movie_posters: z
    .array(
      z.object({
        url: z.union([
          z.string(), // For URLs
          z.any(), // For File objects
        ]),
        type: z.string(),
        _id: z.string().uuid().optional(),
      })
    )
    .min(1),

  movie_videos: z
    .array(
      z.object({
        content: z.string(),
        type: z.string(),
        provider: z.object({
          label: z.string(),
          value: z.string().uuid(),
        }),
        _id: z.string().uuid().optional(),
      })
    )
    .min(1),
});

type movieBasicType = z.infer<typeof formSchema>;

export function EditMovieVideosAndPosters({
  open = false,
  defaultValues,
  onClose: onCloseProp,
  movie_id,
}: {
  open: boolean;
  defaultValues?: any;
  onClose?: () => void;
  movie_id: string;
}) {
  const rotuer = useRouter();
  const mutate = useMutationData();

  console.log("sdfd", { defaultValues });

  const form = useForm<movieBasicType>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const {
    formState: { errors },
  } = form;

  console.log({ errors });

  //   console.log(language.data);
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues]);

  const onClose = () => {
    form.reset(defaultValues);
    onCloseProp && onCloseProp();
  };

  //   const onSubmit = async (data: movieBasicType) => {
  //     console.log(data);
  //     try {
  //       const rsp = await mutate.mutateAsync({
  //         query: supabase
  //           .from("languages")
  //           .insert({
  //             name: data.name,
  //             code: data.code,
  //             native_name: data.native_name,
  //           })
  //           .select(),
  //       });

  //       console.log(rsp);

  //       if (rsp.data) {
  //         toast("Language has been created.");

  //         onClose();
  //       }
  //     } catch (err) {
  //       toast.error("Error Adding Language");
  //     }
  //   };
  const movie_posters = useFieldArray({
    control: form.control,
    name: "movie_posters",
  });
  const movie_videos = useFieldArray({
    control: form.control,
    name: "movie_videos",
  });

  const upsertFile = useUpsertToStorage();

  const onSubmitEdit = async (data: movieBasicType) => {
    console.log({ data });

    try {
      await Promise.all(
        data.movie_videos.map(async (movie_video) => {
          if (!movie_video._id) {
            const MovieVideo = await mutate.mutateAsync({
              query: supabase.from("movie_videos").insert({
                type: movie_video.type,
                content: JSON.parse(movie_video.content),
                provider: movie_video.provider.value,
                movie_id: movie_id,
              }),
            });
          } else {
            const MovieVideo = await mutate.mutateAsync({
              query: supabase
                .from("movie_videos")
                .update({
                  type: movie_video.type,
                  content: JSON.parse(movie_video.content),
                  provider: movie_video.provider.value,
                })
                .match({ id: movie_video._id }),
            });
          }
        })
      );

      await Promise.all(
        data.movie_posters.map(async (movie_poster, index) => {
          console.log({ movie_poster });
          const uploadUrl = await upsertFile({
            image: movie_poster.url,
            originalImage: movie_poster._id
              ? defaultValues.movie_posters[index].url
              : undefined,
            bucket: "movie_posters",
          });

          if (!movie_poster._id) {
            const movieposter = await mutate.mutateAsync({
              query: supabase
                .from("movie_posters")
                .insert({
                  movie_id: movie_id,
                  type: movie_poster.type,
                  url: uploadUrl,
                })
                .select(),
            });
          }

          // const movieposter = await mutate.mutateAsync({
          //   query: supabase
          //     .from("movie_posters")
          //     .update({
          //       type: movie_poster.type,
          //       url: uploadUrl,
          //     })
          //     .match({ id: movie_poster._id }),
          // });
        })
      );

      toast("Movie has been Update.");
      onClose();
    } catch (err) {
      console.log(err);
      toast.error("Error updating");
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-3xl max-h-[90vh] overflow-y-auto "
        onClose={onClose}
      >
        <DialogHeader>
          <DialogTitle>{"Edit Movie Cast"}</DialogTitle>
          <DialogDescription>Add new language to the list</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 h-full ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitEdit)}
              className="space-y-2 w-full  h-full"
            >
              <p>Videos</p>
              {movie_videos.fields?.map((field, index) => {
                console.log(field);

                return (
                  <div
                    className={cn(" gap-8 border p-4 rounded-md relative mb-4")}
                  >
                    <div className="w-full">
                      <div>
                        <p>{field.type}</p>
                      </div>
                      <div
                        className={cn(
                          "md:grid z-[999] md:grid-cols-2 gap-8  p-4 rounded-md relative mb-4"
                        )}
                      >
                        <FormField
                          control={form.control}
                          name={`movie_videos.${index}.provider`}
                          render={({ field }) => {
                            const {
                              data: resultData,
                              count,
                              isFetching,
                            } = useFetchData({
                              query: supabase
                                .from("video_providers")
                                .select("*"),
                            });
                            const initialOptions = useMemo(() => {
                              if (!resultData) {
                                return [];
                              }

                              return resultData.map((d) => {
                                return {
                                  value: d.id,
                                  label: d.name,
                                };
                              });
                            }, [resultData]);
                            const loadOptions = (inputValue: string) =>
                              new Promise<{ value: string; label: string }[]>(
                                async (resolve) => {
                                  if (!inputValue) resolve([]);

                                  const { data, error } = await supabase
                                    .from("video_providers")
                                    .select("*")
                                    .ilike("name", `%${inputValue}%`);

                                  // console.log(data, error);
                                  if (!data) {
                                    resolve([]);
                                    return;
                                  }

                                  if (data.length == 0) resolve([]);
                                  resolve(
                                    data.map((d) => {
                                      return {
                                        value: d.id,
                                        label: d.name,
                                      };
                                    })
                                  );
                                }
                              );

                            // console.log({ field });

                            return (
                              <FormItem>
                                <FormLabel>Video Provider</FormLabel>
                                <FormControl>
                                  <div className="z-[999]">
                                    <AsyncSelect
                                      loadOptions={loadOptions}
                                      cacheOptions
                                      defaultOptions={initialOptions}
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />

                        <FormField
                          control={form.control}
                          name={`movie_videos.${index}.content`}
                          render={({ field: fieldInner }) => {
                            const watchFields = form.watch([
                              `movie_videos.${index}`,
                            ]);
                            // console.log({ watchFields });
                            // console.log({ fieldInner });
                            // const { data } = useFetchData({
                            //   query: supabase
                            //     .from("video_providers")
                            //     .select("*")
                            //     .match({
                            //       id: watchFields[0]?.provider?.value,
                            //     })
                            //     .single(),
                            //   options: {
                            //     enabled: !!watchFields[0]?.provider?.value,
                            //   },
                            // });
                            // console.log({ data });

                            // useEffect(() => {
                            //   data &&
                            //     fieldInner.onChange(
                            //       JSON.stringify(data.fields)
                            //     );
                            // }, [data]);

                            // console.log(
                            //   { data },
                            //   watchFields[0]?.provider,
                            //   !!watchFields[0]?.provider?.value
                            // );
                            if (!watchFields[0].provider) {
                              return <p>Select Provider First</p>;
                            }
                            return (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Textarea
                                    disabled={form.formState.isLoading}
                                    placeholder="Movie Description"
                                    {...fieldInner}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <p>Photos</p>
              {movie_posters.fields?.map((field, index) => {
                const type = field.type.split("-")[1];

                console.log(field);

                return (
                  <div
                    className={cn(" gap-8 border p-4 rounded-md relative mb-4")}
                  >
                    <div className="w-full">
                      <div>
                        <p>{field.type}</p>
                      </div>
                      <div
                        className={cn(
                          "md:grid z-[999] gap-8  p-4 rounded-md relative mb-4"
                        )}
                      >
                        <FormField
                          control={form.control}
                          name={`movie_posters.${index}.url`}
                          render={({ field: fieldInner }) => {
                            // console.log({ field });

                            return (
                              <FormItem>
                                <FormControl>
                                  <UppyComponent
                                    field={fieldInner}
                                    aspectRatio={
                                      type?.split("x")
                                        ? type.split("x")[0] /
                                          type.split("x")[1]
                                        : undefined
                                    }
                                    bucket={"movie_posters"}
                                    editOnSelect={!!type?.split("x")}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <Button
                disabled={form.formState.isSubmitting}
                className="ml-auto w-full mt-5"
                type="submit"
              >
                Save
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
