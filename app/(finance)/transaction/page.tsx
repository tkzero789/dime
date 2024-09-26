"use client";

import React from "react";
import TransactionSearch from "./_components/search/TransactionSearch";
import { useUser } from "@clerk/nextjs";
import { BudgetExpenses, Income, Recurrence, Single } from "@/db/schema";
import { and, eq, getTableColumns, gte, lte } from "drizzle-orm";
import { db } from "@/db/dbConfig";
import {
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import { BatchResponse } from "drizzle-orm/batch";
import LoadMoreTransaction from "./_components/list/LoadMoreTransaction";
import TransactionTable from "./_components/list/TransactionTable";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddTransaction from "./_components/list/AddTransaction";

type NewIncomeDetail = IncomeDetail & {
  type: string;
};

type NewExpenseDetail = ExpenseDetail & {
  category: string;
  type: string;
};

type NewRecurrenceDetail = RecurrenceDetail & {
  type: string;
};

type NewSingleDetail = SingleDetail & {
  type: string;
};

export default function TransactionPage() {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [transaction, setTransaction] = React.useState<
    (
      | NewIncomeDetail
      | NewExpenseDetail
      | NewRecurrenceDetail
      | NewSingleDetail
    )[]
  >([]);
  const [transactionCount, setTransactionCount] = React.useState<number>(0);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const [currentMonth, setCurrentMonth] = React.useState<number>(
    new Date().getUTCMonth(),
  );
  const [currentYear, setCurrentYear] = React.useState<number>(
    new Date().getUTCFullYear(),
  );

  React.useEffect(() => {
    user && getData(1);
  }, [user, currentMonth, currentYear]);

  React.useEffect(() => {
    if (page > 1) {
      getData(page);
    }
  }, [page]);

  React.useEffect(() => {
    return () => {
      // Cleanup function to reset state when component unmounts
      setTransaction([]);
      setSearchQuery("");
      setPage(1);
    };
  }, []);

  const getData = React.useCallback(
    async (page: number) => {
      try {
        const firstDayOfMonth = new Date(
          Date.UTC(currentYear, currentMonth, 1),
        ).toISOString();
        const lastDayOfMonth = new Date(
          Date.UTC(currentYear, currentMonth + 1, 0),
        ).toISOString();

        const batchResponse: BatchResponse<any> = await db.batch([
          db
            .select({ ...getTableColumns(Income) })
            .from(Income)
            .where(
              and(
                eq(Income.created_by, currentUser ?? ""),
                gte(Income.date, firstDayOfMonth),
                lte(Income.date, lastDayOfMonth),
              ),
            ),
          db
            .select({
              ...getTableColumns(BudgetExpenses),
            })
            .from(BudgetExpenses)
            .where(
              and(
                eq(BudgetExpenses.created_by, currentUser ?? ""),
                gte(BudgetExpenses.date, firstDayOfMonth),
                lte(BudgetExpenses.date, lastDayOfMonth),
              ),
            ),
          db
            .select({ ...getTableColumns(Recurrence) })
            .from(Recurrence)
            .where(
              and(
                eq(Recurrence.created_by, currentUser ?? ""),
                gte(Recurrence.date, firstDayOfMonth),
                lte(Recurrence.date, lastDayOfMonth),
              ),
            ),
          db
            .select({ ...getTableColumns(Single) })
            .from(Single)
            .where(
              and(
                eq(Single.created_by, currentUser ?? ""),
                gte(Single.date, firstDayOfMonth),
                lte(Single.date, lastDayOfMonth),
              ),
            ),
        ]);

        if (batchResponse) {
          let [incomeResult, expenseResult, recurringResult, singleResult] =
            batchResponse;
          // Add type prop to each row in incomeResult
          incomeResult = incomeResult.map((row: IncomeDetail) => ({
            ...row,
            type: "Income",
          })) as NewIncomeDetail[];
          // Add category prop to each row in expenseResult
          expenseResult = expenseResult.map((row: ExpenseDetail) => ({
            ...row,
            category: "Budget Expense",
            type: "Budget Expense",
          })) as NewExpenseDetail[];
          // Add type prop to each row in recurringResult
          recurringResult = recurringResult.map((row: RecurrenceDetail) => ({
            ...row,
            type: "Recurring",
          })) as NewRecurrenceDetail[];
          // Add type prop to each row in singleResult
          singleResult = singleResult.map((row: SingleDetail) => ({
            ...row,
            type: "Single",
          })) as NewSingleDetail;

          const combinedResults = [
            ...incomeResult,
            ...expenseResult,
            ...recurringResult,
            ...singleResult,
          ].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );

          setTransactionCount(combinedResults.length);

          const paginatedResults = combinedResults.slice(
            (page - 1) * 20,
            page * 20,
          );

          if (page === 1) {
            setTransaction(paginatedResults);
          } else {
            setTransaction((prev) => [...prev, ...paginatedResults]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    [currentUser, currentMonth, currentYear],
  );

  // Search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredSearchResult = transaction.filter((search) =>
    search.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Switch month
  const handlePrevMonth = () => {
    setPage(1);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const today = new Date();
    const isCurrentMonth =
      currentMonth === today.getUTCMonth() &&
      currentYear === today.getUTCFullYear();
    if (!isCurrentMonth) {
      setPage(1);
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prevYear) => prevYear + 1);
      } else {
        setCurrentMonth((prevMonth) => prevMonth + 1);
      }
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const latestYear = new Date().getFullYear();
  const latestMonth = new Date().getMonth();

  const hideNextMonthButton =
    latestYear === currentYear && latestMonth === currentMonth;

  return (
    <div className="sm:py-18 min-h-dvh w-dvw bg-[#f5f5f5] px-2 pb-20 pt-6 md:w-full md:px-4 xl:px-20">
      <h2 className="text-2xl font-bold">Transaction</h2>
      <div className="mt-8">
        <TransactionSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
        <div className="mt-8 rounded-lg border bg-white p-6 shadow-md">
          <div className="flex flex-col items-center justify-between gap-y-4 pb-4 md:flex-row">
            <div className="item-center flex w-full gap-4 md:w-auto">
              <div className="flex w-16 gap-4">
                <button
                  onClick={handlePrevMonth}
                  className="flex items-center justify-center rounded-sm bg-gray-200 hover:bg-gray-300"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={handleNextMonth}
                  className={`flex items-center justify-center rounded-sm bg-gray-200 hover:bg-gray-300 ${hideNextMonthButton && "pointer-events-none bg-gray-100"}`}
                >
                  <ChevronRight
                    className={`${hideNextMonthButton && "stroke-gray-400"}`}
                  />
                </button>
              </div>
              <h2 className="text-xl font-bold">
                {monthNames[currentMonth]} {currentYear}
              </h2>
            </div>
            <AddTransaction refreshData={() => getData(1)} />
          </div>
          <TransactionTable
            transaction={filteredSearchResult}
            refreshData={() => getData(1)}
          />
        </div>
        <LoadMoreTransaction
          transaction={transaction}
          transactionCount={transactionCount}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
