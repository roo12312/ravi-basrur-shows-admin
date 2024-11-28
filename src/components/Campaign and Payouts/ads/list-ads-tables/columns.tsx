"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

import { Checkbox } from "@/components/ui/checkbox";
import { Tables } from "@/types/database.types";
import useFetchStorage from "@/hooks/supabase/useFetchStorage";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

export const columns: ColumnDef<Tables<"ads">>[] = [
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
  // {
  //   accessorKey: "ad_content",
  //   header: "Ad Content",
  //   cell: ({ row, getValue }) => {
  //     const img = useFetchStorage({
  //       url: getValue().data as string,
  //       bucket: "ads",
  //     });

  //     return (
  //       <Avatar>
  //         <AvatarImage src={img.url} />
  //       </Avatar>
  //     );
  //   },
  // },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "ad_content",
    cell: ({ row, getValue }) => {
      return <p>{JSON.stringify(getValue())}</p>;
    },
    header: "Ad Content",
  },
  {
    accessorKey: "description",
    header: "Description",
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
