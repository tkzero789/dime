import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { LoaderCircle, Plus } from "lucide-react";
import React from "react";
import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { AccountState } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAccount } from "@/lib/api/accounts";
import EditCardBackground from "./EditCardBackground";

export default function AddAccount() {
  const [open, setOpen] = React.useState<boolean>(false);

  const [newAccount, setNewAccount] = React.useState<AccountState>({
    name: "",
    type: "",
    amount: "",
    debt: "",
    color: "from-blue-600 to-blue-800",
  });

  const handleFormChange = (field: keyof AccountState, value: string) => {
    if (field === "type") {
      setNewAccount((prev) => ({
        ...prev,
        debt: value === "checking" ? "0" : "",
      }));
    }

    setNewAccount((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "accounts" });
      setOpen(false);
      toast.success("Account added");
    },
    onError: (error) => {
      toast.error("Failed to add account");
      console.log("Failed to add account", error);
    },
    onSettled: () => {
      handleClearInput();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      newAccount.name.trim() === "" ||
      !newAccount.type ||
      !newAccount.amount ||
      !newAccount.debt ||
      !newAccount.color
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      name: newAccount.name,
      type: newAccount.type,
      amount: newAccount.amount,
      debt: newAccount.debt,
      color: newAccount.color,
    });
  };

  const handleClearInput = () => {
    setNewAccount({
      name: "",
      type: "",
      amount: "",
      debt: "",
      color: "from-blue-600 to-blue-800",
    });
  };

  const checkEmptyValue = () => {
    if (
      newAccount.name.trim() === "" ||
      !newAccount.type ||
      !newAccount.amount ||
      !newAccount.debt ||
      !newAccount.color ||
      isPending
    )
      return true;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleClearInput}
          className="size-10 lg:h-10 lg:w-full lg:border lg:bg-background lg:px-4 lg:py-2 lg:text-foreground lg:hover:bg-muted"
        >
          <Plus />
          <div className="hidden lg:block">Add</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add account</DialogTitle>
          <Button
            size="icon"
            type="submit"
            form="addAccountForm"
            disabled={checkEmptyValue()}
            className="lg:hidden"
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : <Plus />}
          </Button>
        </DialogHeader>
        <form
          id="addAccountForm"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* Form content */}
          <div className="flex flex-col gap-4 px-6 md:pb-6 lg:pb-0">
            {/* Name */}
            <Input
              type="text"
              placeholder="Account name"
              value={newAccount.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
            {/* Type */}
            <Select
              value={newAccount.type}
              onValueChange={(value) => handleFormChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
            {/* Amount */}
            <Input
              type="number"
              placeholder={`${newAccount.type === "credit" ? "Available credit" : "Current balance"}`}
              disabled={!newAccount.type}
              value={newAccount.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  handleFormChange("amount", value);
                }
              }}
            />
            {/* Debt */}
            {newAccount.type === "credit" && (
              <Input
                type="number"
                placeholder="Current balance"
                value={newAccount.debt}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    handleFormChange("debt", value);
                  }
                }}
              />
            )}
            {/* Customize Card */}
            <div
              className={cn(
                "flex w-full flex-col gap-8 rounded-lg border bg-gradient-to-bl p-4 text-white",
                newAccount.color,
              )}
            >
              <div className="flex flex-col gap-4">
                <div className="text-start text-lg font-bold">
                  {newAccount.name}
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="text-3xl tracking-wide">
                      $
                      {newAccount.type === "credit" ? (
                        <FormatNumber number={Number(newAccount.debt)} />
                      ) : (
                        <FormatNumber number={Number(newAccount.amount)} />
                      )}
                    </div>
                    <div className="text-sm text-white">Current Balance</div>
                  </div>
                  {newAccount.type === "credit" && (
                    <div className="flex flex-col gap-1">
                      <div className="text-3xl tracking-wide">
                        ${<FormatNumber number={Number(newAccount.amount)} />}
                      </div>
                      <div className="text-sm text-white">Available Credit</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <EditCardBackground handleFormChange={handleFormChange} />
                <div className="self-end">
                  <FormatString
                    text={
                      newAccount.type === "checking" ? "Debit" : newAccount.type
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Button */}
          <div className="hidden items-center justify-end border-t p-6 lg:flex">
            <Button type="submit" disabled={checkEmptyValue()}>
              {isPending && <LoaderCircle className="animate-spin" />} Add
              account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
