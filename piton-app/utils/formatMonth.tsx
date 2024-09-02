import React from "react";

type Props = {
  month: string;
};

export default function FormatMonth({ month }: Props) {
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
  return <span>{monthShortToLong(month)}</span>;
}
