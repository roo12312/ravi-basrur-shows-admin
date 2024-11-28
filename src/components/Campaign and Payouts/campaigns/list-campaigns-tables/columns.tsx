"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/types/database.types";
import useFetchStorage from "@/hooks/supabase/useFetchStorage";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

export const columns: ColumnDef<Tables<"campaigns">>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Total Amount",
  },
  {
    accessorKey: "reserved_amount",
    header: "Reserved Amount",
  },
  {
    accessorKey: "pay_per_view",
    header: "Pay Per View",
  },
  {
    accessorKey: "start_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: ({ getValue }) => {
      return new Date(getValue() as string).toLocaleTimeString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "end_date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: ({ getValue }) => {
      return new Date(getValue() as string).toLocaleTimeString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "is_draft",
    header: "Draft",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
