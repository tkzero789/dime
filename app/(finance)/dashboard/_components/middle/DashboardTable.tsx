import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BudgetExpenseData, IncomeData } from "@/types";
import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import Link from "next/link";

type Props = {
  allData: (IncomeData | BudgetExpenseData)[];
};

export function DashboardTable({ allData }: Props) {
  console.log(allData);

  return (
    <div className="col-span-3 flex h-fit flex-col gap-4 rounded-lg bg-background p-4 xl:col-span-2">
      <h2>Transactions</h2>
      {/* Table */}
      <div className="overflow-auto">
        <Table className="rounded-lg bg-background">
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
                Payment Method
              </TableHead>
              <TableHead className="rounded-r-lg text-right text-sm font-semibold text-secondary-foreground">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allData.length > 0 ? (
              allData
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .slice(0, 10)
                .map((item) => (
                  <TableRow
                    key={item.id}
                    className="text-xs font-medium lg:text-sm"
                  >
                    <TableCell className="px-4 py-2">
                      <FormatDate numMonthNumDateUTC={new Date(item.date)} />
                    </TableCell>
                    <TableCell className="truncate px-4 py-2">
                      {item.name}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {/* <div className="flex items-center gap-2">
                        <div>{item.budget_emoji}</div>
                        <div>{item.budget_category}</div>
                      </div> */}
                      {item.category}
                    </TableCell>
                    <TableCell className="px-4 py-2">
                      {/* <FormatString text={item.payment_source} /> */}
                      Fix
                    </TableCell>
                    <TableCell className="px-4 py-2 text-right font-semibold">
                      $<FormatNumber number={Number(item.amount)} />
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow className="h-24 text-center">
                <TableCell colSpan={5}>
                  <div>Ready to take control of your finances? </div>Click{" "}
                  <Link
                    href="/budgets"
                    className="font-medium text-blue-600 underline hover:text-blue-800"
                  >
                    Add Budget
                  </Link>{" "}
                  or{" "}
                  <Link
                    href="/transaction"
                    className="font-medium text-blue-600 underline hover:text-blue-800"
                  >
                    Add Transaction
                  </Link>{" "}
                  to start your journey.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Button asChild variant="outline" className="w-full">
        <Link href="/transaction">View all transactions</Link>
      </Button>
    </div>
  );
}
