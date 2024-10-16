import { Check } from "lucide-react";
import React from "react";

export default function BenefitSection() {
  return (
    <div className="mt-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-medium">
          Embrace the Power of Manual Budgeting
        </h1>
        <p className="mt-4 text-base text-medium">
          Discover why our users love the simplicity and control of manual data
          entry
        </p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-y-4">
        <div className="col-span-2 flex items-center justify-center gap-2 pl-2 md:col-span-1 lg:pl-0">
          <div className="flex w-auto justify-start lg:w-1/4 lg:justify-end">
            <div className="rounded-full bg-green-500 bg-opacity-50 p-1">
              <Check className="h-4 w-4 stroke-green-700" />
            </div>
          </div>
          <div className="flex-1">
            Complete control over your financial data
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-center gap-2 pl-2 md:col-span-1 lg:pl-0">
          <div className="flex w-auto justify-start lg:w-1/4 lg:justify-end">
            <div className="rounded-full bg-green-500 bg-opacity-50 p-1">
              <Check className="h-4 w-4 stroke-green-700" />
            </div>
          </div>
          <div className="flex-1">
            Increased awareness of your spending habits
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-center gap-2 pl-2 md:col-span-1 lg:pl-0">
          <div className="flex w-auto justify-start lg:w-1/4 lg:justify-end">
            <div className="rounded-full bg-green-500 bg-opacity-50 p-1">
              <Check className="h-4 w-4 stroke-green-700" />
            </div>
          </div>
          <div className="flex-1">
            No need for complex integrations with bank acconts
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-center gap-2 pl-2 md:col-span-1 lg:pl-0">
          <div className="flex w-auto justify-start lg:w-1/4 lg:justify-end">
            <div className="rounded-full bg-green-500 bg-opacity-50 p-1">
              <Check className="h-4 w-4 stroke-green-700" />
            </div>
          </div>
          <div className="flex-1">
            Encourage regular engagement with your budget
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-center gap-2 pl-2 md:col-span-1 lg:pl-0">
          <div className="flex w-auto justify-start lg:w-1/4 lg:justify-end">
            <div className="rounded-full bg-green-500 bg-opacity-50 p-1">
              <Check className="h-4 w-4 stroke-green-700" />
            </div>
          </div>
          <div className="flex-1">
            Enhanced privacy and security of your financial data
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-center gap-2 pl-2 md:col-span-1 lg:pl-0">
          <div className="flex w-auto justify-start lg:w-1/4 lg:justify-end">
            <div className="rounded-full bg-green-500 bg-opacity-50 p-1">
              <Check className="h-4 w-4 stroke-green-700" />
            </div>
          </div>
          <div className="flex-1">
            Flexibility to categorize budgets exactly how you want
          </div>
        </div>
      </div>
    </div>
  );
}
