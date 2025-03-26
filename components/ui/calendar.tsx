/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 hover:opacity-100",
        ),
        nav_button_previous:
          "absolute left-1 hover:bg-muted disabled:bg-transparent",
        nav_button_next:
          "absolute right-1 bg-teal-200 hover:bg-muted disabled:bg-transparent",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",

        cell: `h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20 

        /* Selected */
        [&:has([aria-selected].day-selected)]:bg-primary
         [&:has([aria-selected].day-selected)]:text-white
        [&:has([aria-selected].day-selected)]:rounded-lg

        /* Today */
        [&:has([aria-selected].day-today)]:bg-primary
        [&:has([aria-selected].day-today)]:text-white
        [&:has([aria-selected].day-today)]:rounded-lg

        /* Start */
        [&:has([aria-selected].day-selected.day-range-start)]:bg-primary
        [&:has([aria-selected].day-selected.day-range-start)]:text-white
        [&:has([aria-selected].day-selected.day-range-start)]:rounded-lg
        [&:has([aria-selected].day-selected.day-range-start.day-range-end)]:rounded-lg
        [&:has([aria-selected].day-selected.day-today.day-range-start.day-range-end)]:rounded-lg
        [&:has([aria-selected].day-selected.day-range-start)]:rounded-tr-none
        [&:has([aria-selected].day-selected.day-range-start)]:rounded-br-none
        [&:has([aria-selected].day-selected.day-today.day-range-start)]:rounded-tr-none
        [&:has([aria-selected].day-selected.day-today.day-range-start)]:rounded-br-none
        

        /* End */
        [&:has([aria-selected].day-range-end)]:bg-primary
        [&:has([aria-selected].day-range-end)]:text-white
        [&:has([aria-selected].day-selected.day-range-end)]:rounded-tr-lg
        [&:has([aria-selected].day-selected.day-range-end)]:rounded-br-lg
        [&:has([aria-selected].day-selected.day-range-end)]:rounded-tl-none
        [&:has([aria-selected].day-selected.day-range-end)]:rounded-bl-none
        `,

        day: "h-9 w-9 p-0 font-normal hover:bg-muted hover:rounded-lg aria-selected:hover:bg-transparent",
        day_selected: "day-selected",
        day_today: "day-today",
        day_range_start: "day-range-start",
        day_range_middle:
          "day-range-middle aria-selected:!bg-muted aria-selected:!text-muted-foreground aria-selected:!rounded-none",
        day_range_end: "day-range-end",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-secondary/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
