import React from "react";
import { BudgetDetail } from "@/types/types";
import { PiggyBank, ReceiptText, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  budgetList: BudgetDetail[];
};

export default function CardInfo({ budgetList }: Props) {
  const [cardData, setCardData] = React.useState<{
    totalAmount: number;
    totalSpending: number;
  }>();

  React.useEffect(() => {
    if (budgetList) {
      const data = cardInfo();
      setCardData(data);
    }
  }, [budgetList]);

  // Calculate total amount and total spending
  const cardInfo = () => {
    const totalAmount = budgetList
      ?.map((item) => Number(item.amount))
      .reduce((acc, curr) => acc + curr, 0);

    const totalSpending = budgetList
      ?.map((item) => item.totalSpend)
      .reduce((acc, curr) => acc + curr, 0);

    return { totalAmount, totalSpending };
  };

  return (
    <>
      {budgetList ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex items-center justify-between rounded-md border bg-white p-4 shadow-md">
            <div>
              <h2 className="text-sm">Total Budget</h2>
              <span className="text-xl font-bold">
                ${cardData?.totalAmount}
              </span>
            </div>
            <div className="w-fit rounded-full bg-orange-600 p-2">
              <PiggyBank className="stroke-white" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border bg-white p-4 shadow-md">
            <div>
              <h2 className="text-sm">Total Spending</h2>
              <span className="text-xl font-bold">
                ${cardData?.totalSpending}
              </span>
            </div>
            <div className="w-fit rounded-full bg-orange-600 p-2">
              <ReceiptText className="stroke-white" />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border bg-white p-4 shadow-md">
            <div>
              <h2 className="text-sm">Budget Count</h2>
              <span className="text-xl font-bold">{budgetList?.length}</span>
            </div>
            <div className="w-fit rounded-full bg-orange-600 p-2">
              <Wallet className="stroke-white" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <Skeleton
                key={index}
                className="mt-4 h-[82px] w-full bg-gray-200"
              />
            ))}
        </div>
      )}
    </>
  );
}
