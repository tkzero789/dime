"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
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
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddTransaction from "./AddTransaction";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function TransactionTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  const handlePageChange = (direction: "previous" | "next") => {
    if (direction === "previous") {
      table.previousPage();
    } else {
      table.nextPage();
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div>
      <div className="mt-8 flex items-center">
        <Input
          placeholder="Search transaction..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
        />
      </div>
      <div className="mt-8 rounded-lg border bg-white p-6 shadow-md">
        <div className="flex flex-col justify-between gap-2 pb-4 md:flex-row md:items-center md:gap-0">
          <h2 className="text-xl font-bold">Latest transactions</h2>
          <AddTransaction />
        </div>
        <Table className="rounded-lg bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-none bg-neutral-200 hover:bg-neutral-200"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-sm font-semibold text-medium ${header.id === "amount" && "text-right"} ${header.id === "date" && "rounded-l-lg"} ${header.id === "actions" && "rounded-r-lg"} `}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                  className="text-xs font-medium lg:text-sm"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`truncate px-4 py-2 ${cell.column.id === "actions" && "flex items-center justify-center"}`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center gap-2 py-4">
        <Button
          variant="outline"
          onClick={() => handlePageChange("previous")}
          disabled={!table.getCanPreviousPage()}
          className="w-28"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => handlePageChange("next")}
          disabled={!table.getCanNextPage()}
          className="w-28"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
