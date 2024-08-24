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
import { useRouter } from "next/navigation";

type Props = {
  currentUser: string | undefined;
  incomeId: string;
  amount: string;
  date: Date;
  category: string;
};

export default function EditIncome({
  currentUser,
  incomeId,
  amount,
  date,
  category,
}: Props) {
  const [incomeAmount, setIncomeAmount] = React.useState<string>("");
  const [incomeDate, setIncomeDate] = React.useState<Date>(date);
  const [initialIncomeDate] = React.useState<Date>(date);
  const [incomeCategory, setIncomeCategory] = React.useState<string>(category);
  const [initialIncomeCategory] = React.useState<string>(category);

  const router = useRouter();

  // Update income
  const onUpdateIncome = async (expenseId: string) => {
    const updatedAmount = incomeAmount || amount;
    const updateDate = incomeDate || date;
    const updateCategory = incomeCategory || category;
    const result = await db
      .update(Income)
      .set({
        amount: updatedAmount,
        date: updateDate.toISOString(),
        category: updateCategory,
      })
      .where(
        and(eq(Income.id, incomeId), eq(Income.created_by, currentUser ?? "")),
      )
      .returning();

    if (result) {
      toast.success("Your income is updated!");
      router.refresh();
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-dark hover:bg-neutral-200">
        <span className="pl-4">
          <Pencil strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-medium">Edit</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4">
            <Input
              type="number"
              className="mt-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              defaultValue={Number(amount)}
              onChange={(e) => setIncomeAmount(e.target.value)}
            />
            <IncomeDatePicker date={incomeDate} setDate={setIncomeDate} />
            <Select
              value={incomeCategory}
              onValueChange={(value) => setIncomeCategory(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Income category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="investments">Investments</SelectItem>
                <SelectItem value="rental income">Rental Income</SelectItem>
                <SelectItem value="pensions">Pensions</SelectItem>
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <PopoverClose asChild>
            <Button
              className="w-full"
              disabled={
                !(
                  incomeAmount ||
                  incomeDate?.getTime() !== initialIncomeDate?.getTime() ||
                  incomeCategory !== initialIncomeCategory
                )
              }
              onClick={() => onUpdateIncome(incomeId)}
            >
              Save
            </Button>
          </PopoverClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
