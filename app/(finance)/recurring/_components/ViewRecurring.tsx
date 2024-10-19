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
import { ReceiptText } from "lucide-react";
import FormatNumber from "@/utils/formatNumber";
import FormatString from "@/utils/formatString";
import FormatDate from "@/utils/formatDate";
import { RecurrenceDetail, RecurringRule } from "@/types/types";
import { db } from "@/db/dbConfig";
import { eq, getTableColumns } from "drizzle-orm";
import { Recurrence } from "@/db/schema";
import GetCurrentMonth from "@/utils/getCurrentMonth";

type Props = {
  recurringInfo: RecurringRule;
  isPaid: Record<string, boolean>;
};

export default function ViewRecurring({ recurringInfo, isPaid }: Props) {
  const [paymentList, setPaymentList] = React.useState<RecurrenceDetail[]>([]);
  const [refresh, setRefresh] = React.useState<boolean>(false);

  React.useEffect(() => {
    getPaymentList();
  }, [refresh]);

  const getPaymentList = async () => {
    const result = await db
      .select({ ...getTableColumns(Recurrence) })
      .from(Recurrence)
      .where(eq(Recurrence.rule_id, recurringInfo.id));

    if (result) {
      setPaymentList(result);
    }
  };

  const handleRefresh = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <Dialog>
      <DialogTrigger
        className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-dark hover:bg-neutral-200"
        onClick={handleRefresh}
      >
        <span className="pl-4">
          <ReceiptText strokeWidth={2} className="h-4 w-4" color="#555353" />
        </span>
        <span className="font-semibold text-medium">View</span>
      </DialogTrigger>
      <DialogContent className="flex h-dvh flex-col gap-8 sm:h-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Payment Detail</DialogTitle>
          <DialogDescription className="flex flex-col gap-4 pt-4">
            <div className="relative flex items-center">
              <span className="inline-block w-36 font-semibold text-dark">
                Due date:
              </span>
              <span>
                <FormatDate fullFormatUTC={new Date(recurringInfo.due_date)} />
              </span>
              <span
                className={`absolute right-0 top-0 ml-auto rounded-md bg-opacity-50 px-2 py-1 text-[13px] ${isPaid[recurringInfo.id] ? "bg-green-300 text-green-700" : "bg-red-300 text-red-700"}`}
              >
                {isPaid[recurringInfo.id] ? "Paid" : "Unpaid"}
              </span>
            </div>
            <div>
              <span className="inline-block w-36 font-semibold text-dark">
                Name:
              </span>
              <span>{recurringInfo.name}</span>
            </div>
            <div>
              <span className="inline-block w-36 font-semibold text-dark">
                Category:
              </span>
              <span>
                <FormatString text={recurringInfo.category} />
              </span>
            </div>
            <div>
              <span className="inline-block w-36 font-semibold text-dark">
                Payment method:
              </span>
              <span>
                <FormatString text={recurringInfo.payment_method} />
              </span>
            </div>
            <div>
              <span className="inline-block w-36 font-semibold text-dark">
                Repeat:
              </span>
              <span>
                <FormatString text={recurringInfo.frequency} />
              </span>
            </div>
            <div>
              <span className="inline-block w-36 font-semibold text-dark">
                Amount:
              </span>
              <span>
                $<FormatNumber number={Number(recurringInfo.amount)} />
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-96 flex-col gap-4 overflow-y-auto">
          {paymentList
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((payment) => (
              <div
                key={payment.id}
                className="flex w-full items-center justify-between"
              >
                <span className="text-sm text-medium">
                  <GetCurrentMonth monthYear={new Date(payment.date)} />
                </span>
                <span className="mr-4 rounded-md bg-green-300 bg-opacity-50 px-2 py-1 text-[13px] text-green-700">
                  Paid
                </span>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}