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
import { Ellipsis } from "lucide-react";
import FormatNumber from "@/utils/formatNumber";
import { RecurringRule } from "@/types/types";
import FormatString from "@/utils/formatString";
import EditFrequency from "./EditFrequency";
import { db } from "@/db/dbConfig";
import { eq, getTableColumns } from "drizzle-orm";
import { Recurrence, Recurring_rule } from "@/db/schema";
import DeleteFrequency from "./DeleteFrequency";
import PayFrequency from "./PayFrequency";

type Props = {
  ruleList: RecurringRule[];
  currentUser: string;
};

export default function FrequencyTable({ ruleList, currentUser }: Props) {
  const currentMonth = new Date().getUTCMonth();

  const [isPaid, setIsPaid] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    currentUser && getData();
  }, [currentUser]);

  const getData = async () => {
    try {
      const activeRules = await db
        .select({ ...getTableColumns(Recurring_rule) })
        .from(Recurring_rule)
        .where(eq(Recurring_rule.isActive, true));

      const paidStatus: Record<string, boolean> = {};

      for (const rule of activeRules) {
        const recurrenceExist = await db
          .select({ ...getTableColumns(Recurrence) })
          .from(Recurrence)
          .where(eq(Recurrence.rule_id, rule.id))
          .limit(1);

        paidStatus[rule.id] = recurrenceExist.length > 0;

        setIsPaid(paidStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Table className="rounded-lg bg-white">
      <TableHeader>
        <TableRow className="pointer-events-none border-none bg-neutral-200">
          <TableHead className="w-[100px] rounded-l-lg text-sm font-semibold text-medium">
            Due date
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
          <TableHead className="text-sm font-semibold text-medium">
            Repeat
          </TableHead>
          <TableHead className="text-sm font-semibold text-medium">
            Status
          </TableHead>
          <TableHead className="text-right text-sm font-semibold text-medium">
            Amount
          </TableHead>
          <TableHead className="rounded-r-lg text-center text-sm font-semibold text-medium"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ruleList.map((item) => (
          <TableRow key={item.id} className={`text-xs font-medium lg:text-sm`}>
            <TableCell className="px-4 py-2 font-medium">
              {currentMonth}/
              <FormatNumber number={Number(item.due_date)} />
            </TableCell>
            <TableCell className="truncate px-4 py-2">{item.name}</TableCell>
            <TableCell className="px-4 py-2">
              <div
                className={`flex w-fit items-center justify-center rounded-full bg-opacity-50 px-2 py-1`}
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
              {isPaid[item.id] ? "Paid" : "Unpaid"}
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

                <PopoverContent className="flex w-40 flex-col px-0 py-0">
                  <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
                    Action
                  </div>
                  <div className="p-1">
                    <PayFrequency recurringInfo={item} />
                    <EditFrequency
                      recurringInfo={item}
                      currentUser={currentUser}
                    />
                    <DeleteFrequency
                      recurringId={item.id}
                      currentUser={currentUser || "default"}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow className="pointer-events-none bg-neutral-200">
          <TableCell
            colSpan={6}
            className="rounded-bl-lg text-sm font-semibold text-medium"
          >
            Total
          </TableCell>
          <TableCell className="text-right font-bold">
            -$
            {/* <FormatNumber number={totalAmount} /> */}
          </TableCell>
          <TableCell className="rounded-br-lg"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
