"use client";
import BreadCrumb from "@/components/breadcrumb";
import { CreateEditCoupons } from "@/components/coupons/CreateEditCoupons";
import { Coupons } from "@/components/coupons/list-coupons-tables/client";

import { useSearchParams } from "next/navigation";

import React from "react";

const breadcrumbItems = [{ title: "Coupons", link: "/dashboard/coupons" }];
export default function page({}) {
  const searchParams = useSearchParams();
  const newCoupon = !!searchParams.get("new_coupon");
  const editCoupon = searchParams.get("edit_coupon");
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Coupons />
        <CreateEditCoupons
          open={newCoupon || !!editCoupon}
          editCouponId={editCoupon}
        />
      </div>
    </>
  );
}
