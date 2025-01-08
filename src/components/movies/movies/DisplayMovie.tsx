"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useFetchData from "@/hooks/supabase/useFetchData";
import { supabase } from "@/lib/supabase/client";
import React, { useState } from "react";
import { EditBasicInformation } from "./EditBasicInformation";
import { Button } from "@/components/ui/button";
import { EditMovieCast } from "./EditMovieCast";
import { EditReleaseDetailsAndPricing } from "./EditReleaseDetailsAndPricing";
import useFetchStorage from "@/hooks/supabase/useFetchStorage";
import { EditMovieVideosAndPosters } from "./EditMovieVideosAndPosters";
import useMutationData from "@/hooks/supabase/useMutationData";
import { useRouter } from "next/navigation";
import useDeleteSingleFile from "../../../hooks/supabase/useDeleteSingleFile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewingHistoryList } from "@/components/users/viewing-history-list/client";
import { toast } from "sonner";
import { PayoutTransactionList } from "@/components/users/payout-transaction-list/client";
import { PaymentTransactionsList } from "@/components/users/payment-transaction-list/client";

function combineCastInformation(data) {
  const roleMap = {};

  data.forEach((item) => {
    const roleId = item.role_id;

    // If the role_id is not in the map, add it with an initial structure
    if (!roleMap[roleId]) {
      roleMap[roleId] = {
        role_id: roleId,
        cast_roles: item.cast_roles,
        cast_information: [],
        id: item.id,
      };
    }

    // Push the cast_information into the corresponding role_id entry
    roleMap[roleId].cast_information.push({
      ...item.cast_information,
      _id: item.id,
    });
  });

  // Convert the map back to an array
  return Object.values(roleMap);
}

export default function DisplayMovie({ id }: { id: string }) {
  const [editBasicInformation, setEditBasicInformation] = useState(false);
  const [editCast, setEditCast] = useState(false);
  const [editRelease, setEditRelease] = useState(false);
  const [editVideos, setEditVideos] = useState(false);
  const mutate = useMutationData();
  const router = useRouter();
  const deleteFile = useDeleteSingleFile();
  const select =
    "*,movie_cast(*,cast_information(*),cast_roles(*)),movie_posters(*),movie_videos(*,video_providers(*)),movie_genres(*,genres(*)),movie_certificates(*,certificates(*)),movie_languages(*,languages(*)),movie_tags(*,tags(*))";
  const {
    data: movieInfo,
    error,
    refetch,
  } = useFetchData({
    query: supabase
      .from("movies")
      .select(select)
      .match({
        id: id,
      })
      .single(),
  });

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
  console.log(movieInfo, error);

  const movieInfoView = useFetchData({
    query: supabase
      .from("movie_details")
      .select("*")
      .match({
        id: id,
      })
      .single(),
  });

  console.log(movieInfoView);

  return (
    <div className="overflow-y-auto flex-1">
      <ScrollArea className="flex-1 h-[75vh]">
        <Accordion type="multiple" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold">
              Movie Information
            </AccordionTrigger>
            <AccordionContent>
              <DisplayCard title="Movie Name" content={movieInfo?.title} />
              <DisplayCard
                title="Movie Description"
                content={movieInfo?.description}
              />
              <DisplayCard
                title="Duration"
                content={movieInfo?.duration + "s"}
              />
              <DisplayCard title="slug" content={movieInfo?.slug} />
              <DisplayCard
                title="Release Date"
                content={new Date(movieInfo?.release_date).toDateString()}
              />

              <DisplayCard
                title="Movie Certificate"
                content={movieInfo?.movie_certificates
                  .map((d) => d.certificates?.name)
                  .join(", ")}
              />
              <DisplayCard
                title="Genre"
                content={movieInfo?.movie_genres
                  .map((d) => d.genres?.name)
                  .join(", ")}
              />
              <DisplayCard
                title="Languages"
                content={movieInfo?.movie_languages
                  .map((d) => d.languages?.name)
                  .join(", ")}
              />
              <DisplayCard
                title="Tags"
                content={movieInfo?.movie_tags
                  .map((d) => d.tags?.name)
                  .join(", ")}
              />
              <Button
                className="mt-5"
                onClick={() => {
                  setEditBasicInformation(true);
                }}
              >
                Edit
              </Button>
              {movieInfo && (
                <EditBasicInformation
                  open={editBasicInformation}
                  movie_id={movieInfo.id}
                  select={select}
                  defaultValues={{
                    title: movieInfo?.title,
                    description: movieInfo?.description,
                    release_date: new Date(movieInfo?.release_date)
                      ?.toISOString()
                      .split("T")[0],
                    movie_genres: movieInfo.movie_genres.map((d) => {
                      return {
                        label: d.genres?.name,
                        value: d.genres?.id,
                        _id: d.id,
                      };
                    }),
                    movie_languages: movieInfo.movie_languages.map((d) => {
                      return {
                        label: d.languages?.name,
                        value: d.languages?.id,
                        _id: d.id,
                      };
                    }),
                    movie_certificates: movieInfo.movie_certificates.map(
                      (d) => {
                        return {
                          label: d.certificates?.name,
                          value: d.certificates?.id,
                          _id: d.id,
                        };
                      }
                    ),
                    duration: movieInfo.duration?.toString(),
                    slug: movieInfo.slug,
                    movie_tags: movieInfo.movie_tags.map((d) => {
                      return {
                        label: d.tags?.name,
                        value: d.tags?.id,
                        _id: d.id,
                      };
                    }),
                  }}
                  onClose={() => {
                    refetch();
                    setEditBasicInformation(false);
                  }}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl font-bold">
              Published Status
            </AccordionTrigger>
            <AccordionContent>
              <DisplayCard
                title="Published"
                content={JSON.parse(!movieInfo?.is_draft).toString()}
              />
              <DisplayCard
                title="Draft"
                content={movieInfo?.is_draft.toString()}
              />

              <Button
                className="mt-5"
                onClick={async () => {
                  const userconfirm = confirm(
                    `Are you sure you want to change to ${
                      movieInfo?.is_draft ? "Published" : "Draft"
                    }`
                  );

                  if (userconfirm) {
                    try {
                      const movieRsp = await mutate.mutateAsync({
                        query: supabase
                          .from("movies")
                          .update({
                            is_draft: !movieInfo?.is_draft,
                          })
                          .match({ id: movieInfo?.id }),
                      });

                      toast("Movie has been Update.");
                      refetch();
                    } catch (err) {
                      console.log(err);
                      toast.error("Error updating");
                    }
                  }
                }}
              >
                {movieInfo?.is_draft
                  ? "Change to Published"
                  : "Change to Draft"}
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl font-bold">
              Movie Cast
            </AccordionTrigger>
            <AccordionContent>
              {movieInfo?.movie_cast &&
                combineCastInformation(movieInfo?.movie_cast).map((d) => {
                  return (
                    <DisplayCard
                      title={d.cast_roles?.name}
                      content={d.cast_information
                        ?.map((d) => d?.first_name + " " + d?.last_name)
                        .join(", ")}
                    />
                  );
                })}
              <Button
                className="mt-5"
                onClick={() => {
                  setEditCast(true);
                }}
              >
                Edit
              </Button>
              {movieInfo && (
                <EditMovieCast
                  open={editCast}
                  movie_id={movieInfo.id}
                  defaultValues={{
                    movie_cast: combineCastInformation(
                      movieInfo.movie_cast
                    ).map((m) => {
                      return {
                        role_id: {
                          value: m.cast_roles?.id,
                          label: m.cast_roles?.name,
                        },
                        cast_ids: m.cast_information.map((d) => {
                          return {
                            value: d?.id,
                            label: d?.first_name + " " + d?.last_name,
                            _id: d._id,
                          };
                        }),
                        _id: m.id,
                      };
                    }),
                  }}
                  onClose={() => {
                    refetch();
                    setEditCast(false);
                  }}
                />
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl font-bold">
              Release Details & Pricing
            </AccordionTrigger>
            <AccordionContent>
              <DisplayCard
                title="Is Released"
                content={JSON.stringify(movieInfo?.is_released)}
              />
              <DisplayCard
                title="Scheduled Release Date"
                content={new Date(movieInfo?.scheduled_release).toDateString()}
              />
              <DisplayCard
                title="Watching Option"
                content={movieInfo?.watching_option}
              />
              <DisplayCard
                title="Pricing"
                content={movieInfo?.pricing_amount}
              />
              <DisplayCard
                title="Discounted Pricing"
                content={movieInfo?.discounted_pricing_amount}
              />
              <Button
                className="mt-5"
                onClick={() => {
                  setEditRelease(true);
                }}
              >
                Edit
              </Button>
              {movieInfo && (
                <EditReleaseDetailsAndPricing
                  open={editRelease}
                  movie_id={movieInfo.id}
                  defaultValues={{
                    scheduled_release: new Date(movieInfo.scheduled_release)
                      .toISOString()
                      .split("T")[0],
                    watching_option: {
                      value: movieInfo.watching_option,
                      label: movieInfo.watching_option,
                    },
                    pricing_amount: movieInfo.pricing_amount.toString(),
                    discounted_pricing_amount:
                      movieInfo.discounted_pricing_amount.toString(),
                  }}
                  onClose={() => {
                    refetch();
                    setEditRelease(false);
                  }}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-xl font-bold">
              Videos and Posters
            </AccordionTrigger>
            <AccordionContent>
              <p className="font-bold text-lg">
                Videos{" "}
                <span className="text-sm text-red-500 font-normal">
                  {movieVideosArray?.data?.value_json?.length !=
                    movieInfo?.movie_videos.length && "(Update Required)"}
                </span>
              </p>
              {movieInfo?.movie_videos.map((d) => (
                <DisplayCard
                  title={d.type}
                  content={
                    d.video_providers.name + " " + JSON.stringify(d.content)
                  }
                />
              ))}

              <p className="mt-5 font-bold text-lg ink">
                Posters{" "}
                <span className="text-sm text-red-500 font-normal">
                  {moviePostersArray?.data?.value_json?.length !=
                    movieInfo?.movie_posters.length && "(Update Required)"}
                </span>
              </p>
              {movieInfo?.movie_posters.map((d) => (
                <DisplayPoster d={d} key={d.id} />
              ))}
              <Button
                className="mt-5"
                onClick={() => {
                  setEditVideos(true);
                }}
              >
                Edit
              </Button>
              {movieInfo && (
                <EditMovieVideosAndPosters
                  open={editVideos}
                  movie_id={movieInfo.id}
                  defaultValues={{
                    movie_videos: [
                      ...movieInfo.movie_videos.map((d) => {
                        return {
                          content: JSON.stringify(d.content),
                          type: d.type,
                          provider: {
                            label: d.video_providers.name,
                            value: d.video_providers.id,
                          },
                          _id: d.id,
                        };
                      }),
                      ...(movieVideosArray?.data?.value_json
                        .filter(
                          (type) =>
                            !movieInfo.movie_videos.some((d) => d.type === type)
                        )
                        .map((type) => ({
                          content: null,
                          type,
                          provider: null,
                        })) ?? []),
                    ],

                    movie_posters: [
                      ...movieInfo.movie_posters.map((d) => ({
                        url: d.url,
                        type: d.type,
                        _id: d.id,
                      })),
                      ...(moviePostersArray?.data?.value_json
                        .filter(
                          (type) =>
                            !movieInfo.movie_posters.some(
                              (d) => d.type === type
                            )
                        )
                        .map((type) => ({ url: null, type })) ?? []),
                    ],
                  }}
                  onClose={() => {
                    refetch();
                    setEditVideos(false);
                  }}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-xl font-bold">
              Movie Viewing Histroy
            </AccordionTrigger>
            <AccordionContent>
              <ViewingHistoryList movie_id={movieInfo?.id} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger className="text-xl font-bold">
              Payout Histroy
            </AccordionTrigger>
            <AccordionContent>
              <PayoutTransactionList movie_id={movieInfo?.id} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger className="text-xl font-bold">
              Payment Histroy
            </AccordionTrigger>
            <AccordionContent>
              <PaymentTransactionsList movie_id={movieInfo?.id} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-10">
          <Button
            variant="destructive"
            onClick={async () => {
              const cf = confirm("Are you sure you want to DELETE?");
              if (cf) {
                movieInfo.movie_posters.map((d) => {
                  deleteFile({ fileUrl: d.url, bucket: "movie_posters" });
                });
                await mutate.mutateAsync({
                  query: supabase
                    .from("movies")
                    .delete()
                    .match({ id: movieInfo?.id }),
                });
                router.replace("/dashboard/movies");
              }
            }}
          >
            Delete Movie
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}

const DisplayPoster = ({ d }) => {
  const img = useFetchStorage({ url: d.url, bucket: "movie_posters" });
  return (
    <div>
      <DisplayCard title={d.type} content={JSON.stringify(d.url)} />
      {img.url && (
        <img src={img.url} className=" w-[100px] h-full object-cover mt-5" />
      )}
    </div>
  );
};

const DisplayCard = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div className="flex gap-3 capitalize">
      <p>{title}: </p> <p> {content}</p>
    </div>
  );
};
