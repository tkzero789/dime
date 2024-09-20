import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseDetail, RecurrenceDetail, SingleDetail } from "@/types/types";
import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import Link from "next/link";

type NewExpenseDetail = ExpenseDetail & {
  category: string;
};

type Props = {
  spending: (NewExpenseDetail | RecurrenceDetail | SingleDetail)[];
};

export function TestTable({ spending }: Props) {
  const getCategory = (category: string) => {
    if (
      ["car payment", "credit card payment", "insurance", "loan"].includes(
        category,
      )
    ) {
      return "bg-sky-300 text-sky-700";
    } else if (
      ["Budget Expense", "monthly subscription", "single payment"].includes(
        category,
      )
    ) {
      return "bg-teal-300 text-teal-700";
    } else if (["mortgage", "rent", "bill and utilities"].includes(category)) {
      return "bg-pink-300 text-pink-700";
    } else {
      return "bg-amber-300 text-amber-700";
    }
  };
  return (
    <Table className="rounded-lg bg-white">
      <TableHeader>
        <TableRow className="pointer-events-none bg-neutral-200 text-sm font-semibold text-medium">
          <TableHead className="w-[100px] rounded-tl-lg">Invoice</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead className="rounded-tr-lg text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {spending
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .slice(0, 10)
          .map((item) => (
            <TableRow key={item.id} className="text-xs font-medium lg:text-sm">
              <TableCell className="font-medium">
                <FormatDate numMonthNumDateUTC={new Date(item.date)} />
              </TableCell>
              <TableCell className="">{item.name}</TableCell>
              <TableCell>
                <div
                  className={`flex w-fit items-center justify-center rounded-full bg-opacity-50 px-2 py-1 ${getCategory(item.category)} `}
                >
                  <span>
                    <FormatString text={item.category} />
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <FormatString text={item.payment_method} />
              </TableCell>
              <TableCell className="text-right font-semibold">
                $<FormatNumber number={Number(item.amount)} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
