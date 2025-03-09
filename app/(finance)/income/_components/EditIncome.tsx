import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
// import { IncomeDatePicker } from "./IncomeDatePicker";
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { db } from "@/db/dbConfig";
import { income } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { IncomeData } from "@/types";
import { useUser } from "@clerk/nextjs";

type Props = {
  incomeData: IncomeData;
};

export default function EditIncome({ incomeData }: Props) {
  const { user } = useUser();

  // Correct date displays for datepicker in edit income
  const convertToLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [incomeName, setIncomeName] = React.useState<string>("");
  const [incomeAmount, setIncomeAmount] = React.useState<string>("");
  const [incomeDate, setIncomeDate] = React.useState<Date>(
    convertToLocalDate(incomeData.date),
  );
  const [initialIncomeDate] = React.useState<Date>(
    convertToLocalDate(incomeData.date),
  );
  const [incomeCategory, setIncomeCategory] = React.useState<string>(
    incomeData.category,
  );
  const [initialIncomeCategory] = React.useState<string>(incomeData.category);
  const [incomeMethod, setIncomeMethod] = React.useState<string>(
    incomeData.payment_method,
  );
  const [initialIncomeMethod] = React.useState<string>(
    incomeData.payment_method,
  );

  // Update income
  const onUpdateIncome = async () => {
    const updateName = incomeName || incomeData.name;
    const updatedAmount = incomeAmount || incomeData.amount;
    const updateDate = incomeDate || incomeData.date;
    const updateCategory = incomeCategory || incomeData.category;
    const updateMethod = incomeMethod || incomeData.payment_method;
    const result = await db
      .update(income)
      .set({
        name: updateName,
        amount: updatedAmount,
        category: updateCategory,
        payment_method: updateMethod,
        date: updateDate.toISOString(),
      })
      .where(
        and(
          eq(income.id, incomeData.id),
          eq(income.created_by, user?.primaryEmailAddress?.emailAddress ?? ""),
        ),
      )
      .returning();

    console.log(result);
  };

  // On click edit (reset to original)
  const handleOnClickEdit = () => {
    setIncomeName("");
    setIncomeAmount("");
    setIncomeCategory(incomeData.category);
    setIncomeMethod(incomeData.payment_method);
    setIncomeDate(convertToLocalDate(incomeData.date));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={handleOnClickEdit}
        >
          <Pencil />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Income</DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4">
            <Input
              type="text"
              defaultValue={incomeData.name}
              onChange={(e) => setIncomeName(e.target.value)}
            />
            <Input
              type="number"
              className="mt-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              defaultValue={Number(incomeData.amount)}
              onChange={(e) => setIncomeAmount(e.target.value)}
            />
            {/* <IncomeDatePicker date={incomeDate} setDate={setIncomeDate} /> */}
            <Select
              value={incomeCategory}
              onValueChange={(value) => setIncomeCategory(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="investments">Investments</SelectItem>
                <SelectItem value="rental income">Rental Income</SelectItem>
                <SelectItem value="pensions">Pensions</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={incomeMethod}
              onValueChange={(value) => setIncomeMethod(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="direct deposit">Direct Deposit</SelectItem>
                <SelectItem value="mobile payment">
                  Mobile Payment (Paypal, CashApp, Zelle, etc.)
                </SelectItem>
                <SelectItem value="payroll card">Payroll Card</SelectItem>
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:justify-start">
          <PopoverClose asChild>
            <Button
              className="w-full"
              disabled={
                !(
                  incomeName ||
                  incomeAmount ||
                  incomeCategory !== initialIncomeCategory ||
                  incomeMethod !== initialIncomeMethod ||
                  incomeDate?.getTime() !== initialIncomeDate?.getTime()
                )
              }
              onClick={() => onUpdateIncome()}
            >
              Save
            </Button>
          </PopoverClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
