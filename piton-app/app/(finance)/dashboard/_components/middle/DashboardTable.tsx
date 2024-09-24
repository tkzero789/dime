import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import FormatDate from "@/utils/formatDate";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";

type NewExpenseDetail = ExpenseDetail & {
  category: string;
};

type Props = {
  allData: (
    | IncomeDetail
    | NewExpenseDetail
    | RecurrenceDetail
    | SingleDetail
  )[];
};

export function DashboardTable({ allData }: Props) {
  const getCategory = (category: string) => {
    if (
      ["car payment", "credit card payment", "insurance", "loan"].includes(
        category,
      )
    ) {
      return "bg-amber-300 text-amber-700";
    } else if (
      ["Budget Expense", "monthly subscription", "single payment"].includes(
        category,
      )
    ) {
      return "bg-sky-300 text-sky-700";
    } else if (["mortgage", "rent", "bill and utilities"].includes(category)) {
      return "bg-pink-300 text-pink-700";
    } else {
      return "bg-teal-300 text-teal-700";
    }
  };

  return (
    <Table className="rounded-lg bg-white">
      <TableHeader>
        <TableRow className="pointer-events-none border-none bg-neutral-200">
          <TableHead className="w-[100px] rounded-l-lg text-sm font-semibold text-medium">
            Date
          </TableHead>
          <TableHead className="text-sm font-semibold text-medium">
            Name
          </TableHead>
          <TableHead className="text-sm font-semibold text-medium">
            Category
          </TableHead>
          <TableHead className="truncate text-sm font-semibold text-medium">
            Payment Method
          </TableHead>
          <TableHead className="rounded-r-lg text-right text-sm font-semibold text-medium">
            Amount
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allData
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .slice(0, 10)
          .map((item) => (
            <TableRow key={item.id} className="text-xs font-medium lg:text-sm">
              <TableCell className="px-4 py-2">
                <FormatDate numMonthNumDateUTC={new Date(item.date)} />
              </TableCell>
              <TableCell className="px-4 py-2">{item.name}</TableCell>
              <TableCell className="px-4 py-2">
                <div
                  className={`flex w-fit items-center justify-center rounded-full bg-opacity-50 px-2 py-1 ${getCategory(item.category)} `}
                >
                  <span className="truncate text-[13px]">
                    <FormatString text={item.category} />
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-2">
                <FormatString text={item.payment_method} />
              </TableCell>
              <TableCell className="px-4 py-2 text-right font-semibold">
                $<FormatNumber number={Number(item.amount)} />
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
