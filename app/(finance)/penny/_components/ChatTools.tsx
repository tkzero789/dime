import { ArrowLeftRight, CircleDollarSign, Landmark } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

type Props = {
  handleUserSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setInput: Dispatch<SetStateAction<string>>;
};

export default function ChatTools({ handleUserSubmit, setInput }: Props) {
  const tools = [
    {
      option: "Savings Forecast",
      icon: Landmark,
      task: "What are my potential saving right now for this month?",
    },
    {
      option: "Budget Snapshot",
      icon: ArrowLeftRight,
      task: "Give me an overall detail about my budgets for this month",
    },
    {
      option: "Finance Tips",
      icon: CircleDollarSign,
      task: "Review and analyze my income and spending. What can I do to improve my current finance situation for this month?",
    },
  ];

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    text: string,
  ) => {
    e.preventDefault();
    setInput(text);
    handleUserSubmit(e);
  };

  return (
    <div className="mx-auto grid w-full grid-cols-1 place-items-center gap-6 overflow-hidden px-12 py-4 pt-40 sm:w-auto md:grid-cols-3 md:px-0">
      {tools.map((t) => (
        <button
          key={t.option}
          className="item-center flex w-4/5 items-center justify-center rounded-lg border p-2 shadow-sm transition-all hover:border-neutral-400 sm:w-full sm:p-4"
          onClick={(e) => handleClick(e, t.task)}
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
