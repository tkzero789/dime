import React from "react";
import {
  Dialog,
  DialogContent,
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
import { Check, LoaderCircle, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
// import { IncomeDatePicker } from "./IncomeDatePicker";
import { Button } from "@/components/ui/button";
import { IncomeData, IncomeState } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateIncome } from "@/lib/api/income";
import toast from "react-hot-toast";
import { IncomeDatePicker } from "./IncomeDatePicker";
import { convertToLocalDate } from "@/utils/convertToLocalDate";

type Props = {
  incomeData: IncomeData;
};

const selectOptions = {
  categories: [
    { value: "salary", label: "Salary" },
    { value: "business", label: "Business" },
    { value: "investments", label: "Investments" },
    { value: "rental income", label: "Rental Income" },
    { value: "pensions", label: "Pensions" },
  ],
  paymentMethods: [
    { value: "cash", label: "Cash" },
    { value: "check", label: "Check" },
    { value: "direct deposit", label: "Direct Deposit" },
    {
      value: "mobile payment",
      label: "Mobile Payment (Paypal, CashApp, Zelle, etc.)",
    },
    { value: "payroll card", label: "Payroll Card" },
  ],
};

export default function EditIncome({ incomeData }: Props) {
  const [open, setOpen] = React.useState<boolean>(false);

  const [incomeToEdit, setIncomeToEdit] = React.useState<IncomeState>({
    name: incomeData.name,
    amount: incomeData.amount,
    date: convertToLocalDate(incomeData.date),
    category: incomeData.category,
    payment_method: incomeData.payment_method,
  });

  const handleFormChange = (field: keyof IncomeState, value: string | Date) => {
    setIncomeToEdit((prev) => ({ ...prev, [field]: value }));
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
      setOpen(false);
      toast.success("Income updated");
    },
    onError: (error) => {
      toast.error("Failed to update income");
      console.log("Failed to update income", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      incomeToEdit.name.trim() == "" ||
      !incomeToEdit.amount ||
      !incomeToEdit.date ||
      !incomeToEdit.category ||
      !incomeToEdit.payment_method
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      id: incomeData.id,
      name: incomeToEdit.name,
      amount: incomeToEdit.amount,
      date: incomeToEdit.date,
      category: incomeToEdit.category,
      payment_method: incomeToEdit.payment_method,
    });
  };

  const handleResetValue = () => {
    setIncomeToEdit({
      name: incomeData.name,
      amount: incomeData.amount,
      date: convertToLocalDate(incomeData.date),
      category: incomeData.category,
      payment_method: incomeData.payment_method,
    });
  };

  const checkEmptyValue = () => {
    if (
      incomeToEdit.name.trim() === "" ||
      !incomeToEdit.amount ||
      !incomeToEdit.date ||
      !incomeToEdit.category ||
      !incomeToEdit.payment_method ||
      isPending
    )
      return true;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetValue}
          className="w-full justify-start"
        >
          <Pencil />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit income</DialogTitle>
          <Button
            size="icon"
            type="submit"
            form="editIncomeForm"
            disabled={checkEmptyValue()}
            className="lg:hidden"
          >
            <Check />
          </Button>
        </DialogHeader>
        <form
          id="editIncomeForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4 px-6">
            <Input
              type="text"
              placeholder="Income name"
              value={incomeToEdit.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
            {/* Income Amount */}
            <Input
              type="number"
              placeholder="Amount"
              value={incomeToEdit.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  handleFormChange("amount", value);
                }
              }}
            />
            {/* DatePicker */}
            <IncomeDatePicker
              date={incomeToEdit.date}
              handleFormChange={handleFormChange}
            />
            {/* Category */}
            <Select
              value={incomeToEdit.category}
              onValueChange={(value) => handleFormChange("category", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.categories.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Payment Method */}
            <Select
              value={incomeToEdit.payment_method}
              onValueChange={(value) =>
                handleFormChange("payment_method", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                {selectOptions.paymentMethods.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="hidden items-center justify-end border-t p-6 lg:flex">
            <Button type="submit" disabled={checkEmptyValue()}>
              {isPending && <LoaderCircle className="animate-spin" />}Edit
              income
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
