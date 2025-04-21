import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { ExpenseDatePicker } from "./ExpenseDatePicker";

import {
  Check,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  Pencil,
} from "lucide-react";
import { AccountData, BudgetExpenseData, BudgetExpenseState } from "@/types";
import { convertToLocalDate } from "@/utils/convertToLocalDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBudgetExpense } from "@/lib/api/budgets/expenses";
import { queryKeys } from "@/lib/queryKeys";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
  budgetExpenseData: BudgetExpenseData;
  accountData: AccountData[];
};

export default function EditExpense({ budgetExpenseData, accountData }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = React.useState<boolean>(false);
  const [accountName, setAccountName] = React.useState<string>(
    budgetExpenseData.account_name ?? "",
  );

  const [expenseToUpdate, setExpenseToUpdate] =
    React.useState<BudgetExpenseState>({
      budget_id: budgetExpenseData.budget_id ?? "",
      account_id: budgetExpenseData.account_id ?? "",
      name: budgetExpenseData.name,
      amount: budgetExpenseData.amount,
      category: budgetExpenseData.category,
      payment_source: budgetExpenseData.payment_source,
      date: convertToLocalDate(budgetExpenseData.date),
    });

  const handleFormChange = (
    field: keyof BudgetExpenseState,
    value: string | Date,
  ) => {
    setExpenseToUpdate((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateBudgetExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgetExpenses.byBudgetId(
          expenseToUpdate.budget_id ?? "",
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.budgets.byId(expenseToUpdate.budget_id ?? ""),
      });
      setIsOpen(false);
      toast.success("Expense updated");
    },
    onError: (error) => {
      toast.error("Failed to update expense");
      console.log("Failed to update expense", error);
    },
  });

  const handleSumit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      expenseToUpdate.name.trim() === "" ||
      !expenseToUpdate.budget_id ||
      !expenseToUpdate.account_id ||
      !expenseToUpdate.amount ||
      !expenseToUpdate.category ||
      !expenseToUpdate.payment_source ||
      !expenseToUpdate.date
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      id: budgetExpenseData.id ?? "",
      budget_id: expenseToUpdate.budget_id,
      account_id: expenseToUpdate.account_id,
      name: expenseToUpdate.name,
      amount: expenseToUpdate.amount,
      category: expenseToUpdate.category,
      payment_source: expenseToUpdate.payment_source,
      date: expenseToUpdate.date,
    });
  };

  const checkEmptyValue = () => {
    if (
      expenseToUpdate.name.trim() === "" ||
      !expenseToUpdate.budget_id ||
      !expenseToUpdate.account_id ||
      !expenseToUpdate.amount ||
      !expenseToUpdate.category ||
      !expenseToUpdate.payment_source ||
      !expenseToUpdate.date ||
      isPending
    ) {
      return true;
    }
  };

  console.log(expenseToUpdate);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Pencil />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit expense</DialogTitle>
          <Button
            size="icon"
            type="submit"
            form="editBudgetExpenseForm"
            disabled={checkEmptyValue()}
            className="lg:hidden"
          >
            <Check />
          </Button>
        </DialogHeader>
        <form
          id="editBudgetExpenseForm"
          onSubmit={handleSumit}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-4 px-6 md:pb-6 lg:pb-0">
            {/* Expense Name */}
            <Input
              type="text"
              defaultValue={expenseToUpdate.name}
              onChange={() => handleFormChange("name", expenseToUpdate.name)}
            />
            {/* Amount */}
            <Input
              type="number"
              defaultValue={expenseToUpdate.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  handleFormChange("amount", value);
                }
              }}
            />
            {/* Payment source */}
            <Popover open={isAccountOpen} onOpenChange={setIsAccountOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "h-12 justify-between text-base font-normal text-muted-foreground",
                    accountName && "text-foreground",
                  )}
                >
                  {expenseToUpdate?.payment_source ? accountName : "From"}
                  {isAccountOpen ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex max-h-80 w-[--radix-popover-trigger-width] flex-col gap-2 overflow-y-auto">
                {accountData?.map((item) => (
                  <Button
                    key={item.id}
                    variant="outline"
                    onClick={() => {
                      handleFormChange("account_id", item.id);
                      handleFormChange("payment_source", item.id);
                      setAccountName(item.name);
                      setIsAccountOpen(false);
                    }}
                    className="relative h-auto justify-between"
                  >
                    <div className="text-base font-medium">{item.name}</div>
                    <div
                      className={cn(
                        "rounded-md bg-gradient-to-br px-2 py-1",
                        item.color,
                      )}
                    >
                      <div className="text-xs font-medium text-white">
                        {item.type === "checking" ? "Debit" : "Credit"}
                      </div>
                    </div>
                  </Button>
                ))}
              </PopoverContent>
            </Popover>
            {/* Datepicker */}
            <ExpenseDatePicker
              date={expenseToUpdate.date}
              handleFormChange={handleFormChange}
            />
          </div>
          {/* Button */}
          <div className="hidden items-center justify-end border-t p-6 lg:flex">
            <Button type="submit" disabled={checkEmptyValue()}>
              {isPending && <LoaderCircle className="animate-spin" />} Save
              changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
