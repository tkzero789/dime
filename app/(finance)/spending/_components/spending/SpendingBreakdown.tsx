import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import {
  BadgeDollarSign,
  Banknote,
  BookPlus,
  CalendarHeart,
  CarFront,
  CreditCard,
  HandCoins,
  House,
  Sheet,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import React from "react";

type AggregatedExpenseDetail = {
  category: string;
  amount: number;
  fill: string;
};

type Props = {
  aggregatedData: AggregatedExpenseDetail[];
};

export default function SpendingBreakdown({ aggregatedData }: Props) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Budget Expense":
        return <Banknote color="#0ea5e9" className="h-6 w-6" />;
      case "single payment":
        return <HandCoins color="#0ea5e9" className="h-6 w-6" />;
      case "bill and utilities":
        return <Wallet color="#ec4899" className="h-6 w-6" />;
      case "car payment":
        return <CarFront color="#f59e0b" className="h-6 w-6" />;
      case "credit card payment":
        return <CreditCard color="#f59e0b" className="h-6 w-6" />;
      case "insurance":
        return <ShieldCheck color="#f59e0b" className="h-6 w-6" />;
      case "loan":
        return <Sheet color="#f59e0b" className="h-6 w-6" />;
      case "monthly subscription":
        return <CalendarHeart color="#0ea5e9" className="h-6 w-6" />;
      case "mortgage":
        return <House color="#ec4899" className="h-6 w-6" />;
      case "rent":
        return <BookPlus color="#ec4899" className="h-6 w-6" />;

      default:
        return null;
    }
  };

  const total = aggregatedData.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0,
  );

  return (
    <div className="col-span-3 flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-md xl:col-span-1">
      <h2 className="text-xl font-bold">Breakdown</h2>
      <ul className="flex flex-col gap-4">
        {aggregatedData.map((data, index) => (
          <li
            key={index}
            className="flex gap-x-6 text-base font-semibold text-medium"
          >
            <span>{getCategoryIcon(data.category)}</span>
            <span>
              <FormatString text={data.category} />
            </span>
            <span className="ml-auto font-bold text-dark">
              $<FormatNumber number={data.amount} />
            </span>
          </li>
        ))}
      </ul>
      <div className="flex gap-x-6 text-base font-semibold text-medium">
        <span className="h-6 w-6"></span>
        <span>Total</span>
        <span className="ml-auto font-bold text-dark">${total}</span>
      </div>
    </div>
  );
}
