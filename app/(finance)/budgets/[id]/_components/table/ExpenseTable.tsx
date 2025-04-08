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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ExpenseData } from "@/types";
import FormatDate from "@/utils/formatDate";
import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";
import EditExpense from "../mutations/EditExpense";
import TransferExpense from "../mutations/TransferExpense";
import DeleteExpense from "../mutations/DeleteExpense";

type Props = {
  expenseDetail: ExpenseData[];
  currentUser: string | undefined;
  refreshData: () => void;
};

export default function ExpenseTable({
  expenseDetail,
  currentUser,
  refreshData,
}: Props) {
  return (
    <div className="flex h-fit flex-col gap-4 rounded-lg border bg-white p-6">
      <h2 className="text-xl font-bold">Transactions</h2>
      {/* Table */}
      <div className="overflow-auto">
        <Table className="rounded-lg bg-white">
          <TableHeader>
            <TableRow className="pointer-events-none border-none bg-muted">
              <TableHead className="w-[100px] rounded-l-lg text-sm font-semibold text-secondary-foreground">
                Date
              </TableHead>
              <TableHead className="text-sm font-semibold text-secondary-foreground">
                Name
              </TableHead>
              <TableHead className="truncate text-sm font-semibold text-secondary-foreground">
                Payment Method
              </TableHead>
              <TableHead className="text-right text-sm font-semibold text-secondary-foreground">
                Amount
              </TableHead>
              <TableHead className="rounded-r-lg text-center text-sm font-semibold text-secondary-foreground"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenseDetail.length > 0 ? (
              expenseDetail.map((expense) => (
                <TableRow
                  key={expense.id}
                  className="text-xs font-medium lg:text-sm"
                >
                  <TableCell className="px-4 py-2 font-medium">
                    <FormatDate numMonthNumDateUTC={new Date(expense.date)} />
                  </TableCell>
                  <TableCell className="truncate px-4 py-2">
                    {expense.name}
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <FormatString text={expense.payment_method} />
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right font-semibold">
                    $<FormatNumber number={Number(expense.amount)} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Popover>
                      <div>
                        <PopoverTrigger className="flex w-full items-center justify-center">
                          <Ellipsis className="rounded-md transition hover:bg-neutral-200" />
                        </PopoverTrigger>
                      </div>
                      <PopoverContent className="flex w-40 flex-col px-0 py-0">
                        <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
                          Action
                        </div>
                        <div className="p-1">
                          <EditExpense
                            refreshData={refreshData}
                            currentUser={currentUser || "default"}
                            expenseInfo={expense}
                          />
                          <TransferExpense
                            refreshData={refreshData}
                            currentUser={currentUser || "default"}
                            expenseId={expense.id}
                          />
                          <DeleteExpense
                            refreshData={refreshData}
                            currentUser={currentUser || "default"}
                            expenseId={expense.id}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="h-10 text-center">
                <TableCell colSpan={5}>No expenses found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
