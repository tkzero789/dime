"use client";

import React from "react";
import { RecurrenceDetail } from "@/types/types";
import FormatDate from "@/utils/formatDate";
import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";
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
import { useUser } from "@clerk/nextjs";
import { Ellipsis } from "lucide-react";
import EditRecurring from "./EditRecurring";
import DeleteRecurring from "./DeleteRecurring";

type Props = {
  recurringList: RecurrenceDetail[];
};

export default function RecurringTable({ recurringList }: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  React.useEffect(() => {
    user && calculateTotalAmount();
  }, [user, recurringList]);

  const [totalAmount, setTotalAmount] = React.useState<number>(0);
  const calculateTotalAmount = () => {
    const totalAmount = recurringList.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0,
    );
    setTotalAmount(totalAmount);
  };

  const [isClick, setIsClick] = React.useState<string | null>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Handle on click
  const handleOnClick = (incomeId: string) => {
    setIsClick(incomeId);
  };

  // Effect to handle clicks outside of the PopoverTrigger (remove the bg-neutral-200 on the income item)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsClick(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <TableHead className="text-sm font-semibold text-medium">
            Payment Method
          </TableHead>
          <TableHead className="text-sm font-semibold text-medium">
            Repeat
          </TableHead>
          <TableHead className="text-right text-sm font-semibold text-medium">
            Amount
          </TableHead>
          <TableHead className="rounded-r-lg text-center text-sm font-semibold text-medium"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recurringList.map((item) => (
          <TableRow
            key={item.id}
            className={`text-xs font-medium lg:text-sm ${isClick === item.id ? "bg-neutral-100" : ""}`}
          >
            <TableCell className="px-4 py-2 font-medium">
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
            <TableCell className="px-4 py-2">Monthly</TableCell>
            <TableCell className="px-4 py-2 text-right font-semibold">
              $<FormatNumber number={Number(item.amount)} />
            </TableCell>
            <TableCell className="px-4 py-2 text-center">
              <Popover>
                <div ref={popoverRef}>
                  <PopoverTrigger
                    className="flex w-full items-center justify-center"
                    onClick={() => handleOnClick(item.id)}
                  >
                    <Ellipsis className="rounded-md transition hover:bg-neutral-200" />
                  </PopoverTrigger>
                </div>

                <PopoverContent className="flex w-40 flex-col px-0 py-0">
                  <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
                    Action
                  </div>
                  <div className="p-1">
                    <EditRecurring
                      currentUser={currentUser || "default"}
                      recurringInfo={item}
                    />
                    <DeleteRecurring
                      currentUser={currentUser || "default"}
                      recurringId={item.id}
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
            colSpan={5}
            className="rounded-bl-lg text-sm font-semibold text-medium"
          >
            Total
          </TableCell>
          <TableCell className="text-right font-bold">
            -$
            <FormatNumber number={totalAmount} />
          </TableCell>
          <TableCell className="rounded-br-lg"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
