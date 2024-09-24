"use client";

import React from "react";
import { RecurrenceDetail } from "@/types/types";
import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FormatDate from "@/utils/formatDate";

type Props = {
  recurringList: RecurrenceDetail[];
};

export default function UpcomingRecurring({ recurringList }: Props) {
  const date = new Date();
  const currentDate = date.getUTCDate();
  const currentMonth = date.getUTCMonth();
  const currentYear = date.getUTCFullYear();

  const filteredSpending = recurringList.filter((item) => {
    const itemDay = new Date(item.date);
    const itemDate = itemDay.getUTCDate();
    const itemMonth = itemDay.getUTCMonth();
    const itemYear = itemDay.getUTCFullYear();

    return (
      itemDate >= currentDate &&
      itemMonth === currentMonth &&
      itemYear === currentYear
    );
  });

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
    <div className="col-span-3 mt-8 h-fit rounded-lg border bg-white p-6 shadow-md xl:col-span-1">
      <h2 className="pb-4 text-xl font-bold">Upcoming bills</h2>
      <div className="flex flex-col gap-4">
        {filteredSpending.length > 0 ? (
          <Table className="border-b">
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
                <TableHead className="text-sm font-semibold text-medium">
                  Payment Method
                </TableHead>
                <TableHead className="text-right text-sm font-semibold text-medium">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSpending.map((item) => (
                <TableRow key={item.id} className="text-sm font-medium">
                  <TableCell className="px-4 py-2 font-medium">
                    <FormatDate numMonthNumDateUTC={new Date(item.date)} />
                  </TableCell>
                  <TableCell className="px-4 py-2">{item.name}</TableCell>
                  <TableCell className="px-4 py-2">
                    <div
                      className={`flex w-fit items-center justify-center rounded-full bg-opacity-50 px-2 py-1 ${getCategory(item.category)}`}
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
