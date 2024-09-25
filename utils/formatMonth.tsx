import React from "react";

type Props = {
  month?: string;
  monthYear?: string;
};

export default function FormatMonth({ month, monthYear }: Props) {
  const currentYear = new Date().getFullYear().toString();
  const monthShortToLong = (month: string): string => {
    const monthMap: { [key: string]: string } = {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      Apr: "April",
      May: "May",
      Jun: "June",
      Jul: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December",
    };
    return monthMap[month] || month;
  };

  const formatMonthYear = (monthYear: string, currentYear: string): string => {
    const shortMonth = monthYear;
    const longMonth = monthShortToLong(shortMonth);
    return `${longMonth} ${currentYear}`;
  };

  const displayText = () => {
    if (monthYear) {
      return formatMonthYear(monthYear, currentYear);
    } else if (month) {
      return monthShortToLong(month);
    } else {
      return "No month provided";
    }
  };

  return <span>{displayText()}</span>;
}
