import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import {
  BadgeDollarSign,
  Banknote,
  BookPlus,
  CalendarHeart,
  CarFront,
  CircleDollarSign,
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
  aggregatedDataCategory: AggregatedExpenseDetail[];
  isSwitch: boolean;
};

export default function SpendingBreakdown({
  aggregatedDataCategory,
  isSwitch,
}: Props) {
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

  const total = aggregatedDataCategory.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0,
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = new Date().getUTCMonth();

  return (
    <div className="col-span-4 flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-md xl:col-span-4 2xl:col-span-2">
      <h2 className="text-xl font-bold tracking-normal">
        {isSwitch ? `${months[currentMonth]}` : `${months[currentMonth - 1]}`}{" "}
      </h2>

      <ul className="flex flex-col gap-4">
        {aggregatedDataCategory.map((data, index) => (
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
        <CircleDollarSign className="h-6 w-6 stroke-[#555353]" />
        <span>Total</span>
        <span className="ml-auto font-bold text-dark">
          $<FormatNumber number={total} />
        </span>
      </div>
    </div>
  );
}
