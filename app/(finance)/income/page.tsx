"use client";

import React from "react";
import IncomeList from "./_components/IncomeList";
import { db } from "@/db/dbConfig";
import { Income } from "@/db/schema";
import { and, desc, eq, getTableColumns, gte, lte } from "drizzle-orm";
import { IncomeBarChart } from "./_components/IncomeBarChart";
import { useUser } from "@clerk/nextjs";
import { IncomeDetail } from "@/types/types";
import IncomeTable from "./_components/IncomeTable";
import GetCurrentMonth from "@/utils/getCurrentMonth";
import AddIncome from "./_components/AddIncome";
import FormatMonth from "@/utils/formatMonth";
import { CardSkeleton } from "@/components/ui/card-skeleton";

export default function IncomePage() {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;
  const [incomeList, setIncomeList] = React.useState<IncomeDetail[]>([]);
  const [filterIncomeList, setFilterIncomeList] = React.useState<
    IncomeDetail[]
  >([]);
  const [selectedMonth, setSelectedMonth] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

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
    setIsLoading(true);
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
    setIsLoading(false);
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
    <div className="sm:py-18 min-h-dvh w-dvw bg-[#f5f5f5] px-2 pb-20 pt-6 md:w-full md:px-4 xl:px-20">
      <h2 className="text-2xl font-bold">Income</h2>
      <IncomeBarChart incomeList={incomeList} handleBarClick={handleBarClick} />
      {isLoading ? (
        <CardSkeleton
          title={true}
          titleWidth={20}
          rectangle={1}
          height={10}
          style="mt-4 xl:mt-8"
        />
      ) : (
        <div className="mt-4 h-fit rounded-lg border bg-white p-6 shadow-md xl:mt-8">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-xl font-bold">
              {selectedMonth ? (
                <FormatMonth monthYear={selectedMonth} />
              ) : (
                <GetCurrentMonth monthYear={new Date()} />
              )}
            </h2>
            <AddIncome
              currentUser={currentUser || "default"}
              refreshData={getIncomeData}
            />
          </div>

          <IncomeTable
            filterIncome={filterIncomeList}
            refreshData={getIncomeData}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
