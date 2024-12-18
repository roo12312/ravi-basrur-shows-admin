"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const columns: ColumnDef<Tables<"popups">>[] = [
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
    accessorKey: "content.buttonText",
    header: "Button Text",
    // cell: ({ row }) => <span>{row.getValue("content.buttonText")}</span>,
  },
  {
    accessorKey: "content.redirectUrl",
    header: "Redirect URL",
    // cell: ({ row }) => (
    //   <a
    //     href={row.getValue("content.redirectUrl") as string}
    //     target="_blank"
    //     rel="noopener noreferrer"
    //   >
    //     {row.getValue("content.redirectUrl")}
    //   </a>
    // ),
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) =>
      format(new Date(row.getValue("start_date")), "PPP hh:mm aa"),
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) =>
      format(new Date(row.getValue("end_date")), "PPP hh:mm aa"),
  },
  {
    accessorKey: "is_draft",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("is_draft") ? "secondary" : "success"}>
        {row.getValue("is_draft") ? "Draft" : "Published"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
