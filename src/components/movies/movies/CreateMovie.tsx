"use client";
import UppyComponent from "@/components/ui/UppyComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import {
  AsyncCreatableSelect,
  AsyncSelect,
} from "@/components/ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import useUpsertToStorage from "@/hooks/supabase/upsertToStorage";
import useFetchData from "@/hooks/supabase/useFetchData";
import useMutationData from "@/hooks/supabase/useMutationData";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangleIcon, Trash, Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import * as z from "zod";

export const CompleteMovieSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  release_date: z.string(),
  scheduled_release: z.string(),
  duration: z.string(),
  slug: z.string().regex(/^[a-z](-?[a-z])*$/),
  watching_option: z.object({
    value: z.string(),
    label: z.string(),
  }),
  // is_released: z.boolean(),

  movie_languages: z
    .array(
      z.object({
        value: z.string().uuid(),
        label: z.string(),
      })
    )
    .min(1),

  movie_certificates: z
    .array(
      z.object({
        value: z.string().uuid(),
        label: z.string(),
      })
    )
    .min(1),

  movie_genres: z
    .array(
      z.object({
        value: z.string().uuid(),
        label: z.string(),
      })
    )
    .min(1),
  movie_tags: z
    .array(
      z.object({
        value: z.string(),
        label: z.string(),
        __isNew__: z.boolean().optional(),
      })
    )
    .min(1),

  movie_cast: z
    .array(
      z.object({
        role_id: z.object({
          value: z.string().uuid(),
          label: z.string(),
        }),
        cast_ids: z
          .array(
            z.object({
              value: z.string().uuid(),
              label: z.string(),
            })
          )
          .min(1),
      })
    )
    .min(1),

  movie_posters: z
    .array(
      z.object({
        url: z.union([
          z.string(), // For URLs
          z.any(), // For File objects
        ]),
        type: z.string(),
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
      })
    )
    .min(1),

  pricing_amount: z.string(),
  discounted_pricing_amount: z.string(),
});

type CompleteMovie = z.infer<typeof CompleteMovieSchema>;

interface ProfileFormType {}

export const CreateMovie: React.FC<ProfileFormType> = () => {
  const [loading, setLoading] = useState(false);

  const title = "Create Movie";
  const description =
    "To create movie, we first need some basic information about you.";

  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const [data, setData] = useState({});
  const moviePostersArray = useFetchData({
    query: supabase
      .from("constants")
      .select("*")
      .match({
        id: "movie_posters_array",
      })
      .single(),
  });
  const movieVideosArray = useFetchData({
    query: supabase
      .from("constants")
      .select("*")
      .match({
        id: "movie_videos_array",
      })
      .single(),
  });

  useEffect(() => {
    const defaultValues = {
      movie_cast: [
        {
          cast_ids: [""],
          role_id: "",
        },
      ],
      movie_videos: [
        ...(movieVideosArray?.data?.value_json.map((type) => ({
          content: null,
          type,
          provider: null,
        })) ?? []),
      ],
      movie_posters: [
        ...(moviePostersArray?.data?.value_json.map((type) => ({
          url: null,
          type,
        })) ?? []),
      ],
    };

    form.reset(defaultValues);
  }, [movieVideosArray?.data, moviePostersArray?.data]);

  const form = useForm<CompleteMovie>({
    resolver: zodResolver(CompleteMovieSchema),

    mode: "onChange",
  });

  const {
    control,
    formState: { errors, isSubmitSuccessful },
  } = form;

  console.log(form.formState);

  const movie_cast = useFieldArray({
    control,
    name: "movie_cast",
  });

  const movie_posters = useFieldArray({
    control,
    name: "movie_posters",
  });
  const movie_videos = useFieldArray({
    control,
    name: "movie_videos",
  });
  const mutate = useMutationData();
  const upsertFile = useUpsertToStorage();

  const processForm: SubmitHandler<CompleteMovie> = async (data) => {
    console.log("data ==>", data);
    setData(data);
    setLoading(true);
    try {
      const movieRsp = await mutate.mutateAsync({
        query: supabase
          .from("movies")
          .insert({
            title: data.title,
            description: data.description,
            is_released: true,
            is_draft: true,
            release_date: data.release_date,
            scheduled_release: data.scheduled_release,
            pricing_amount: data.pricing_amount,
            duration: data.duration,
            discounted_pricing_amount: data.discounted_pricing_amount,
            watching_option: data.watching_option.value,
          })
          .select()
          .single(),
      });

      console.log(movieRsp);

      if (!movieRsp.data) {
        throw "ERR";
      }
      await Promise.all(
        data.movie_languages.map(async (language) => {
          const movieLanguages = await mutate.mutateAsync({
            query: supabase
              .from("movie_languages")
              .insert({
                movie_id: movieRsp.data.id,
                language_id: language.value,
              })
              .select(),
          });
        })
      );
      await Promise.all(
        data.movie_certificates.map(async (certificate) => {
          const movieCertificates = await mutate.mutateAsync({
            query: supabase
              .from("movie_certificates")
              .insert({
                movie_id: movieRsp.data.id,
                certificate_id: certificate.value,
              })
              .select(),
          });
        })
      );
      await Promise.all(
        data.movie_genres.map(async (genre) => {
          const movieGenre = await mutate.mutateAsync({
            query: supabase
              .from("movie_genres")
              .insert({
                movie_id: movieRsp.data.id,
                genre_id: genre.value,
              })
              .select(),
          });
        })
      );
      await Promise.all(
        data.movie_tags.map(async (tags) => {
          let id = tags.value;
          if (tags.__isNew__) {
            const newtag = await mutate.mutateAsync({
              query: supabase
                .from("tags")
                .insert({
                  name: tags.label,
                })
                .select()
                .single(),
            });
            id = newtag.data.id;
          }
          console.log("movie_tags ", tags, movieRsp.data.id, id);
          const movieTags = await mutate.mutateAsync({
            query: supabase
              .from("movie_tags")
              .insert({
                movie_id: movieRsp.data.id,
                tag_id: id,
              })
              .select(),
          });
        })
      );

      await Promise.all(
        data.movie_cast.map(async (movie_cast) => {
          movie_cast.cast_ids.map(async (cast_id) => {
            const movieGenre = await mutate.mutateAsync({
              query: supabase
                .from("movie_cast")
                .insert({
                  movie_id: movieRsp.data.id,
                  role_id: movie_cast.role_id.value,
                  cast_id: cast_id.value,
                })
                .select(),
            });
          });
        })
      );

      await Promise.all(
        data.movie_videos.map(async (movie_video) => {
          const MovieVideo = await mutate.mutateAsync({
            query: supabase
              .from("movie_videos")
              .insert({
                movie_id: movieRsp.data.id,
                type: movie_video.type,
                content: JSON.parse(movie_video.content),
                provider: movie_video.provider.value,
              })
              .select(),
          });
        })
      );

      await Promise.all(
        data.movie_posters.map(async (movie_poster) => {
          const uploadUrl = await upsertFile({
            image: movie_poster.url,
            bucket: "movie_posters",
          });
          const movieposter = await mutate.mutateAsync({
            query: supabase
              .from("movie_posters")
              .insert({
                movie_id: movieRsp.data.id,
                type: movie_poster.type,
                url: uploadUrl,
              })
              .select(),
          });
        })
      );
      toast("Movie Created");
    } catch (err) {
      console.log(err);
      toast.error("Error Movie Error");
    }
    setLoading(false);
    // api call and reset
    // form.reset();
  };

  type FieldName = keyof CompleteMovie;

  const steps = [
    {
      id: "Step 1",
      name: "Basic Information",
      fields: [
        "title",
        "description",
        "duration",
        "release_date",
        "movie_languages",
        "movie_certificates",
        "movie_genres",
        "movie_tags",
        "slug",
      ],
    },
    {
      id: "Step 2",
      name: "Add Cast",
      // fields are mapping and flattening for the error to be trigger  for the dynamic fields
      fields: movie_cast.fields
        ?.map((_, index) => [
          `movie_cast.${index}.cast_ids`,
          `movie_cast.${index}.role_id`,
          // Add other field names as needed
        ])
        .flat(),
    },
    {
      id: "Step 3",
      name: "Media",
      fields: [
        movie_posters.fields
          ?.map((_, index) => [
            `movie_posters.${index}.url`,
            `movie_posters.${index}.type`,
            // Add other field names as needed
          ])
          .flat(),
        movie_videos.fields
          ?.map((_, index) => [
            `movie_videos.${index}.content`,

            // Add other field names as needed
          ])
          .flat(),
      ].flat(),
    },
    {
      id: "Step 4",
      name: "Pricing and Schedule Release",
      fields: [
        "scheduled_release",
        "pricing_amount",
        "discounted_pricing_amount",
      ],
    },
    {
      id: "Step 5",
      name: "Submit",
    },
  ];

  const next = async () => {
    const fields = steps[currentStep].fields;
    console.log({ fields });

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      console.log(currentStep === steps.length - 2);
      if (currentStep === steps.length - 2) {
        await form.handleSubmit(processForm)();
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <div>
        <ul className="flex gap-4">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-sky-600 transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-sky-600">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex h-full w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(processForm)}
          className="space-y-8 w-full"
        >
          <div className={cn("md:grid max-w-xl gap-5")}>
            {currentStep === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="Movie Title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Movie Description</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={loading}
                          placeholder="Movie Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Movie Duration in Seconds</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          placeholder="Movie Duration"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          type="string"
                          disabled={loading}
                          placeholder="slug"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="release_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Date</FormLabel>
                      <FormControl>
                        <Input disabled={loading} type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="movie_languages"
                  render={({ field }) => {
                    const {
                      data: resultData,
                      count,
                      isFetching,
                    } = useFetchData({
                      query: supabase.from("languages").select("*"),
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
                            .from("languages")
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
                        <FormLabel>Languages</FormLabel>
                        <FormControl>
                          <AsyncSelect
                            loadOptions={loadOptions}
                            defaultOptions={initialOptions}
                            isMulti
                            cacheOptions
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="movie_certificates"
                  render={({ field }) => {
                    const {
                      data: resultData,
                      count,
                      isFetching,
                    } = useFetchData({
                      query: supabase.from("certificates").select("*"),
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
                            .from("certificates")
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
                        <FormLabel>Movie Certificate</FormLabel>
                        <FormControl>
                          <AsyncSelect
                            loadOptions={loadOptions}
                            isMulti
                            cacheOptions
                            defaultOptions={initialOptions}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="movie_genres"
                  render={({ field }) => {
                    const {
                      data: resultData,
                      count,
                      isFetching,
                    } = useFetchData({
                      query: supabase.from("genres").select("*"),
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
                            .from("genres")
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
                        <FormLabel>Movie Genres</FormLabel>
                        <FormControl>
                          <AsyncSelect
                            loadOptions={loadOptions}
                            isMulti
                            cacheOptions
                            defaultOptions={initialOptions}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="movie_tags"
                  render={({ field }) => {
                    // console.log({ field });
                    const {
                      data: resultData,
                      count,
                      isFetching,
                    } = useFetchData({
                      query: supabase.from("tags").select("*"),
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
                            .from("tags")
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
                        <FormLabel>Movie Tags</FormLabel>
                        <FormControl>
                          <AsyncCreatableSelect
                            loadOptions={loadOptions}
                            isMulti
                            cacheOptions
                            defaultOptions={initialOptions}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </>
            )}
            {currentStep === 1 && (
              <>
                {movie_cast.fields?.map((field, index) => {
                  return (
                    <Accordion
                      type="single"
                      collapsible
                      defaultValue="item-1"
                      key={field.id}
                    >
                      <AccordionItem value="item-1">
                        <AccordionTrigger
                          className={cn(
                            "[&[data-state=closed]>button]:hidden [&[data-state=open]>.alert]:hidden relative !no-underline",
                            errors?.movie_cast?.[index] && "text-red-700"
                          )}
                        >
                          {`Cast ${index + 1}`}

                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-8"
                            disabled={movie_cast.fields.length <= 1}
                            onClick={() => movie_cast.remove(index)}
                          >
                            <Trash2Icon className="h-4 w-4 " />
                          </Button>
                          {errors?.movie_cast?.[index] && (
                            <span className="absolute alert right-8">
                              <AlertTriangleIcon className="h-4 w-4   text-red-700" />
                            </span>
                          )}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div
                            className={cn(
                              "md:grid z-[999] md:grid-cols-3 gap-8 border p-4 rounded-md relative mb-4"
                            )}
                          >
                            <FormField
                              control={form.control}
                              name={`movie_cast.${index}.role_id`}
                              render={({ field }) => {
                                // console.log("asdsd", { field });
                                const {
                                  data: resultData,
                                  count,
                                  isFetching,
                                } = useFetchData({
                                  query: supabase
                                    .from("cast_roles")
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
                                  new Promise<
                                    { value: string; label: string }[]
                                  >(async (resolve) => {
                                    if (!inputValue) resolve([]);

                                    const { data, error } = await supabase
                                      .from("cast_roles")
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
                                  });

                                // console.log({ field });

                                return (
                                  <FormItem>
                                    <FormLabel>Role</FormLabel>
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
                              name={`movie_cast.${index}.cast_ids`}
                              render={({ field }) => {
                                const {
                                  data: resultData,
                                  count,
                                  isFetching,
                                } = useFetchData({
                                  query: supabase
                                    .from("cast_information")
                                    .select("*"),
                                });
                                const initialOptions = useMemo(() => {
                                  if (!resultData) {
                                    return [];
                                  }

                                  return resultData.map((d) => {
                                    return {
                                      value: d.id,
                                      label: d.first_name + " " + d.last_name,
                                    };
                                  });
                                }, [resultData]);

                                const loadOptions = (inputValue: string) =>
                                  new Promise<
                                    { value: string; label: string }[]
                                  >(async (resolve) => {
                                    if (!inputValue) resolve([]);

                                    const { data, error } = await supabase
                                      .from("cast_information")
                                      .select("*")
                                      .ilike("first_name", `%${inputValue}%`);

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
                                          label:
                                            d.first_name + " " + d.last_name,
                                        };
                                      })
                                    );
                                  });

                                // console.log({ field });

                                return (
                                  <FormItem>
                                    <FormLabel>Cast</FormLabel>
                                    <FormControl>
                                      <AsyncSelect
                                        loadOptions={loadOptions}
                                        isMulti
                                        cacheOptions
                                        defaultOptions={initialOptions}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                );
                              }}
                            />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })}

                <div className="flex justify-center mt-4">
                  <Button
                    type="button"
                    className="flex justify-center"
                    size={"lg"}
                    onClick={() =>
                      movie_cast.append({
                        cast_ids: [],
                        role_id: {
                          label: "",
                          value: "",
                        },
                      })
                    }
                  >
                    Add More
                  </Button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <p>Videos</p>
                {movie_videos.fields?.map((field, index) => {
                  console.log(field);

                  return (
                    <div
                      className={cn(
                        " gap-8 border p-4 rounded-md relative mb-4"
                      )}
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
                              console.log({ watchFields });
                              console.log({ fieldInner });
                              const { data } = useFetchData({
                                query: supabase
                                  .from("video_providers")
                                  .select("*")
                                  .match({
                                    id: watchFields[0]?.provider?.value,
                                  })
                                  .single(),
                                options: {
                                  enabled: !!watchFields[0]?.provider?.value,
                                },
                              });
                              console.log({ data });

                              useEffect(() => {
                                data &&
                                  fieldInner.onChange(
                                    JSON.stringify(data.fields)
                                  );
                              }, [data]);

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
                                      disabled={loading}
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
                  return (
                    <div
                      className={cn(
                        " gap-8 border p-4 rounded-md relative mb-4"
                      )}
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
              </>
            )}
            {currentStep === 3 && (
              <>
                <FormField
                  control={form.control}
                  name="scheduled_release"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled Release Date</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={loading} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`watching_option`}
                  render={({ field }) => {
                    // console.log({ field });

                    return (
                      <FormItem>
                        <FormLabel>Watch Option</FormLabel>
                        <FormControl>
                          <div className="z-[999]">
                            <AsyncSelect
                              defaultOptions={[
                                {
                                  label: "rental",
                                  value: "rental",
                                },
                                {
                                  label: "free",
                                  value: "free",
                                },
                                {
                                  label: "paid",
                                  value: "paid",
                                },
                              ]}
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
                  name="pricing_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          placeholder="Pricing Amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discounted_pricing_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discounted Pricing Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          disabled={loading}
                          placeholder="Discounted Pricing Amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {currentStep === 4 && (
              <div>
                <h1>Completed</h1>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(data)}
                </pre>
              </div>
            )}
          </div>

          {/* <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button> */}
        </form>
      </Form>
      {/* Navigation */}
      {(!isSubmitSuccessful || loading) && (
        <div className="mt-8 pt-5">
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={currentStep === 0 || loading}
              className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              disabled={currentStep === steps.length - 1 || loading}
              className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 flex flex-row"
            >
              {currentStep === steps.length - 2 && "Submit"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
