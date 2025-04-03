import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountData } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  accountData: AccountData[];
};

export default function ManageAccounts({ accountData }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <WalletCards /> Manage
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage accounts</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 px-6 pb-6">
          {accountData.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex flex-col gap-2">
                <div className="font-medium">{item.name}</div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    Balance:
                  </span>{" "}
                  <span className="font-medium">
                    {item.type === "checking" ? item.amount : item.debt}
                  </span>
                </div>
                {item.type === "credit" && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Credit:
                    </span>{" "}
                    <span className="font-medium">{item.amount}</span>
                  </div>
                )}
              </div>
              <div
                className={cn(
                  "flex h-10 w-20 items-center justify-center rounded-md bg-gradient-to-br",
                  item.color,
                )}
              >
                <div className="text-sm font-semibold text-white">
                  {item.type === "checking" ? "Debit" : "Credit"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
