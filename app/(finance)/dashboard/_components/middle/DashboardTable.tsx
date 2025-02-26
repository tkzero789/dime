import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ExpenseDetailWithCategory,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types";
import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import getTransactionCategory from "@/utils/getTransactionCategory";
import Link from "next/link";

type Props = {
  allData: (
    | IncomeDetail
    | ExpenseDetailWithCategory
    | RecurrenceDetail
    | SingleDetail
  )[];
};

export function DashboardTable({ allData }: Props) {
  return (
    <Table className="rounded-lg bg-white">
      <TableHeader>
        <TableRow className="pointer-events-none border-none bg-neutral-200">
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
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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
                  <div
                    className={cn(
                      "flex w-fit items-center justify-center truncate rounded-full bg-opacity-50 px-2 py-1 text-[13px]",
                      getTransactionCategory(item.category),
                    )}
                  >
                    <FormatString text={item.category} />
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2">
                  <FormatString text={item.payment_method} />
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
  );
}
