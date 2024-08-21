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
import FormatDate from "@/utils/formatDate";

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
  const [isClick, setIsClick] = React.useState<string | null>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Handle on click
  const handleOnClick = (expenseId: string) => {
    setIsClick(expenseId);
  };

  // Effect to handle clicks outside of the PopoverTrigger
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
    <div className="col-span-3 hidden h-fit flex-1 rounded-lg border bg-white p-4 shadow-md md:block lg:col-span-3 xl:col-span-2">
      <h2 className="pb-4 text-xl font-bold">Recent Expenses</h2>
      <div className="grid grid-cols-[90px_1fr_120px_140px_80px] gap-2 rounded-lg bg-neutral-200 py-2 text-sm font-semibold text-medium">
        <div className="text-center">Date</div>
        <div className="pl-4">Name</div>
        <div className="text-start">Method</div>
        <div className="text-end">Amount</div>
      </div>

      {expenseDetail.length > 0 ? (
        expenseDetail.map((expense) => (
          <div
            key={expense.id}
            className={`grid grid-cols-[90px_1fr_120px_140px_80px] gap-2 rounded-md border-b py-2 pt-2 text-sm font-medium ${isClick === expense.id ? "bg-neutral-100" : "bg-transparent"}`}
          >
            <div className="text-center">
              <FormatDate numMonthNumDateUTC={new Date(expense.date)} />
            </div>
            <div className="pl-4">{expense.name}</div>
            <div className="text-start">
              {formatPaymentMethod(expense.paymentMethod)}
            </div>
            <div className="text-end">
              $<FormatNumber number={Number(expense.amount)} />
            </div>
            <Popover>
              <div ref={popoverRef}>
                <PopoverTrigger
                  className="group flex w-full items-center justify-center"
                  onClick={() => handleOnClick(expense.id)}
                >
                  <Ellipsis className="rounded-md transition group-hover:bg-neutral-200" />
                </PopoverTrigger>
              </div>
              <PopoverContent className="flex w-40 flex-col px-0 py-0">
                <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
                  Action
                </div>
                <div className="p-1">
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
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center pt-4 text-medium">
          Start tracking your expenses by adding your first entry.
        </div>
      )}
    </div>
  );
}
