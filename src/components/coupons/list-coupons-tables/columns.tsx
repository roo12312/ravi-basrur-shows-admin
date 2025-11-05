"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/types/database.types";
import useFetchStorage from "@/hooks/supabase/useFetchStorage";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import useFetchData from "@/hooks/supabase/useFetchData";

interface MovieTitleFetcherProps {
  ids: string[]; // Array of movie IDs
}

const MovieTitleFetcher: React.FC<MovieTitleFetcherProps> = ({ ids }) => {
  const { data, isLoading, error } = useFetchData({
    query: supabase.from("movies").select("id, title").in("id", ids), // Fetch titles for the given IDs
  });

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {error.message}</span>;

  if (!data || data.length === 0) return <span> empty</span>;

  // Join the movie titles into a string to display
  const titles = data.map((movie: { title: string }) => movie.title).join(", ");

  return <span> {titles}</span>;
};

export const columns: ColumnDef<Tables<"coupons">>[] = [
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
    accessorKey: "coupon",
    header: "Coupon Code",
  },
  {
    accessorKey: "description",
    header: "Coupon Description",
  },
  {
    accessorKey: "coupon_amount",
    header: "Amount",
    cell: ({ getValue }) => getValue() || "N/A",
  },
  // {
  //   accessorKey: "coupon_percentage",
  //   header: "Percentage",
  //   cell: ({ getValue }) => (getValue() ? `${getValue()}%` : "N/A"),
  // },
  // {
  //   accessorKey: "coupon_max_discount",
  //   header: "Max Discount",
  //   cell: ({ getValue }) => getValue() || "N/A",
  // },

  {
    accessorKey: "valid_until",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valid Until" />
    ),
    cell: ({ getValue }) => {
      const valid = new Date(getValue() as string) > new Date();
      return (
        <>
          <p>
            {new Date(getValue() as string).toLocaleTimeString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <Badge
            variant={!valid ? "destructive" : "success"} // Use green if draft is true, yellow otherwise
            className="text-sm"
          >
            {!valid ? "Expired" : "Valid"}
          </Badge>
        </>
      );
    },
  },
  {
    accessorKey: "max_uses",
    header: "Max Uses",
  },
  {
    accessorKey: "coupon_used_times",
    header: "Coupon Used Times",
  },
  // Import the Badge component from your UI library

  {
    accessorKey: "is_draft",
    header: "Published",
    cell: ({ getValue }) => (
      <Badge
        variant={getValue() ? "outline" : "success"} // Use green if draft is true, yellow otherwise
        className="text-sm"
      >
        {getValue() ? "No" : "Yes"}
      </Badge>
    ),
  },

  {
    accessorKey: "applicable_for",
    header: "Applicable For",
    cell: ({ getValue }) => {
      const applicableFor = getValue();
      if (!applicableFor) return "N/A";

      return (
        <div>
          <strong>Category:</strong>
          <span> {applicableFor.categories.join(", ")}</span>
          <br />
          <strong>Include:</strong>

          <MovieTitleFetcher ids={applicableFor.include} />
          <br />
          <strong>Exclude:</strong>
          <MovieTitleFetcher ids={applicableFor.exclude} />
        </div>
      );
    },
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
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
