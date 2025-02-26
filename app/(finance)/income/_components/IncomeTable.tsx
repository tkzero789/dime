import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IncomeDetail } from "@/types";
import { useUser } from "@clerk/nextjs";
import FormatDate from "@/utils/formatDate";
import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";
import { Ellipsis } from "lucide-react";
import EditIncome from "./EditIncome";
import DeleteIncome from "./DeleteIncome";

type Props = {
  filteredIncome: IncomeDetail[];
  refreshData?: () => void;
};

export default function IncomeTable({ filteredIncome }: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  React.useEffect(() => {
    const calculateTotalAmount = () => {
      const totalAmount = filteredIncome.reduce(
        (acc, curr) => acc + Number(curr.amount),
        0,
      );
      setTotalAmount(totalAmount);
    };

    if (user) {
      calculateTotalAmount();
    }
  }, [user, filteredIncome]);

  const [totalAmount, setTotalAmount] = React.useState<number>(0);

  const [isClick, setIsClick] = React.useState<string | null>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  // Handle on click
  const handleOnClick = (incomeId: string) => {
    setIsClick(incomeId);
  };

  // Effect to handle clicks outside of the PopoverTrigger (remove the bg-neutral-200 on the income item)
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsClick(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Table className="rounded-lg bg-white">
      <TableHeader>
        <TableRow className="pointer-events-none border-none bg-neutral-200">
          <TableHead className="w-[100px] rounded-l-lg text-sm font-semibold text-secondary-foreground">
            Date
          </TableHead>
          <TableHead className="text-sm font-semibold text-secondary-foreground">
            Name
          </TableHead>
          <TableHead className="text-sm font-semibold text-secondary-foreground">
            Category
          </TableHead>
          <TableHead className="truncate text-sm font-semibold text-secondary-foreground">
            Payment Method
          </TableHead>
          <TableHead className="text-right text-sm font-semibold text-secondary-foreground">
            Amount
          </TableHead>
          <TableHead className="rounded-r-lg text-center text-sm font-semibold text-secondary-foreground"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredIncome.length > 0 ? (
          filteredIncome.map((income) => (
            <TableRow
              key={income.id}
              className={`text-xs font-medium lg:text-sm ${isClick === income.id ? "bg-neutral-100" : ""}`}
            >
              <TableCell className="px-4 py-2 font-medium">
                <FormatDate numMonthNumDateUTC={new Date(income.date)} />
              </TableCell>
              <TableCell className="truncate px-4 py-2">
                {income.name}
              </TableCell>
              <TableCell className="px-4 py-2">
                <div className="flex w-fit items-center justify-center rounded-full bg-teal-300 bg-opacity-50 px-2 py-1 text-teal-700">
                  <span className="truncate text-[13px]">
                    <FormatString text={income.category} />
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-4 py-2">
                <FormatString text={income.payment_method} />
              </TableCell>
              <TableCell className="px-4 py-2 text-right font-semibold text-green-700">
                $<FormatNumber number={Number(income.amount)} />
              </TableCell>
              <TableCell className="text-center">
                <Popover>
                  <div ref={popoverRef}>
                    <PopoverTrigger
                      className="flex w-full items-center justify-center"
                      onClick={() => handleOnClick(income.id)}
                    >
                      <Ellipsis className="rounded-md transition hover:bg-neutral-200" />
                    </PopoverTrigger>
                  </div>

                  <PopoverContent className="flex w-40 flex-col px-0 py-0">
                    <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
                      Action
                    </div>
                    <div className="p-1">
                      <EditIncome
                        currentUser={currentUser || "default"}
                        incomeInfo={income}
                      />
                      <DeleteIncome
                        currentUser={currentUser || "default"}
                        incomeId={income.id}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="h-24 text-center">
            <TableCell colSpan={5}>No income data for this month</TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow className="pointer-events-none bg-neutral-200">
          <TableCell
            colSpan={4}
            className="rounded-bl-lg text-sm font-semibold text-secondary-foreground"
          >
            Total
          </TableCell>
          <TableCell className="text-right font-bold text-green-700">
            $<FormatNumber number={totalAmount} />
          </TableCell>
          <TableCell className="rounded-br-lg"></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
