"use client";

import React from "react";
import IncomeTable from "./_components/table/IncomeTable";
import IncomeNav from "./_components/nav/IncomeNav";
import IncomeSummary from "./_components/IncomeSummary";
import { IncomeBarChart } from "./_components/chart/IncomeBarChart";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getIncomeData } from "@/lib/api/income";
import { IncomeTableColumns } from "./_components/table/IncomeTableColumns";
import { queryKeys } from "@/lib/queryKeys";

type Props = {
  searchParams: {
    startDate: string;
    endDate: string;
  };
};

export default function IncomePage({ searchParams }: Props) {
  const router = useRouter();
  const [currentYear, setCurrentYear] = React.useState<number>(() => {
    if (searchParams.startDate && searchParams.endDate) {
      return new Date(searchParams.startDate).getUTCFullYear();
    }
    return new Date().getUTCFullYear();
  });

  const { data: incomeData, isLoading } = useQuery({
    queryKey: queryKeys.income.byYear(currentYear),
    queryFn: () =>
      getIncomeData({
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear}-12-31`,
      }),
    select: (data) => ({
      all: data,
    }),
  });

  const handleChangeYear = (year: number) => {
    const newParams = {
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
    };
    setCurrentYear(year);
    router.replace(
      `/income?startDate=${newParams.startDate}&endDate=${newParams.endDate}`,
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <IncomeNav
        currentYear={currentYear}
        handleChangeYear={handleChangeYear}
      />
      <div className="grid grid-cols-3 gap-6">
        <IncomeBarChart incomeData={incomeData?.all || []} />
        <IncomeSummary incomeData={incomeData?.all || []} />
      </div>
      {isLoading ? (
        <CardSkeleton
          title={true}
          titleWidth={20}
          rectangle={1}
          height={10}
          style="mt-4 xl:mt-8"
        />
      ) : (
        <IncomeTable
          data={incomeData?.all || []}
          columns={IncomeTableColumns}
        />
      )}
    </div>
  );
}
