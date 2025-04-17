import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AccountData, AccountState } from "@/types";
import { Button } from "@/components/ui/button";
import { Check, LoaderCircle, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormatNumber from "@/utils/formatNumber";
import EditCardBackground from "../EditCardBackground";
import FormatString from "@/utils/formatString";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccount } from "@/lib/api/accounts";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Props = {
  accountData: AccountData;
};

export default function EditAccount({ accountData }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const [accountToEdit, setAccountToEdit] = React.useState<AccountState>({
    name: accountData.name,
    type: accountData.type,
    amount: accountData.amount,
    debt: accountData.debt,
    color: accountData.color,
  });

  const handleFormChange = (field: keyof AccountState, value: string) => {
    setAccountToEdit((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      setIsOpen(false);
      toast.success("Account updated");
    },
    onError: (error) => {
      toast.error("Failed to update account");
      console.log("Failed to updated account", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      accountToEdit.name.trim() === "" ||
      !accountToEdit.type ||
      !accountToEdit.amount ||
      !accountToEdit.debt ||
      !accountToEdit.color
    ) {
      toast.error("Missing required information");
      return;
    }

    mutate({
      id: accountData.id,
      name: accountToEdit.name,
      type: accountToEdit.type,
      amount: accountToEdit.amount,
      debt: accountToEdit.debt,
      color: accountToEdit.color,
    });
  };

  const handleResetValue = () => {
    setAccountToEdit({
      name: accountData.name,
      type: accountData.type,
      amount: accountData.amount,
      debt: accountData.debt,
      color: accountData.color,
    });
  };

  const checkEmptyValue = () => {
    if (
      accountToEdit.name.trim() === "" ||
      !accountToEdit.type ||
      !accountToEdit.amount ||
      !accountToEdit.debt ||
      !accountToEdit.color ||
      isPending
    )
      return true;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <DialogTitle>Edit account</DialogTitle>
          <Button
            size="icon"
            type="submit"
            form="addAccountForm"
            disabled={checkEmptyValue()}
            className="lg:hidden"
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : <Check />}
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
              value={accountToEdit.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
            {/* Type */}
            <Select
              value={accountToEdit.type}
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
              placeholder={`${accountToEdit.type === "credit" ? "Available credit" : "Current balance"}`}
              disabled={!accountToEdit.type}
              value={accountToEdit.amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  handleFormChange("amount", value);
                }
              }}
            />
            {/* Debt */}
            {accountToEdit.type === "credit" && (
              <Input
                type="number"
                placeholder="Current balance"
                value={accountToEdit.debt}
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
                accountToEdit.color,
              )}
            >
              <div className="flex flex-col gap-4">
                <div className="text-start text-lg font-bold">
                  {accountToEdit.name}
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="text-3xl tracking-wide">
                      $
                      {accountToEdit.type === "credit" ? (
                        <FormatNumber number={Number(accountToEdit.debt)} />
                      ) : (
                        <FormatNumber number={Number(accountToEdit.amount)} />
                      )}
                    </div>
                    <div className="text-sm text-white">Current Balance</div>
                  </div>
                  {accountToEdit.type === "credit" && (
                    <div className="flex flex-col gap-1">
                      <div className="text-3xl tracking-wide">
                        $
                        {<FormatNumber number={Number(accountToEdit.amount)} />}
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
                      accountToEdit.type === "checking"
                        ? "Debit"
                        : accountToEdit.type
                    }
                  />
                </div>
              </div>
            </div>
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
