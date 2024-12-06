"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/types/database.types";
import { supabase } from "@/lib/supabase/client";
import useFetchData from "@/hooks/supabase/useFetchData";

export const columns: ColumnDef<Tables<"push_notifications">>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",

    header: "Title",
  },
  {
    accessorKey: "body",
    header: "Body",
  },
  {
    accessorKey: "success_count",
    header: "Success Count",
  },
  {
    accessorKey: "failure_count",
    header: "Failure Count",
  },
  {
    accessorKey: "clicks",
    header: "Push Notification Clicks",
    cell: ({ row }) => {
      const notificationId = row.original.id;

      // Use useFetchData hook to fetch click count for each notification
      const {
        data: clicksData,
        error,
        count,
      } = useFetchData({
        query: supabase
          .from("push_notification_clicks")
          .select("id", { count: "exact", head: true })
          .eq("notification_id", notificationId),

        options: {
          enabled: !!notificationId,
        },
      });

      console.log({ clicksData });
      if (error) {
        return "Error fetching clicks"; // Handle error state
      }

      // Return the count of clicks or 0 if no data
      return count || 0;
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
];
