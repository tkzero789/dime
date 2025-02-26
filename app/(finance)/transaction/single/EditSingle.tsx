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
import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { db } from "@/db/dbConfig";
import { Single } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import toast from "react-hot-toast";
import { SingleDatePicker } from "./SingleDatePicker";
import { SingleDetail } from "@/types";
import { useRouter } from "next/navigation";

type Props = {
  singleInfo: SingleDetail;
  currentUser: string;
};

export default function EditSingle({ currentUser, singleInfo }: Props) {
  const router = useRouter();

  // Correct date displays for datepicker in edit single payment
  const convertToLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const [singleName, setSingleName] = React.useState<string>("");
  const [singleAmount, setSingleAmount] = React.useState<string>("");
  const [singleDate, setSingleDate] = React.useState<Date>(
    convertToLocalDate(singleInfo.date),
  );
  const [initialSingleDate] = React.useState<Date>(
    convertToLocalDate(singleInfo.date),
  );
  const [singleMethod, setSingleMethod] = React.useState<string>(
    singleInfo.payment_method,
  );
  const [initialSingleMethod] = React.useState<string>(
    singleInfo.payment_method,
  );

  // Update single payment
  const onUpdateSingle = async () => {
    const updateName = singleName || singleInfo.name;
    const updatedAmount = singleAmount || singleInfo.amount;
    const updateDate = singleDate || singleInfo.date;
    const updateMethod = singleMethod || singleInfo.payment_method;
    const result = await db
      .update(Single)
      .set({
        name: updateName,
        amount: updatedAmount,
        payment_method: updateMethod,
        date: updateDate.toISOString(),
      })
      .where(
        and(
          eq(Single.id, singleInfo.id),
          eq(Single.created_by, currentUser ?? ""),
        ),
      )
      .returning();

    if (result) {
      toast.success("Your single payment is updated!");
      router.refresh();
    }
  };

  // On click edit (reset to original)
  const handleOnClickEdit = () => {
    setSingleName("");
    setSingleAmount("");
    setSingleMethod(singleInfo.payment_method);
    setSingleDate(convertToLocalDate(singleInfo.date));
  };

  return (
    <Dialog>
      <DialogTrigger
        className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-foreground hover:bg-neutral-200"
        onClick={handleOnClickEdit}
      >
        <span className="pl-4">
          <Pencil strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-secondary-foreground">Edit</span>
      </DialogTrigger>
      <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Single Payment</DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4">
            <Input
              type="text"
              defaultValue={singleInfo.name}
              onChange={(e) => setSingleName(e.target.value)}
            />
            <Input
              type="number"
              className="mt-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              defaultValue={Number(singleInfo.amount)}
              onChange={(e) => setSingleAmount(e.target.value)}
            />
            <SingleDatePicker date={singleDate} setDate={setSingleDate} />
            <Select
              value={singleMethod}
              onValueChange={(value) => setSingleMethod(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="credit card">Credit Card</SelectItem>
                <SelectItem value="debit card">Debit Card</SelectItem>
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
                  singleName ||
                  singleAmount ||
                  singleMethod !== initialSingleMethod ||
                  singleDate?.getTime() !== initialSingleDate?.getTime()
                )
              }
              onClick={() => onUpdateSingle()}
            >
              Save
            </Button>
          </PopoverClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
