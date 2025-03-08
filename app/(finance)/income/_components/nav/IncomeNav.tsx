"use client";

import React from "react";
import AddIncome from "../AddIncome";

export default function IncomeNav() {
  return (
    <div className="flex items-center justify-between gap-6 rounded-xl bg-white px-6 py-4 shadow-card-shadow">
      <h1 className="text-xl font-semibold">Income</h1>
      <AddIncome />
    </div>
  );
}
