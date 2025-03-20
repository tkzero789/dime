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
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import IncomeTableFilters from "./IncomeTableFilters";
import IncomeTableFilterReset from "./IncomeTableFilterReset";
import IncomeTableSearch from "./IncomeTableSearch";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IncomeTablePagination } from "./IncomeTablePagination";
import useWindowSize from "@/hooks/useWindowSize";

interface IncomeTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
}

export default function IncomeTable<TData, TValue>({
  data,
  columns,
}: IncomeTableProps<TData, TValue>) {
  const tableRef = React.useRef<HTMLTableSectionElement>(null);
  const { width } = useWindowSize();
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      category: true,
      payment_method: true,
    });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
    },
  });

  React.useEffect(() => {
    if (width !== undefined) {
      setColumnVisibility((prev) => ({
        ...prev,
        category: width >= 1024,
        payment_method: width >= 1024,
      }));
    }
  }, [width]);

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-card-shadow">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <IncomeTableSearch
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
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
      <div
        ref={tableRef}
        className="relative max-h-[536px] w-full overflow-auto"
      >
        <Table className="rounded-lg bg-white">
          <TableHeader className="sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none bg-muted">
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
                    {columnFilters.length === 0 && <div>No income data</div>}
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
      <IncomeTablePagination table={table} tableRef={tableRef} />
    </div>
  );
}
