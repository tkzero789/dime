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
import { Download, Ellipsis } from "lucide-react";
import EditIncome from "../EditIncome";
import DeleteIncome from "../DeleteIncome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import IncomeTableFilters from "./IncomeTableFilters";

type Props = {
  incomeData: IncomeDetail[];
  refreshData?: () => void;
};

export default function IncomeTable({ incomeData }: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  React.useEffect(() => {
    const calculateTotalAmount = () => {
      const totalAmount = incomeData.reduce(
        (acc, curr) => acc + Number(curr.amount),
        0,
      );
      setTotalAmount(totalAmount);
    };

    if (user) {
      calculateTotalAmount();
    }
  }, [user, incomeData]);

  const [totalAmount, setTotalAmount] = React.useState<number>(0);

  return (
    <div className="flex h-fit flex-col gap-4 rounded-xl bg-white p-6 shadow-card-shadow">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <Input placeholder="Search..." className="h-10 max-w-2xl" />
          <Button variant="outline">
            <Download />
            Export
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <IncomeTableFilters />
        </div>
      </div>
      <Table className="rounded-lg bg-white">
        <TableHeader>
          <TableRow className="pointer-events-none border-none bg-muted">
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
          {incomeData.length > 0 ? (
            incomeData.map((income) => (
              <TableRow
                key={income.id}
                className="text-xs font-medium lg:text-sm"
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
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Ellipsis className="h-6 w-6" strokeWidth={1.5} />
                      </Button>
                    </PopoverTrigger>

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
          <TableRow className="pointer-events-none bg-muted">
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
    </div>
  );
}
