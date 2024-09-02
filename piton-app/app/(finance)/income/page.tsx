"use client";

import React from "react";
import IncomeList from "./_components/IncomeList";
import { db } from "@/db/dbConfig";
import { Income } from "@/db/schema";
import { and, desc, eq, getTableColumns, gte, lte } from "drizzle-orm";
import { IncomeBarChart } from "./_components/IncomeBarChart";
import { useUser } from "@clerk/nextjs";
import { IncomeDetail } from "@/types/types";

export default function IncomePage() {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;
  const [incomeList, setIncomeList] = React.useState<IncomeDetail[]>([]);
  const [filterIncomeList, setFilterIncomeList] = React.useState<
    IncomeDetail[]
  >([]);
  const [selectedMonth, setSelectedMonth] = React.useState<string | null>(null);

  React.useEffect(() => {
    user && getIncomeData();
  }, [user]);

  React.useEffect(() => {
    getCurrentMonthIncome(
      new Date().getUTCMonth(),
      new Date().getUTCFullYear(),
    );
  }, [incomeList]);

  const getIncomeData = async () => {
    try {
      const result = await db
        .select({ ...getTableColumns(Income) })
        .from(Income)
        .where(eq(Income.created_by, currentUser ?? ""))
        .orderBy(desc(Income.date));

      if (result) {
        setIncomeList(result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentMonthIncome = (month: number, year: number) => {
    const filteredIncomeList = incomeList?.filter((income) => {
      const incomeDate = new Date(income.date);
      return (
        incomeDate.getUTCMonth() === month &&
        incomeDate.getUTCFullYear() === year
      );
    });

    setFilterIncomeList(filteredIncomeList);
  };

  const handleBarClick = (month: string, year: string) => {
    const monthIndex = new Date(Date.parse(month + " 1, 2021")).getUTCMonth();
    const yearNumber = parseInt(year, 10);
    setSelectedMonth(month);
    getCurrentMonthIncome(monthIndex, yearNumber);
  };

  return (
    <div className="min-h-dvh bg-[#f5f5f5] px-4 pb-20 pt-6 sm:px-20 sm:py-16">
      <h2 className="text-2xl font-bold">Income</h2>
      <IncomeBarChart incomeList={incomeList} handleBarClick={handleBarClick} />
      <IncomeList
        filterIncome={filterIncomeList}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
