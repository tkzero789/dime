"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Ellipsis, Info } from "lucide-react";
import FormatNumber from "@/utils/formatNumber";
import { RecurringRule } from "@/types";
import FormatString from "@/utils/formatString";
import { db } from "@/db/dbConfig";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { Recurrence, Recurring_rule } from "@/db/schema";
import PayRecurring from "./PayRecurring";
import EditRecurring from "./EditRecurring";
import DeleteRecurring from "./DeleteRecurring";
import FormatDate from "@/utils/formatDate";
import ViewRecurring from "./ViewRecurring";
import getTransactionCategory from "@/utils/getTransactionCategory";

type Props = {
  ruleList: RecurringRule[];
  currentUser: string;
};

export default function RecurringTable({ ruleList, currentUser }: Props) {
  const currentMonth = new Date().getUTCMonth() + 1;
  const currentYear = new Date().getUTCFullYear();
  const [isPaid, setIsPaid] = React.useState<Record<string, boolean>>({});
  const [totalAmount, setTotalAmount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const getData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const activeRules = await db
        .select({ ...getTableColumns(Recurring_rule) })
        .from(Recurring_rule)
        .where(eq(Recurring_rule.is_active, true));

      const paidStatus: Record<string, boolean> = {};

      for (const rule of activeRules) {
        const recurrenceExist = await db
          .select({ ...getTableColumns(Recurrence) })
          .from(Recurrence)
          .where(
            and(
              eq(Recurrence.rule_id, rule.id),
              sql`EXTRACT(MONTH FROM ${Recurrence.date}) = ${currentMonth}`,
              sql`EXTRACT(YEAR FROM ${Recurrence.date}) = ${currentYear}`,
            ),
          )
          .limit(1);

        paidStatus[rule.id] = recurrenceExist.length > 0;
      }
      setIsPaid(paidStatus);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, [currentMonth, currentYear]);

  React.useEffect(() => {
    const calculate = () => {
      const total = ruleList.reduce(
        (acc, curr) => acc + Number(curr.amount),
        0,
      );
      setTotalAmount(total);
    };

    if (currentUser) {
      getData();
      calculate();
    }
  }, [currentUser, ruleList, currentMonth, currentYear, getData]);

  return (
    <div className="w-full overflow-auto">
      <Table className="rounded-lg bg-white">
        <TableHeader>
          <TableRow className="border-none bg-neutral-200 hover:bg-neutral-200">
            <TableHead className="w-[100px] truncate rounded-l-lg text-sm font-semibold text-secondary-foreground">
              Due date
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
            <TableHead className="text-sm font-semibold text-secondary-foreground">
              Repeat
            </TableHead>
            <TableHead className="flex items-center gap-1 text-sm font-semibold text-secondary-foreground">
              Status
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild className="cursor-pointer">
                    <Info
                      strokeWidth={2}
                      color="#555353"
                      className="h-4 w-4 hover:stroke-gray-700"
                    />
                  </TooltipTrigger>
                  <TooltipContent className="mr-8 max-w-64 border shadow-lg">
                    <p className="font-normal text-secondary-foreground">
                      Mark as &quot;Paid&quot; only if the payment is paid for
                      the current month
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableHead>
            <TableHead className="text-right text-sm font-semibold text-secondary-foreground">
              Amount
            </TableHead>
            <TableHead className="rounded-r-lg text-center text-sm font-semibold text-secondary-foreground"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ruleList?.length > 0 ? (
            ruleList.map((item) => (
              <TableRow
                key={item.id}
                className={`text-xs font-medium lg:text-sm`}
              >
                <TableCell className="px-4 py-2 font-medium">
                  <FormatDate numMonthNumDateUTC={new Date(item.due_date)} />
                </TableCell>
                <TableCell className="truncate px-4 py-2">
                  {item.name}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div
                    className={`flex w-fit items-center justify-center rounded-full bg-opacity-50 px-2 py-1 ${getTransactionCategory(item.category)} `}
                  >
                    <span className="truncate text-[13px]">
                      <FormatString text={item.category} />
                    </span>
                  </div>
                </TableCell>
                <TableCell className="truncate px-4 py-2">
                  <FormatString text={item.payment_method} />
                </TableCell>
                <TableCell className="px-4 py-2">
                  <FormatString text={item.frequency} />
                </TableCell>
                <TableCell className="px-4 py-2">
                  <div
                    className={`rounded-md bg-opacity-50 px-2 py-1 text-[13px] ${!isLoading ? (isPaid[item.id] ? "w-fit bg-green-300 text-green-700" : "w-fit bg-red-300 text-red-700") : "h-[28px] w-[60px] animate-pulse bg-gray-200"}`}
                  >
                    {isLoading ? "" : isPaid[item.id] ? "Paid" : "Unpaid"}
                  </div>
                </TableCell>
                <TableCell className="px-4 py-2 text-right font-semibold">
                  $<FormatNumber number={Number(item.amount)} />
                </TableCell>
                <TableCell className="px-4 py-2 text-center">
                  <Popover>
                    <div>
                      <PopoverTrigger className="flex w-full items-center justify-center">
                        <Ellipsis className="rounded-md transition hover:bg-neutral-200" />
                      </PopoverTrigger>
                    </div>

                    <PopoverContent className="flex flex-col px-0 py-0">
                      <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
                        Action
                      </div>
                      <div className="p-1">
                        {!isPaid[item.id] && (
                          <PayRecurring
                            recurringInfo={item}
                            isPaid={isPaid}
                            refreshData={() => getData()}
                          />
                        )}
                        <ViewRecurring recurringInfo={item} isPaid={isPaid} />
                        <EditRecurring
                          recurringInfo={item}
                          currentUser={currentUser}
                        />
                        <DeleteRecurring
                          recurringId={item.id}
                          currentUser={currentUser || "default"}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Click the <span className="font-semibold">&apos;Add&apos;</span>{" "}
                button to set up your first recurring payment.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow className="pointer-events-none bg-neutral-200">
            <TableCell
              colSpan={6}
              className="rounded-bl-lg text-sm font-semibold text-secondary-foreground"
            >
              Total
            </TableCell>
            <TableCell className="text-right font-bold">
              $
              <FormatNumber number={totalAmount} />
            </TableCell>
            <TableCell className="rounded-br-lg"></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
