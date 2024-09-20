import React from "react";
import { DashboardCalendar } from "./DashboardCalendar";
import { ExpenseDetail, RecurrenceDetail, SingleDetail } from "@/types/types";
import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";
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

type NewExpenseDetail = ExpenseDetail & {
  category: string;
};

type Props = {
  spending: (NewExpenseDetail | RecurrenceDetail | SingleDetail)[];
  getCategory: (category: string) => string;
};

export default function DashboardUpcomingBill({
  spending,
  getCategory,
}: Props) {
  const [date, setDate] = React.useState<Date>(new Date());
  const currentYear = date.getUTCFullYear();
  const currentMonth = date.getUTCMonth();

  const formatDateToUTC = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedDate = formatDateToUTC(date);

  const filteredSpending = spending.filter(
    (item) =>
      item.date === formattedDate &&
      [
        "bill and utilities",
        "car payment",
        "credit card payment",
        "insurance",
        "loan",
        "monthly subscription",
        "mortgage",
        "rent",
      ].includes(item.category),
  );

  const highlightDates = spending
    .filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getUTCFullYear() === currentYear &&
        itemDate.getUTCMonth() === currentMonth &&
        [
          "bill and utilities",
          "car payment",
          "credit card payment",
          "insurance",
          "loan",
          "monthly subscription",
          "mortgage",
          "rent",
        ].includes(item.category)
      );
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((item) => formatDateToUTC(new Date(item.date)));

  return (
    <div className="col-span-3 h-fit rounded-lg border bg-white p-6 shadow-md xl:col-span-1">
      <h2 className="pb-4 text-xl font-bold">Upcoming Recurring</h2>
      <div className="flex flex-col gap-4">
        <DashboardCalendar
          date={date}
          setDate={setDate}
          highlightDates={highlightDates}
        />
        {filteredSpending.length > 0 ? (
          <Table>
            <TableHeader className="border-t">
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpending.map((item) => (
                <TableRow key={item.id} className="text-sm font-medium">
                  <TableCell className="truncate">{item.name}</TableCell>
                  <TableCell>
                    <div
                      className={`flex w-fit items-center justify-center rounded-full bg-opacity-50 px-2 py-1 ${getCategory(item.category)} `}
                    >
                      <span className="truncate text-[13px]">
                        {" "}
                        <FormatString text={item.category} />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {" "}
                    $<FormatNumber number={Number(item.amount)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="border-t pt-2 text-center font-medium text-medium">
            No recurring payments on this day
          </div>
        )}
      </div>
    </div>
  );
}
