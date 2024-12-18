"use client";
import { CreateEditAds } from "@/components/Campaign and Payouts/ads/CreateEditAds";
import { Ads } from "@/components/Campaign and Payouts/ads/list-ads-tables/client";
import BreadCrumb from "@/components/breadcrumb";

import { Tags } from "@/components/movies/tags/list-tags-tables/client";
import { CreateEditPopup } from "@/components/popups/CreateEditPopups";
import { Popups } from "@/components/popups/list-popups-table/client";
import { useSearchParams } from "next/navigation";

import React from "react";

const breadcrumbItems = [{ title: "popups", link: "/movies/tags" }];
export default function page({}) {
  const searchParams = useSearchParams();
  const newpopup = !!searchParams.get("new_popup");
  const editpopup = searchParams.get("edit_popup");
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Popups />
        <CreateEditPopup
          open={newpopup || !!editpopup}
          editPopupId={editpopup}
        />
      </div>
    </>
  );
}
