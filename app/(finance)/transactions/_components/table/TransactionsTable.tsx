"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { TablePagination } from "@/app/(finance)/_components/table/TablePagination";

import TableFiltersReset from "@/app/(finance)/_components/table/TableFiltersReset";
import { useDesktop } from "@/hooks/use-desktop";
import TransactionsFilters from "./TransactionsFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props<TData, TValue> = {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  showHeader?: boolean;
  showPagination?: boolean;
};

export default function TransactionsTable<TData, TValue>({
  data,
  columns,
  showHeader = true,
  showPagination = true,
}: Props<TData, TValue>) {
  const isDesktop = useDesktop();
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const [sortOption, setSortOption] = React.useState<string>("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <Card>
      {/* Search & filters */}
      {showHeader && (
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Transactions</CardTitle>
          <div className="lg:hidden">
            <TransactionsFilters
              sortOption={sortOption}
              setSortOption={setSortOption}
              sorting={sorting}
              setSorting={setSorting}
              columnFilters={columnFilters}
              setColumnFilters={setColumnFilters}
            />
          </div>
          {isDesktop && (
            <div className="hidden items-center gap-2 lg:flex">
              <TransactionsFilters
                sortOption={sortOption}
                setSortOption={setSortOption}
                sorting={sorting}
                setSorting={setSorting}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
              />
              <TableFiltersReset
                setSortOption={setSortOption}
                setSorting={setSorting}
                setColumnFilters={setColumnFilters}
              />
            </div>
          )}
        </CardHeader>
      )}
      <CardContent
        className={cn(!showHeader && "p-0", !showPagination && "p-0")}
      >
        {/* Table */}
        <div className="flex flex-col gap-4">
          <div
            ref={tableRef}
            className="relative max-h-[536px] w-full overflow-auto"
          >
            <Table className="rounded-lg bg-background">
              <TableHeader className="sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-none bg-muted"
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={cn(
                            "truncate text-sm font-semibold text-secondary-foreground",
                            header.id === "date" && "rounded-l-lg",
                            header.id === "amount" && "text-right",
                            header.id === "actions" && "rounded-r-lg",
                          )}
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
              <TableBody className="t-body">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows?.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="text-xs font-medium lg:text-sm"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "truncate px-4 py-2",
                            cell.column.id === "actions" &&
                              "flex items-center justify-center",
                          )}
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
                  <TableRow className="border-b-0">
                    <TableCell
                      colSpan={columns.length}
                      className="p-0 pt-4 text-center"
                    >
                      <div className="flex h-24 flex-col items-center justify-center rounded-lg border border-dashed">
                        {columnFilters.length === 0 && (
                          <div>No income data</div>
                        )}
                        {columnFilters.length !== 0 && (
                          <>
                            <div>
                              Can&apos;t find what you&apos;re looking for?
                            </div>
                            <div>Try using advanced filters</div>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {showPagination && (
            <TablePagination table={table} tableRef={tableRef} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
