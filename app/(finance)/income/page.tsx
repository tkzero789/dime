"use client";

import React from "react";
import { IncomeBarChart } from "./_components/IncomeBarChart";
import { IncomeDetail } from "@/types";
import IncomeTable from "./_components/IncomeTable";
import AddIncome from "./_components/AddIncome";
import FormatMonth from "@/utils/formatMonth";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {
  searchParams: {
    startDate: string;
    endDate: string;
  };
};

async function getIncomeData(searchParams: {
  startDate: string;
  endDate: string;
}): Promise<IncomeDetail[]> {
  const params = new URLSearchParams({
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
  });
  const response = await fetch(`/api/income?${params.toString()}`);
  return response.json();
}

export default function IncomePage({ searchParams }: Props) {
  const router = useRouter();
  const [currentYear, setCurrentYear] = React.useState<number>(() => {
    if (searchParams.startDate && searchParams.endDate) {
      return new Date(searchParams.startDate).getUTCFullYear();
    }
    return new Date().getUTCFullYear();
  });
  const [selectedMonth, setSelectedMonth] = React.useState<string | null>(null);
  const currentMonth = selectedMonth
    ? new Date(Date.parse(`${selectedMonth} 1, 2021`)).getUTCMonth()
    : new Date().getUTCMonth();

  const { data: incomeData, isLoading } = useQuery({
    queryKey: ["income", currentYear],
    queryFn: () =>
      getIncomeData({
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear}-12-31`,
      }),
    select: (data) => ({
      all: data,
      filtered: data?.filter((income) => {
        const incomeDate = new Date(income.date);
        return (
          incomeDate.getUTCMonth() === currentMonth &&
          incomeDate.getFullYear() === currentYear
        );
      }),
    }),
  });

  const handleBarClick = (month: string, year: string) => {
    setSelectedMonth(month);
    setCurrentYear(parseInt(year, 10));
  };

  const handleYearChange = (mode: string) => {
    const newYear = mode === "previous" ? currentYear - 1 : currentYear + 1;
    const newParams = {
      startDate: `${newYear}-01-01`,
      endDate: `${newYear}-12-31`,
    };

    setCurrentYear(newYear);
    router.replace(
      `/income?startDate=${newParams.startDate}&endDate=${newParams.endDate}`,
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Income</h2>
      <IncomeBarChart
        currentYear={currentYear}
        incomeData={incomeData?.all || []}
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
            <AddIncome />
          </div>
          <IncomeTable filteredIncome={incomeData?.filtered || []} />
        </div>
      )}
    </div>
  );
}
