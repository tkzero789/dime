import { ArrowLeftRight, CircleDollarSign, Landmark } from "lucide-react";
import React, { MutableRefObject } from "react";

type Props = {
  handleInputChange: (e: any) => void;
};

export default function ChatTools({ handleInputChange }: Props) {
  const tools = [
    {
      option: "Savings Forecast",
      icon: Landmark,
      task: "Test",
    },
    {
      option: "Budget Snapshot",
      icon: ArrowLeftRight,
      task: "Test2",
    },
    {
      option: "Finance Tips",
      icon: CircleDollarSign,
      task: "Test4",
    },
  ];

  return (
    <div className="mx-auto grid w-full grid-cols-1 place-items-center gap-6 overflow-hidden px-12 py-4 pt-40 sm:w-auto md:grid-cols-3 md:px-0">
      {tools.map((t) => (
        <button
          key={t.option}
          className="item-center flex w-4/5 items-center justify-center rounded-lg border p-2 shadow-sm hover:border-neutral-400 sm:w-full sm:p-4"
        >
          <div className="item-center flex flex-col justify-center gap-2">
            <div className="flex items-center justify-center">
              <span className="rounded-full bg-teal-200 bg-opacity-50 p-2">
                <t.icon strokeWidth={2} className="h-6 w-6 stroke-teal-700" />
              </span>
            </div>
            <span className="text-sm font-semibold text-teal-700">
              {t.option}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
