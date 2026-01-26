import { type ClassValue, clsx } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToLocalDate(date: string): Date {
  const [year, month, day] = date.split("-").map((item) => Number(item));
  return new Date(year, month - 1, day);
}

type FormatDateProps = {
  numDateUTC?: Date;
  numMonthNumDateUTC?: Date;
  shortMonthNumDateUTC?: Date;
  fullFormatUTC?: Date;
};

export function FormatDate({
  numDateUTC,
  numMonthNumDateUTC,
  shortMonthNumDateUTC,
  fullFormatUTC,
}: FormatDateProps) {
  if (numDateUTC) {
    return numDateUTC.toLocaleDateString("en-US", {
      day: "2-digit",
      timeZone: "UTC",
    });
  } else if (numMonthNumDateUTC) {
    return numMonthNumDateUTC.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      timeZone: "UTC",
    });
  } else if (shortMonthNumDateUTC) {
    return shortMonthNumDateUTC.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  } else if (fullFormatUTC) {
    return fullFormatUTC.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  } else {
    return null;
  }
}

type FormatNumberProps = {
  number: number;
  decimals?: number;
  negative?: boolean;
};

export function FormatNumber({
  number,
  decimals,
  negative = true,
}: FormatNumberProps) {
  const displayValue = !negative && number < 0 ? Math.abs(number) : number;
  return (
    <>
      {new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(displayValue)}
    </>
  );
}

type FormatStringProps = {
  text: string;
  split?: string;
};

export function FormatString({ text, split = " " }: FormatStringProps) {
  return text
    ?.split(split)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type Props = {
  month?: Date;
  monthYear?: Date;
};

export function GetCurrentMonth({ month, monthYear }: Props) {
  if (month) {
    return month.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  } else if (monthYear) {
    return monthYear.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  } else {
    return null;
  }
}

export function GetGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const innerRef = React.useRef<T>(null);

  React.useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  });

  return innerRef;
}
