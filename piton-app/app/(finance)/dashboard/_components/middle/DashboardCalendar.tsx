"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import "@/css/calendar.css";
import { DayPickerProps, SelectSingleEventHandler } from "react-day-picker";

type Props = {
  date: Date;
  setDate: (date: Date) => void;
  highlightDates: string[];
};

export function DashboardCalendar({ date, setDate, highlightDates }: Props) {
  const handleOnSelect: SelectSingleEventHandler = (date) => {
    if (date) {
      setDate(date);
    }
  };

  const modifiers: DayPickerProps["modifiers"] = {
    highlighted: highlightDates.map((d) => {
      const [year, month, day] = d.split("-").map(Number);
      const utcDate = new Date(Date.UTC(year, month - 1, day));
      return new Date(
        utcDate.getUTCFullYear(),
        utcDate.getUTCMonth(),
        utcDate.getUTCDate(),
      );
    }),
  };

  const modifiersClassNames: DayPickerProps["modifiersClassNames"] = {
    highlighted: "checked",
  };
  return (
    <div className="flex justify-center">
      <Calendar
        mode="single"
        className="w-fit rounded-md border"
        selected={date}
        onSelect={handleOnSelect}
        disableNavigation={true}
        showOutsideDays={false}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
      />
    </div>
  );
}
