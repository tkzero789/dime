import {
  ExpenseDetailWithCategory,
  RecurrenceDetail,
  SingleDetail,
} from "@/types";
import FormatNumber from "@/utils/formatNumber";
import React from "react";

type Props = {
  spendingData: (ExpenseDetailWithCategory | RecurrenceDetail | SingleDetail)[];
};

export default function SpendingComparison({ spendingData }: Props) {
  const [currentSpend, setCurrentSpend] = React.useState<number>(0);
  const [previousSpend, setPreviousSpend] = React.useState<number>(0);
  const [difference, setDifference] = React.useState<number>(0);
  const [previousMonthData, setPreviousMonthData] = React.useState<
    (ExpenseDetailWithCategory | RecurrenceDetail | SingleDetail)[]
  >([]);

  const currentDate = new Date();
  const currentMonth = currentDate.getUTCMonth();
  const currentYear = currentDate.getUTCFullYear();

  const previousMonthDate = new Date(currentYear, currentMonth - 1);
  const previousMonth = previousMonthDate.getUTCMonth();
  const previousMonthYear = previousMonthDate.getUTCFullYear();

  React.useEffect(() => {
    const filteredPreviousMonthData = spendingData?.filter((data) => {
      const dataDate = new Date(data.date);
      const dataMonth = dataDate.getUTCMonth();
      const dataYear = dataDate.getUTCFullYear();

      return dataMonth === previousMonth && dataYear === previousMonthYear;
    });

    setPreviousMonthData(filteredPreviousMonthData);
  }, [spendingData, previousMonth, previousMonthYear]);

  const currentMonthData = spendingData?.filter((data) => {
    const dataDate = new Date(data.date);
    const dataMonth = dataDate.getUTCMonth();
    const dataYear = dataDate.getUTCFullYear();

    return dataMonth === currentMonth && dataYear === currentYear;
  });

  React.useEffect(() => {
    const calculation = () => {
      const currentSpending = currentMonthData.reduce(
        (acc, curr) => acc + Number(curr.amount),
        0,
      );

      const previousSpending = previousMonthData.reduce(
        (acc, curr) => acc + Number(curr.amount),
        0,
      );

      setCurrentSpend(currentSpending);
      setPreviousSpend(previousSpending);

      if (currentSpending < previousSpending) {
        setDifference(previousSpending - currentSpending);
      } else {
        setDifference(currentSpending - previousSpending);
      }
    };

    if (currentMonthData && previousMonthData) {
      calculation();
    }
  }, [currentMonthData, previousMonthData]);

  return (
    <>
      {currentSpend < previousSpend ? (
        <p className="text-center text-sm font-medium text-secondary-foreground">
          Spend{" "}
          <span className="font-bold text-foreground">
            $<FormatNumber number={difference} />
          </span>{" "}
          less than last month
        </p>
      ) : (
        <p className="text-center text-sm font-medium text-secondary-foreground">
          Spend{" "}
          <span className="font-bold text-foreground">
            $
            <FormatNumber number={difference} />
          </span>{" "}
          more than last month
        </p>
      )}
    </>
  );
}
