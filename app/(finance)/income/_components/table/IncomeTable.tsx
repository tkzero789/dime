import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import IncomeTableFilters from "./IncomeTableFilters";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import IncomeTableFilterReset from "./IncomeTableFilterReset";

interface IncomeTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
}

export default function IncomeTable<TData, TValue>({
  data,
  columns,
}: IncomeTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="flex h-fit flex-col gap-4 rounded-xl bg-white p-6 shadow-card-shadow">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Input
            placeholder={`Search by name`}
            // value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            // onChange={(e) =>
            //   table.getColumn("name")?.setFilterValue(e.target.value)
            // }
            className="h-10 max-w-2xl"
          />
          <div className="flex items-center gap-4">
            <IncomeTableFilterReset setColumnFilters={setColumnFilters} />
            <Button variant="outline" size="icon">
              <Ellipsis />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <IncomeTableFilters
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
          />
        </div>
      </div>
      <Table className="rounded-lg bg-white">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none bg-muted">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "truncate text-sm font-semibold text-secondary-foreground",
                      header.id === "amount" && "text-right",
                      header.id === "date" && "rounded-l-lg",
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
        <TableBody>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="p-0 pt-4 text-center"
              >
                <div className="flex h-24 flex-col items-center justify-center rounded-lg border border-dashed">
                  {columnFilters.length === 0 && (
                    <div>No data for this month</div>
                  )}
                  {columnFilters.length !== 0 && (
                    <>
                      <div>Can&apos;t find what you&apos;re looking for?</div>
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
  );
}
