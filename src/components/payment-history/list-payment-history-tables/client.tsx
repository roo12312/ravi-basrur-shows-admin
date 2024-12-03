"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./columns";
import useFetchData from "@/hooks/supabase/useFetchData";
import { supabase } from "@/lib/supabase/client";
import { useMemo } from "react";
import useInfiniteFetchData from "@/hooks/supabase/useInfiniteFetchData";
import { keepPreviousData } from "@tanstack/react-query";
import { DataTableFilterField } from "@/components/ui/data-table/datatable.types";
import { Tables } from "@/types/database.types";

interface ProductsClientProps {}

const filterFields: DataTableFilterField<Tables<"coupons">>[] = [
  {
    label: "coupon",
    value: "coupon",
    placeholder: "Filter coupon",
  },
  {
    label: "Draft",
    value: "is_draft",
    options: ["true", "false"].map((status) => ({
      label: status,
      value: status,
    })),
  },
];

export const PaymentsHistory: React.FC<ProductsClientProps> = ({}) => {
  const router = useRouter();
  const pathName = usePathname();

  const filterFields: DataTableFilterField<Tables<"payment_transactions">>[] = [
    {
      label: "movie",
      value: "movies->title",
      placeholder: "Filter movie",
    },
    {
      label: "user",
      value: "profiles->phone_number",
      placeholder: "Filter User",
    },
    // {
    //   label: "Payment Gateway",
    //   value: "payment_gateway",
    //   placeholder: "Filter payment gateway",
    // },
    {
      label: "Status",
      value: "status",
      options: ["initiated", "pending", "success", "failed", "refunded"].map(
        (status) => ({
          label: status[0]?.toUpperCase() + status.slice(1),
          value: status,
          // icon: getStatusIcon(status),
          withCount: true,
        })
      ),
    },
    // {
    //   label: "Priority",
    //   value: "priority",
    //   options: tasks.priority.enumValues.map((priority) => ({
    //     label: priority[0]?.toUpperCase() + priority.slice(1),
    //     value: priority,
    //     icon: getPriorityIcon(priority),
    //     withCount: true,
    //   })),
    // },
  ];

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`Payment History`} description="Manage Payments" />
        {/* <Button
          className="text-xs md:text-sm"
          onClick={() => {
            router.push(pathName + "?new_coupon=true");
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button> */}
      </div>
      <Separator />
      <DataTable
        filterFields={filterFields}
        columns={columns}
        tableName="payment_transactions"
        // initialFixedFilter={{ user_id: user_id }}
        select="*,movies!inner(*),profiles!inner(*)"
        initalColumnVisiblity={{ updated_at: false, response: false }}
      />
    </>
  );
};
