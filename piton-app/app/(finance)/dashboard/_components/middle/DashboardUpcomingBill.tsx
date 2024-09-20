import React from "react";
import { DashboardCalendar } from "./DashboardCalendar";
import { ExpenseDetail, RecurrenceDetail, SingleDetail } from "@/types/types";
import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";

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
        <ul className="flex flex-col gap-4 border-t pt-4">
          {filteredSpending.length > 0 ? (
            filteredSpending.map((item) => (
              <li key={item.id} className="grid grid-cols-[200px_200px_1fr]">
                <span className="truncate font-medium text-medium">
                  {item.name}
                </span>
                <span
                  className={`ml-2 flex w-fit items-center justify-center rounded-full bg-opacity-50 px-2 py-1 text-start text-[13px] font-semibold ${getCategory(item.category)}`}
                >
                  <FormatString text={item.category} />
                </span>
                <span className="ml-auto font-semibold">
                  $<FormatNumber number={Number(item.amount)} />
                </span>
              </li>
            ))
          ) : (
            <li className="text-center font-medium text-medium">
              No recurring payments on this day
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
