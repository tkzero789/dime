import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/db/dbConfig";
import { Budgets, Expenses } from "@/db/schema";
import { useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  paramId: string;
  refreshData: () => void;
};

export default function AddExpense({ paramId, refreshData }: Props) {
  const { toast } = useToast();

  const [name, setName] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = React.useState<string>("");

  const { user } = useUser();
  const addNewExpense = async () => {
    if (
      !name ||
      !amount ||
      !paymentMethod ||
      !user?.primaryEmailAddress?.emailAddress
    ) {
      window.alert("Missing required information");
      return;
    }
    const result = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        paymentMethod: paymentMethod,
        budgetId: paramId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
      })
      .returning({ insertedId: Budgets.id });

    if (result) {
      refreshData();
      toast({
        variant: "success",
        description: "New Expense Added!",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-md">
      <div>
        <label className="font-semibold text-dark">Expense Name</label>
        <Input
          className="mt-1"
          placeholder="e.g Book"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <label className="font-semibold text-dark">Amount</label>
        <Input
          type="number"
          className="mt-1"
          placeholder="e.g 1000"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <label className="font-semibold text-dark">Payment Method</label>
        <Select onValueChange={(value) => setPaymentMethod(value)}>
          <SelectTrigger className="mt-1">
            <SelectValue
              placeholder="Select payment method"
              className="text-[#a9a9a9]"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="credit card">Credit Card</SelectItem>
            <SelectItem value="debit card">Debit Card</SelectItem>
            <SelectItem value="prepaid card">Prepaid Card</SelectItem>
            <SelectItem value="digital wallet">
              Digital Wallet (Apple Pay, Samsung Pay, Google Pay, etc.)
            </SelectItem>
            <SelectItem value="check">Check</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        disabled={!(name && amount && paymentMethod)}
        className="mt-4"
        onClick={() => addNewExpense()}
      >
        Add New Expense
      </Button>
    </div>
  );
}
