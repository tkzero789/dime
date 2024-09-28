import { ArrowLeftRight, CircleDollarSign, Landmark } from "lucide-react";
import React from "react";

export default function ChatTools() {
  return (
    <div className="mx-auto grid w-full grid-cols-1 gap-4 overflow-hidden px-12 pt-40 sm:w-auto md:grid-cols-[repeat(3,_minmax(auto,_180px))] md:px-0">
      <button className="item-center flex h-fit items-center justify-center rounded-full border bg-teal-500 bg-opacity-30 px-0 py-2 transition-all hover:bg-opacity-50 sm:px-4 sm:py-3">
        <div className="item-center flex w-full justify-center gap-2">
          <span className="flex w-2/5 justify-end sm:block sm:w-auto">
            <Landmark strokeWidth={2} className="h-6 w-6 stroke-teal-700" />
          </span>
          <span className="flex-1 text-start font-medium text-teal-700 sm:flex-none">
            Income
          </span>
        </div>
      </button>
      <button className="item-center flex h-fit items-center justify-center rounded-full border bg-teal-500 bg-opacity-30 px-0 py-2 transition-all hover:bg-opacity-50 sm:px-4 sm:py-3">
        <div className="item-center flex w-full justify-center gap-2">
          <span className="flex w-2/5 justify-end sm:block sm:w-auto">
            <ArrowLeftRight
              strokeWidth={2}
              className="h-6 w-6 stroke-teal-700"
            />
          </span>
          <span className="flex-1 text-start font-medium text-teal-700 sm:flex-none">
            Transaction
          </span>
        </div>
      </button>
      <button className="item-center flex h-fit items-center justify-center rounded-full border bg-teal-500 bg-opacity-30 px-0 py-2 transition-all hover:bg-opacity-50 sm:px-4 sm:py-3">
        <div className="item-center flex w-full justify-center gap-2">
          <span className="flex w-2/5 justify-end sm:block sm:w-auto">
            <CircleDollarSign
              strokeWidth={2}
              className="h-6 w-6 stroke-teal-700"
            />
          </span>
          <span className="flex-1 text-start font-medium text-teal-700 sm:flex-none">
            Spending
          </span>
        </div>
      </button>
    </div>
  );
}
