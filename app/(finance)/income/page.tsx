"use client";

import React from "react";
import { db } from "@/db/dbConfig";
import { Income } from "@/db/schema";
import { desc, eq, getTableColumns, and, lte, gte } from "drizzle-orm";
import { IncomeBarChart } from "./_components/IncomeBarChart";
import { useUser } from "@clerk/nextjs";
import { IncomeDetail } from "@/types/types";
import IncomeTable from "./_components/IncomeTable";
import AddIncome from "./_components/AddIncome";
import FormatMonth from "@/utils/formatMonth";
import { CardSkeleton } from "@/components/ui/card-skeleton";

export default function IncomePage() {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [currentYear, setCurrentYear] = React.useState<number>(
    new Date().getUTCFullYear(),
  );

  const firstDayOfYear = `${currentYear}-01-01`;
  const lastDayOfYear = `${currentYear}-12-31`;

  const [incomeList, setIncomeList] = React.useState<IncomeDetail[]>([]);
  const [filterIncomeList, setFilterIncomeList] = React.useState<
    IncomeDetail[]
  >([]);
  const [activeMonth, setActiveMonth] = React.useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const getIncomeData = React.useCallback(async () => {
    try {
      const result = await db
        .select({ ...getTableColumns(Income) })
        .from(Income)
        .where(
          and(
            eq(Income.created_by, currentUser ?? ""),
            gte(Income.date, firstDayOfYear),
            lte(Income.date, lastDayOfYear),
          ),
        )
        .orderBy(desc(Income.date));

      if (result) {
        setIncomeList(result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, firstDayOfYear, lastDayOfYear]);

  const getActiveMonthIncome = React.useCallback(
    (month: number, year: number) => {
      const filteredIncomeList = incomeList?.filter((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.getUTCMonth() === month &&
          incomeDate.getUTCFullYear() === year
        );
      });

      setFilterIncomeList(filteredIncomeList);
    },
    [incomeList],
  );

  React.useEffect(() => {
    if (user) {
      getIncomeData();
    }
  }, [user, getIncomeData]);

  React.useEffect(() => {
    if (activeMonth === null) {
      getActiveMonthIncome(new Date().getUTCMonth(), currentYear);
    } else {
      const activeMonthIndex = new Date(
        Date.parse(activeMonth + " 1, 2021"),
      ).getUTCMonth();
      getActiveMonthIncome(activeMonthIndex, currentYear);
    }
  }, [incomeList, getActiveMonthIncome, currentYear, activeMonth]);

  const handleBarClick = (month: string, year: string) => {
    const monthIndex = new Date(Date.parse(month + " 1, 2021")).getUTCMonth();
    const yearNumber = parseInt(year, 10);
    setSelectedMonth(month);
    setActiveMonth(month);
    getActiveMonthIncome(monthIndex, yearNumber);
  };

  const handleYearChange = (mode: string) => {
    if (mode === "previous") {
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentYear((prev) => prev + 1);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Income</h2>
      <IncomeBarChart
        currentYear={currentYear}
        incomeList={incomeList}
        handleBarClick={handleBarClick}
        handleYearChange={handleYearChange}
      />
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
                <FormatMonth month={selectedMonth} />
              ) : (
                <FormatMonth
                  month={new Date().toLocaleString("en-US", { month: "short" })}
                />
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
          />
        </div>
      )}
    </div>
  );
}
