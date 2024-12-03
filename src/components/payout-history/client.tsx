"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { User } from "@/constants/data";
import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./columns";
import { Tables } from "@/types/database.types";
import { filterNullKeys } from "@/lib/commonFunctions";

interface Props {}
interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
}
interface DataTableFilterField<TData> {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: Option[];
}

export const PayoutHistory: React.FC<Props> = ({}) => {
  const router = useRouter();
  const pathName = usePathname();

  const filterFields: DataTableFilterField<Tables<"payout_transactions">>[] = [
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
      options: [
        "initial",
        "not qualified",
        "processing",
        "processed",
        "success",
      ].map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        // icon: getStatusIcon(status),
        withCount: true,
      })),
    },
    {
      label: "Backend Status",
      value: "backend_status",
      options: [
        "initial",
        "not qualified",
        "processing",
        "processed",
        "success",
      ].map((status) => ({
        label: status[0]?.toUpperCase() + status.slice(1),
        value: status,
        // icon: getStatusIcon(status),
        withCount: true,
      })),
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
        <Heading title={`Payout History`} description="Manage Payments" />
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
        tableName="payout_transactions"
        select="*,movies!inner(*),profiles!inner(*)"
        initalColumnVisiblity={{
          http_response: false,
        }}
      />
    </>
  );
};
