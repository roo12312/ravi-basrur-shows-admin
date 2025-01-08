"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/types/database.types";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

export const columns: ColumnDef<Tables<"payment_transactions">>[] = [
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
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "movies->title",
    accessorFn: (row) => row.movies.title,
    header: "Movie",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },

  {
    accessorKey: "profiles->phone_number",
    header: "User",
    accessorFn: (row) => row.profiles.phone_number,
  },

  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
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
    accessorKey: "updated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
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
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const variant = useMemo(() => {
        switch (getValue()) {
          case "initiated":
            return "primary";
          case "pending":
            return "warning";
          case "failed":
            return "destructive";
          case "success":
            return "success";
          // ... other status cases
          default:
            return "secondary";
        }
      }, [getValue]);

      return <Badge variant={variant}>{getValue()}</Badge>;
    },
  },
  {
    accessorKey: "payment_gateway",
    header: "Payment Gateway",
  },
  {
    accessorKey: "coupon",
    header: "Coupon",
    cell: ({ row, getValue }) =>
      row.getValue("response")?.coupon
        ? row.getValue("response")?.coupon?.coupon_amount +
          " (" +
          row.getValue("response")?.coupon?.coupon +
          ")"
        : null,
  },
  {
    accessorKey: "response",
    header: "Response",
    cell: ({ getValue }) => JSON.stringify(getValue()),
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
];
