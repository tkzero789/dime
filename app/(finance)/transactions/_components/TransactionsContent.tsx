"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getTransactionData } from "@/lib/api/transactions";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { CardSkeleton } from "@/components/ui/card-skeleton";

import { TransactionsTableColumns } from "./table/TransactionsTableColumn";
import TransactionsTable from "./table/TransactionsTable";
import TransactionsNav from "./nav/TransactionsNav";

type Props = {
  searchParams: {
    startDate: string;
    endDate: string;
  };
};

export default function TransactionsContent({ searchParams }: Props) {
  const router = useRouter();
  const [currentYear, setCurrentYear] = React.useState<number>(() => {
    if (searchParams.startDate && searchParams.endDate) {
      return new Date(searchParams.startDate).getUTCFullYear();
    }
    return new Date().getUTCFullYear();
  });

  const { data: transactionData, isLoading } = useQuery({
    queryKey: queryKeys.transactions.byYear(currentYear),
    queryFn: () =>
      getTransactionData({
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear}-12-31`,
      }),
    select: (data) => ({
      all: data,
    }),
  });

  const handleYearChange = (year: number) => {
    const newParams = {
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`,
    };
    setCurrentYear(year);
    router.replace(
      `/transactions?startDate=${newParams.startDate}&endDate=${newParams.endDate}`,
    );
  };

  return (
    <>
      <TransactionsNav
        currentYear={currentYear}
        handleYearChange={handleYearChange}
      />
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <CardSkeleton
            title={true}
            titleWidth={20}
            rectangle={1}
            height={10}
            style="mt-4 xl:mt-8"
          />
        ) : (
          <TransactionsTable
            data={transactionData?.all || []}
            columns={TransactionsTableColumns}
          />
        )}
      </div>
    </>
  );
}
