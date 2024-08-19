import React from "react";
import FormatNumber from "@/utils/formatNumber";
import EditExpense from "./EditExpense";
import DeleteExpense from "./DeleteExpense";
import { ExpenseDetail } from "@/types/types";
import { Ellipsis } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TransferExpense from "./TransferExpense";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  expenseDetail: ExpenseDetail[];
  currentUser: string | undefined;
  refreshData: () => void;
};

export default function ExpenseList({
  expenseDetail,
  currentUser,
  refreshData,
}: Props) {
  // Format expense date
  const formatDate = (date: string) => {
    const splitDate = date.split("-");
    return splitDate[1] + "/" + splitDate[2];
  };

  // Format payment method
  const formatPaymentMethod = (payment: string) => {
    return payment
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Correct date displays for datepicker in edit expense
  const convertToLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <div className="mt-3">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-[90px_1fr_120px_140px_80px] gap-2 rounded-t-xl bg-teal-700 py-2 text-white">
          <div className="text-center">Date</div>
          <div className="pl-4">Name</div>
          <div className="text-start">Method</div>
          <div className="text-end">Amount</div>
        </div>
        {expenseDetail.map((expense, index) => (
          <div
            key={index}
            className="grid grid-cols-[90px_1fr_120px_140px_80px] gap-2 border-b bg-white py-2 pt-2"
          >
            <div className="text-center">{formatDate(expense.date)}</div>
            <div className="pl-4">{expense.name}</div>
            <div className="text-start">
              {formatPaymentMethod(expense.paymentMethod)}
            </div>
            <div className="text-end">
              $<FormatNumber number={Number(expense.amount)} />
            </div>
            <Popover>
              <PopoverTrigger className="flex items-center justify-center">
                <Ellipsis />
              </PopoverTrigger>
              <PopoverContent className="flex w-fit flex-col gap-2">
                <EditExpense
                  refreshData={refreshData}
                  currentUser={currentUser || "default"}
                  expenseId={expense.id}
                  name={expense.name}
                  amount={expense.amount}
                  date={convertToLocalDate(expense.date)}
                  method={expense.paymentMethod}
                />
                <TransferExpense
                  refreshData={refreshData}
                  currentUser={currentUser || "default"}
                  expenseId={expense.id}
                />
                <DeleteExpense
                  refreshData={refreshData}
                  currentUser={currentUser || "default"}
                  expenseId={expense.id}
                />
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>
    </div>
  );
}
