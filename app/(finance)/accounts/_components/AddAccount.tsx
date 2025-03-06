import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { PlusCircle } from "lucide-react";
import React from "react";
import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";
import PickCardBg from "./PickCardBg";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { db } from "@/db/dbConfig";
import { accounts } from "@/db/schema";
import toast from "react-hot-toast";
import { AccountState } from "@/types";

export default function AddAccount() {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;

  const [addAccount, setAddAccount] = React.useState<AccountState>({
    name: "",
    type: "",
    amount: "",
    debt: "",
    color: "from-blue-600 to-blue-800",
  });

  const handleFormChange = (field: keyof AccountState, value: string) => {
    setAddAccount((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addNewAccount = async () => {
    if (!addAccount || !currentUser) {
      window.alert("Missing required information");
      return;
    }
    try {
      const result = await db.insert(accounts).values({
        name: addAccount.name,
        type: addAccount.type,
        amount: addAccount.amount,
        debt: addAccount.debt,
        color: addAccount.color,
        created_by: currentUser,
      });

      if (result) {
        toast.success("New Account Added!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusCircle className="h-6 w-6" strokeWidth={1.5} />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form className="flex flex-col gap-8">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {/* Name */}
            <Input
              placeholder="Account name"
              onChange={(e) => handleFormChange("name", e.target.value)}
            />
            {/* Type */}
            <Select
              value={addAccount.type}
              onValueChange={(value) => handleFormChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="saving">Saving</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
            {/* Amount */}
            <Input
              placeholder={`${addAccount.type === "credit" ? "Available credit" : "Current balance"}`}
              type="number"
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              disabled={!addAccount.type}
              onChange={(e) => handleFormChange("amount", e.target.value)}
            />
            {/* Debt */}
            {addAccount.type === "credit" && (
              <Input
                placeholder="Current balance"
                type="number"
                className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                onChange={(e) => handleFormChange("debt", e.target.value)}
              />
            )}
            <div
              className={cn(
                "flex w-full flex-col gap-8 rounded-lg border bg-gradient-to-bl p-4 text-white",
                addAccount.color,
              )}
            >
              <div className="flex flex-col gap-4">
                <div className="text-start text-lg font-bold">
                  {addAccount.name}
                </div>

                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="text-3xl tracking-wide">
                      $
                      {addAccount.type === "credit" ? (
                        <FormatNumber number={Number(addAccount.debt)} />
                      ) : (
                        <FormatNumber number={Number(addAccount.amount)} />
                      )}
                    </div>
                    <div className="text-sm text-white">Current Balance</div>
                  </div>
                  {addAccount.type === "credit" && (
                    <div className="flex flex-col gap-1">
                      <div className="text-3xl tracking-wide">
                        ${<FormatNumber number={Number(addAccount.amount)} />}
                      </div>
                      <div className="text-sm text-white">Available Credit</div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <PickCardBg handleFormChange={handleFormChange} />
                <div className="self-end">
                  {<FormatString text={addAccount.type} />}
                </div>
              </div>
            </div>
          </div>
          <DialogClose asChild>
            <Button
              className="w-full"
              disabled={!addAccount}
              onClick={() => addNewAccount()}
            >
              Add account
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}
