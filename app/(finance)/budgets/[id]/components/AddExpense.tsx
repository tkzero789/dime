import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/db/dbConfig";
import { budget, budget_expense } from "@/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { ExpenseDatePicker } from "./ExpenseDatePicker";
import { format } from "date-fns";
import { Plus } from "lucide-react";

type Props = {
  paramsId: string;
  currentUser: string | undefined;
  refreshData: () => void;
};

export default function AddExpense({
  paramsId,
  currentUser,
  refreshData,
}: Props) {
  const [name, setName] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = React.useState<string>("");
  const [date, setDate] = React.useState<Date>(new Date());

  const addNewExpense = async () => {
    if (!name || !amount || !paymentMethod || !date || !currentUser) {
      window.alert("Missing required information");
      return;
    }

    const formattedDate = format(date, "yyyy-MM-dd");

    const result = await db
      .insert(budget_expense)
      .values({
        name: name,
        amount: amount,
        payment_method: paymentMethod,
        date: formattedDate,
        budget_id: paramsId,
        created_by: currentUser,
      })
      .returning({ insertedId: budget.id });

    if (result) {
      refreshData();
      toast.success("New Expense Added!");
      // reset
      setName("");
      setAmount("");
      setPaymentMethod("");
      setDate(new Date());
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Add expense
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add expense</DialogTitle>
            <Button
              size="icon"
              type="submit"
              form="addExpenseForm"
              // disabled={checkEmptyValue()}
              className="lg:hidden"
            >
              <Plus />
            </Button>
          </DialogHeader>
          <form id="addExpenseForm" className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 px-6 md:pb-6 lg:pb-0">
              {/* Name */}
              <Input
                placeholder="Expense name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {/* Amount */}
              <Input
                placeholder="Amount"
                type="number"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (parseFloat(value) > 0 || value === "") {
                    setAmount(e.target.value);
                  }
                }}
              />
              {/* Date */}
              <ExpenseDatePicker date={date} setDate={setDate} />
              {/* Payment method */}
              <Select
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Payment method"
                    className="text-[#a9a9a9]"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="credit card">Credit Card</SelectItem>
                  <SelectItem value="debit card">Debit Card</SelectItem>
                  <SelectItem value="prepaid card">Prepaid Card</SelectItem>
                  <SelectItem value="digital wallet">
                    Digital Wallet (Apple Pay, Samsung Pay, Google Pay, etc.)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="hidden items-center justify-end border-t p-6 lg:flex">
              <Button
                type="submit"
                disabled={!(name && amount && paymentMethod)}
                onClick={() => {
                  addNewExpense();
                }}
              >
                Add New Expense
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
