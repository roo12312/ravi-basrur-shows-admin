import BreadCrumb from "@/components/breadcrumb";

import { Tags } from "@/components/movies/tags/list-tags-tables/client";
import { PaymentsHistory } from "@/components/payment-history/list-payment-history-tables/client";
import { PayoutHistory } from "@/components/payout-history/client";

import React from "react";

const breadcrumbItems = [{ title: "Payout History", link: "/dashboard/" }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        {/* <Tags /> */}
        <PayoutHistory />
      </div>
    </>
  );
}
