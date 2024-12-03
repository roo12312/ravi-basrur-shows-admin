"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./input";
import { Button } from "./button";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { useEffect, useMemo, useReducer, useState } from "react";
import { DataTablePagination } from "./DataTablePagination";
import useFetchData from "@/hooks/supabase/useFetchData";

import { PostgrestQueryBuilder } from "@supabase/postgrest-js";
import {
  GenericSchema,
  GenericTable,
} from "@supabase/supabase-js/dist/module/lib/types";
import { keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { supabase } from "@/lib/supabase/client";
import { Skeleton } from "./skeleton";
import { Database } from "@/types/database.types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown, RefreshCcw } from "lucide-react";
import { DataTableAdvancedToolbar } from "./data-table/advanced/data-table-advanced-toolbar";
import { DataTableToolbar } from "./data-table/data-table-toolbar";
import { DataTableFilterField } from "./data-table/datatable.types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  filterFields?: DataTableFilterField<TData>[];
  tableName?: keyof Database["public"]["Tables"];
  advancedFilter?: boolean;
  initialFixedFilter?: any;
  select?: string;
  defaultSort?: {
    id: string;
    desc: boolean;
  }[];
  initalColumnVisiblity?: VisibilityState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  tableName,
  filterFields = [],
  advancedFilter = false,
  initialFixedFilter,
  select = "*",
  defaultSort = [{ id: "updated_at", desc: true }],
  initalColumnVisiblity = { created_at: false, updated_at: false },
}: DataTableProps<TData, TValue>) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>(defaultSort);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initalColumnVisiblity
  );
  const debouncedColumnFilters = useDebounce(columnFilters, 500);

  const memoQuery = useMemo(
    () => {
      let query = supabase.from(tableName!).select(select, { count: "exact" });

      // Apply column filters
      for (const { id, value } of debouncedColumnFilters) {
        if (value) {
          switch (typeof value) {
            case "object": {
              // Handle multiple value filters (e.g., OR condition)
              query = query.filter(
                id,
                "in",
                `(${(value as { join(): string }).join()})`
              );
              break;
            }
            default: {
              // Handle other column types or filter combinations (optional)
              console.log(id.replace("->", "."));
              query = query.filter(
                id.replace("->", "."),
                "ilike",
                `%${value}%`
              ); // Default string filter (ilike)
            }
          }
        }
      }
      if (sorting && sorting.length > 0) {
        const { id, desc } = sorting[0];
        query = query.order(id, { ascending: !desc });
      }

      // Apply pagination (unchanged)
      query = query.range(
        pagination.pageIndex * pagination.pageSize,
        pagination.pageIndex * pagination.pageSize + pagination.pageSize - 1
      );

      if (initialFixedFilter) query = query.match(initialFixedFilter);

      return query;
    },
    [
      pagination,
      debouncedSearch,
      tableName,
      debouncedColumnFilters,
      initialFixedFilter,
      select,
      sorting,
    ] // Include columnFilters in dependencies
  );
  const {
    data: resultData,
    count,
    isFetching,
    isLoading,
    refetch,
    error,
  } = useFetchData({
    query: memoQuery,
    options: {
      enabled: !!tableName,
      // placeholderData: keepPreviousData,
    },
  });

  console.log({ tableName, resultData, error });
  console.log(resultData?.length);

  // console.log(pagination, data?.pages?.[pagination.pageIndex]);
  const table = useReactTable({
    data: [...(data ? data : resultData ?? [])],
    //@ts-ignore
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnVisibility,
      pagination,
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    rowCount: count ?? -1,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    // manualPagination: true,
    // pageCount: -1,
    // initialState: { pageIndex: 0 },
  });

  console.log({ columnFilters, sorting, columnVisibility });
  /* this can be used to get the selectedrows 
  console.log("value", table.getFilteredSelectedRowModel()); */

  return (
    <div className="flex-1">
      <div className="flex items-center ">
        {advancedFilter ? (
          <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
            {/* <TasksTableToolbarActions table={table} /> */}
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table} filterFields={filterFields}>
            {/* <TasksTableToolbarActions table={table} /> */}
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCcw className="mr-2 size-4" aria-hidden="true" />
              Refresh
            </Button>
          </DataTableToolbar>
        )}
      </div>
      <ScrollArea className="rounded-md border h-[calc(80vh-220px)]">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? (
              Array(10)
                .fill(0)
                .map((d, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={columns.length} className="">
                      <Skeleton className="w-full h-[36px] " />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="mt-5">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
