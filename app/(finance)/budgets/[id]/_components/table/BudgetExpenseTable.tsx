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
import { AccountData, BudgetExpenseData } from "@/types";
import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import DeleteBudgetExpense from "../mutations/DeleteBudgetExpense";
import { Button } from "@/components/ui/button";
import EditExpense from "../mutations/EditExpense";
import { cn } from "@/lib/utils";

type Props = {
  budgetExpenseData: BudgetExpenseData[];
  accountData: AccountData[];
};

export default function BudgetExpenseTable({
  budgetExpenseData,
  accountData,
}: Props) {
  return (
    <div className="flex h-fit flex-col gap-4 rounded-lg bg-white p-6 shadow-card-shadow">
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
              <TableHead className="text-sm font-semibold text-secondary-foreground">
                Category
              </TableHead>
              <TableHead className="truncate text-sm font-semibold text-secondary-foreground">
                Account
              </TableHead>
              <TableHead className="text-right text-sm font-semibold text-secondary-foreground">
                Amount
              </TableHead>
              <TableHead className="rounded-r-lg text-center text-sm font-semibold text-secondary-foreground"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetExpenseData.length > 0 ? (
              budgetExpenseData.map((item) => (
                <TableRow
                  key={item.id}
                  className="text-xs font-medium lg:text-sm"
                >
                  <TableCell className="px-4 py-2 font-medium">
                    <FormatDate numMonthNumDateUTC={new Date(item.date)} />
                  </TableCell>
                  <TableCell className="truncate px-4 py-2">
                    {item.name}
                  </TableCell>
                  <TableCell className="truncate px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div>{item.budget_emoji}</div>
                      <div>{item.budget_category}</div>
                    </div>
                  </TableCell>
                  <TableCell className="truncate px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "size-2 rounded-full bg-gradient-to-br",
                          item.account_color,
                        )}
                      ></div>
                      <div>{item.account_name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right font-semibold">
                    $<FormatNumber number={Number(item.amount)} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Popover>
                      <div>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="data-[state=open]:bg-muted"
                          >
                            <Ellipsis />
                          </Button>
                        </PopoverTrigger>
                      </div>
                      <PopoverContent
                        align="end"
                        className="flex w-40 flex-col p-0"
                      >
                        <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
                          Action
                        </div>
                        <div className="p-1">
                          <EditExpense
                            budgetExpenseData={item}
                            accountData={accountData}
                          />
                          {/* <TransferExpense expenseId={expense.id} /> */}
                          <DeleteBudgetExpense
                            budgetId={item.budget_id ?? ""}
                            expenseId={item.id}
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
