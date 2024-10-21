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
import { IncomeDatePicker } from "./IncomeDatePicker";
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { db } from "@/db/dbConfig";
import { Income } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import toast from "react-hot-toast";
import { IncomeDetail } from "@/types/types";

type Props = {
  currentUser: string | undefined;
  incomeInfo: IncomeDetail;
  refreshData: () => void;
};

export default function EditIncome({
  currentUser,
  incomeInfo,
  refreshData,
}: Props) {
  // Correct date displays for datepicker in edit income
  const convertToLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [incomeName, setIncomeName] = React.useState<string>("");
  const [incomeAmount, setIncomeAmount] = React.useState<string>("");
  const [incomeDate, setIncomeDate] = React.useState<Date>(
    convertToLocalDate(incomeInfo.date),
  );
  const [initialIncomeDate] = React.useState<Date>(
    convertToLocalDate(incomeInfo.date),
  );
  const [incomeCategory, setIncomeCategory] = React.useState<string>(
    incomeInfo.category,
  );
  const [initialIncomeCategory] = React.useState<string>(incomeInfo.category);
  const [incomeMethod, setIncomeMethod] = React.useState<string>(
    incomeInfo.payment_method,
  );
  const [initialIncomeMethod] = React.useState<string>(
    incomeInfo.payment_method,
  );

  // Update income
  const onUpdateIncome = async () => {
    const updateName = incomeName || incomeInfo.name;
    const updatedAmount = incomeAmount || incomeInfo.amount;
    const updateDate = incomeDate || incomeInfo.date;
    const updateCategory = incomeCategory || incomeInfo.category;
    const updateMethod = incomeMethod || incomeInfo.payment_method;
    const result = await db
      .update(Income)
      .set({
        name: updateName,
        amount: updatedAmount,
        category: updateCategory,
        payment_method: updateMethod,
        date: updateDate.toISOString(),
      })
      .where(
        and(
          eq(Income.id, incomeInfo.id),
          eq(Income.created_by, currentUser ?? ""),
        ),
      )
      .returning();

    if (result) {
      toast.success("Your income is updated!");
      refreshData();
    }
  };

  // On click edit (reset to original)
  const handleOnClickEdit = () => {
    setIncomeName("");
    setIncomeAmount("");
    setIncomeCategory(incomeInfo.category);
    setIncomeMethod(incomeInfo.payment_method);
    setIncomeDate(convertToLocalDate(incomeInfo.date));
  };

  return (
    <Dialog>
      <DialogTrigger
        className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-dark hover:bg-neutral-200"
        onClick={handleOnClickEdit}
      >
        <span className="pl-4">
          <Pencil strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-medium">Edit</span>
      </DialogTrigger>
      <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Income</DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4">
            <Input
              type="text"
              defaultValue={incomeInfo.name}
              onChange={(e) => setIncomeName(e.target.value)}
            />
            <Input
              type="number"
              className="mt-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              defaultValue={Number(incomeInfo.amount)}
              onChange={(e) => setIncomeAmount(e.target.value)}
            />
            <IncomeDatePicker date={incomeDate} setDate={setIncomeDate} />
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
