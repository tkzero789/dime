import {
  ArrowLeftRight,
  CircleDollarSign,
  Landmark,
  PiggyBank,
} from "lucide-react";
import React from "react";

export default function ChatTools() {
  return (
    <div className="mx-auto grid grid-cols-[minmax(auto,_220px)_minmax(auto,_220px)] gap-4 overflow-hidden px-4 pt-40 md:px-0">
      <button className="item-center flex h-fit items-center justify-center rounded-lg border border-neutral-300 p-4 transition-all hover:border-neutral-500">
        <div className="item-center flex flex-1 justify-center gap-2">
          <Landmark strokeWidth={2} className="h-6 w-6 stroke-teal-700" />
          <span className="font-medium text-medium">Income</span>
        </div>
      </button>
      <button className="item-center flex h-fit items-center justify-center rounded-lg border border-neutral-300 p-4 transition-all hover:border-neutral-500">
        <div className="item-center flex flex-1 justify-center gap-2">
          <CircleDollarSign
            strokeWidth={2}
            className="h-6 w-6 stroke-teal-700"
          />
          <span className="font-medium text-medium">Spending</span>
        </div>
      </button>
      <button className="item-center flex h-fit items-center justify-center rounded-lg border border-neutral-300 p-4 transition-all hover:border-neutral-500">
        <div className="item-center flex flex-1 justify-center gap-2">
          <ArrowLeftRight strokeWidth={2} className="h-6 w-6 stroke-teal-700" />
          <span className="font-medium text-medium">Transaction</span>
        </div>
      </button>
      <button className="item-center flex h-fit items-center justify-center rounded-lg border border-neutral-300 p-4 transition-all hover:border-neutral-500">
        <div className="item-center flex flex-1 justify-center gap-2">
          <PiggyBank strokeWidth={2} className="h-6 w-6 stroke-teal-700" />
          <span className="font-medium text-medium">Saving</span>
        </div>
      </button>
    </div>
  );
}
