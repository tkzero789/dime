import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { endOfMonth, format, getYear, startOfMonth } from "date-fns";
import { convertToLocalDate } from "@/utils/convertToLocalDate";
import { useRouter } from "next/navigation";

type Props = {
  date: { from: string; to: string };
  setDate: Dispatch<SetStateAction<{ from: string; to: string }>>;
};

export default function BudgetsMonthToggle({ date, setDate }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const currentYear = getYear(date.from);

  // Array of month names
  const months = [
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

  const handleSelectMonth = (index: number) => {
    const dateObject = convertToLocalDate(date.from);
    dateObject.setMonth(index);
    setDate({
      from: format(startOfMonth(dateObject), "yyyy-MM-dd"),
      to: format(endOfMonth(dateObject), "yyyy-MM-dd"),
    });
    setIsOpen(false);
  };

  const handleChangeYear = (mode: string) => {
    const dateObject = convertToLocalDate(date.from);
    dateObject.setFullYear(
      mode === "prev"
        ? dateObject.getFullYear() - 1
        : dateObject.getFullYear() + 1,
    );
    setDate({
      from: format(startOfMonth(dateObject), "yyyy-MM-dd"),
      to: format(endOfMonth(dateObject), "yyyy-MM-dd"),
    });
    router.replace(
      `/budgets?startDate=${format(startOfMonth(dateObject), "yyyy-MM-dd")}&endDate=${format(endOfMonth(dateObject), "yyyy-MM-dd")}`,
    );
  };

  console.log(date);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {format(convertToLocalDate(date.from), "MMMM yyyy")}
          {isOpen ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => handleChangeYear("prev")}
          >
            <ChevronLeft />
          </Button>
          <div>{currentYear}</div>
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            onClick={() => handleChangeYear("next")}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="grid w-auto grid-cols-3 gap-2">
          {months.map((month, index) => (
            <Button
              key={month}
              variant="ghost"
              size="sm"
              onClick={() => handleSelectMonth(index)}
              className={`${convertToLocalDate(date.from).getMonth() === index && "bg-muted"}`}
            >
              {month.substring(0, 3)}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
