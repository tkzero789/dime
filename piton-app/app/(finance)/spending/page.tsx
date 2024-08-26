import React from "react";
import { SpendingBarChart } from "./_components/chart/SpendingBarChart";

export default function SpendingPage() {
  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-4 py-6 sm:px-20 sm:py-16">
      <h2 className="text-2xl font-bold">Spending</h2>
      <SpendingBarChart />
    </div>
  );
}
