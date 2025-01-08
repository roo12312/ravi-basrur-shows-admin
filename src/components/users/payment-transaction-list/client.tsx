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

interface Props {
  user_id: "string";
}
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

export const PaymentTransactionsList: React.FC<Props> = ({
  user_id,
  movie_id,
}) => {
  const router = useRouter();
  const pathName = usePathname();

  const filterFields: DataTableFilterField<Tables<"payment_transactions">>[] = [
    {
      label: "movie",
      value: "movies->title",
      placeholder: "Filter movie",
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
      <DataTable
        filterFields={filterFields}
        columns={columns}
        tableName="payment_transactions"
        initialFixedFilter={filterNullKeys({ user_id, movie_id })}
        select="*,movies!inner(*)"
        initalColumnVisiblity={{ updated_at: false }}
      />
    </>
  );
};
