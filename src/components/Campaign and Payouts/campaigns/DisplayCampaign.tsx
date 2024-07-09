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

import { Button } from "@/components/ui/button";

import useFetchStorage from "@/hooks/supabase/useFetchStorage";

import useMutationData from "@/hooks/supabase/useMutationData";
import { useRouter } from "next/navigation";
import useDeleteSingleFile from "../../../hooks/supabase/useDeleteSingleFile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewingHistoryList } from "@/components/users/viewing-history-list/client";
import { toast } from "sonner";
import { CreateEditCampaign } from "./CreateEditCampaign";
import { CreateEditCampaignAd } from "./CreateEditCampaignAd";
import { PayoutTransactionList } from "@/components/users/payout-transaction-list/client";

export default function DisplayCampaign({ id }: { id: string }) {
  const [editCampaign, setEditCampaign] = useState(false);
  const [addAd, setAddAd] = useState(false);
  const [editAd, setEditAd] = useState(false);
  const [editVideos, setEditVideos] = useState(false);
  const mutate = useMutationData();
  const router = useRouter();
  const deleteFile = useDeleteSingleFile();
  const select = "*,movies(*),campaign_ads(*, ads(*))";
  const {
    data: campaign,
    error,
    refetch,
  } = useFetchData({
    query: supabase
      .from("campaigns")
      .select(select)
      .match({
        id: id,
      })
      .single(),
  });

  console.log(campaign, error);

  return (
    <div className="overflow-y-auto flex-1">
      <ScrollArea className="flex-1 h-[75vh]">
        <Accordion type="multiple" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold">
              Campaign Information
            </AccordionTrigger>
            <AccordionContent>
              <DisplayCard title="Name" content={campaign?.name} />
              <DisplayCard
                title="Description"
                content={campaign?.description}
              />
              <DisplayCard title="Movie" content={campaign?.movies.title} />
              <DisplayCard
                title="Pay per view"
                content={campaign?.pay_per_view}
              />
              <DisplayCard title="Amount" content={campaign?.amount} />
              <DisplayCard
                title="Reserved Amount"
                content={campaign?.reserved_amount}
              />

              <DisplayCard
                title="Start Date"
                content={new Date(campaign?.start_date).toDateString()}
              />
              <DisplayCard
                title="End Date"
                content={new Date(campaign?.end_date).toDateString()}
              />

              <Button
                className="mt-5"
                onClick={() => {
                  setEditCampaign(true);
                }}
              >
                Edit
              </Button>
              <CreateEditCampaign
                open={editCampaign}
                editCampaignId={id}
                onClose={() => {
                  setEditCampaign(false);
                  refetch();
                }}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger className="text-xl font-bold">
              Published Status
            </AccordionTrigger>
            <AccordionContent>
              <DisplayCard
                title="Published"
                content={JSON.parse(!campaign?.is_draft).toString()}
              />
              <DisplayCard
                title="Draft"
                content={campaign?.is_draft.toString()}
              />

              <Button
                className="mt-5"
                onClick={async () => {
                  const userconfirm = confirm(
                    `Are you sure you want to change to ${
                      campaign?.is_draft ? "Published" : "Draft"
                    }`
                  );

                  if (userconfirm) {
                    try {
                      const movieRsp = await mutate.mutateAsync({
                        query: supabase
                          .from("campaigns")
                          .update({
                            is_draft: !campaign?.is_draft,
                          })
                          .match({ id: campaign?.id }),
                      });

                      toast("Campaign has been Update.");
                      refetch();
                    } catch (err) {
                      console.log(err);
                      toast.error("Error updating");
                    }
                  }
                }}
              >
                {campaign?.is_draft ? "Change to Published" : "Change to Draft"}
              </Button>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl font-bold">
              Ads
            </AccordionTrigger>
            <AccordionContent>
              {campaign?.campaign_ads &&
                campaign?.campaign_ads.map((d, index) => {
                  return (
                    <div key={d.id} className="flex flex-row gap-5">
                      <p>{index + 1}.</p>
                      <div className="pb-2 border-b-2 ">
                        <DisplayCard title={"Ad Name"} content={d.ads.name} />
                        <DisplayCard
                          title={"Ad Start Time"}
                          content={d.ad_start_time}
                        />
                        <DisplayCard
                          title={"Ad Duration"}
                          content={d.duration}
                        />
                        <div className="mt-5 flex flex-row gap-5  items-center">
                          <Button
                            className=""
                            onClick={() => {
                              setEditAd(d);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={async () => {
                              const cf = confirm(
                                "Are you sure you want to DELETE?"
                              );
                              if (cf) {
                                await mutate.mutateAsync({
                                  query: supabase
                                    .from("campaign_ads")
                                    .delete()
                                    .match({ id: d?.id }),
                                });
                                refetch();
                              }
                            }}
                          >
                            Delete Ad
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              <Button
                className="mt-5"
                onClick={() => {
                  setAddAd(true);
                }}
              >
                Add New Ad
              </Button>
              <CreateEditCampaignAd
                open={addAd || editAd}
                campaignId={id}
                editCampaignAd={editAd}
                onClose={() => {
                  setAddAd(false);
                  setEditAd(false);
                  refetch();
                }}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl font-bold">
              Payout Histroy
            </AccordionTrigger>
            <AccordionContent>
              <PayoutTransactionList campaign_id={campaign?.id} />
            </AccordionContent>
          </AccordionItem>
          {/* <AccordionItem value="item-3">
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

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl font-bold">
              Videos and Posters
            </AccordionTrigger>
            <AccordionContent>
              <p className="font-bold text-lg">Videos</p>
              {movieInfo?.movie_videos.map((d) => (
                <DisplayCard
                  title={d.type}
                  content={
                    d.video_providers.name + " " + JSON.stringify(d.content)
                  }
                />
              ))}

              <p className="mt-5 font-bold text-lg">Posters</p>
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
                    movie_videos:
                      movieInfo.movie_videos.length < 3
                        ? [
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
                            {
                              content: null,
                              type: "teaser",
                              provider: null,
                            },
                          ]
                        : movieInfo.movie_videos.map((d) => {
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

                    movie_posters:
                      movieInfo.movie_posters.length < 4
                        ? [
                            ...movieInfo.movie_posters.map((d) => {
                              return {
                                url: d.url,
                                type: d.type,
                                _id: d.id,
                              };
                            }),
                            {
                              url: null,
                              type: "homebanner-16x5",
                            },
                            {
                              url: null,
                              type: "playerthumbnail-16x9",
                            },
                            {
                              url: null,
                              type: "title",
                            },
                          ]
                        : movieInfo.movie_posters.map((d) => {
                            return {
                              url: d.url,
                              type: d.type,
                              _id: d.id,
                            };
                          }),
                  }}
                  onClose={() => {
                    refetch();
                    setEditVideos(false);
                  }}
                />
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-xl font-bold">
              Movie Viewing Histroy
            </AccordionTrigger>
            <AccordionContent>
              <ViewingHistoryList movie_id={movieInfo?.id} />
            </AccordionContent>
          </AccordionItem> */}
        </Accordion>
        <div className="mt-10">
          <Button
            variant="destructive"
            onClick={async () => {
              const cf = confirm("Are you sure you want to DELETE?");
              if (cf) {
                await mutate.mutateAsync({
                  query: supabase
                    .from("campaigns")
                    .delete()
                    .match({ id: campaign?.id }),
                });
                router.replace("/dashboard/campaigns");
              }
            }}
          >
            Delete Campaign
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
