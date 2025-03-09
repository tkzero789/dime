import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircleChevronRight } from "lucide-react";
import Link from "next/link";
import {
  ExpenseData,
  ExpenseDetailWithCategory,
  IncomeData,
  RecurrenceDetail,
  SingleDetail,
} from "@/types";
import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";
import FormatDate from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import MoreAction from "../single/MoreAction";
import MoreActionRecurrence from "../recurrence/MoreActionRecurrence";

type Props = {
  transactionDetail:
    | ExpenseDetailWithCategory
    | IncomeData
    | RecurrenceDetail
    | SingleDetail;
};

export default function ViewTransaction({ transactionDetail }: Props) {
  const isExpenseDetail = (
    detail: Props["transactionDetail"],
  ): detail is ExpenseDetailWithCategory => {
    return (detail as ExpenseData).budget_id !== undefined;
  };

  const getCategory = (category: string) => {
    if (isExpenseDetail(transactionDetail)) {
      return `/budgets/${transactionDetail.budget_id}`;
    } else if (
      [
        "mortgage",
        "rent",
        "bill and utilities",
        "car payment",
        "loan",
        "credit card payment",
        "insurance",
        "monthly subscription",
      ].includes(category)
    ) {
      return "/recurring";
    } else if (
      [
        "salary",
        "business",
        "investments",
        "rental income",
        "pensions",
      ].includes(category)
    ) {
      return "/income";
    } else {
      return "/dashboard";
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-center" asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">View transaction</span>
          <CircleChevronRight
            className="h-5 w-5"
            color="#757373"
            fill="#ebebeb"
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Transaction Detail</DialogTitle>
          <div className="flex flex-col gap-4 px-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">
                <FormatDate fullFormatUTC={new Date(transactionDetail.date)} />
              </span>
            </div>
            <div className="text-left">
              <span className="inline-block w-24 font-semibold">Name:</span>
              <span className="font-medium text-secondary-foreground">
                {transactionDetail.name}
              </span>
            </div>
            <div className="text-left">
              <span className="inline-block w-24 font-semibold">Category:</span>
              <span className="font-medium text-secondary-foreground">
                {transactionDetail.category === undefined ? (
                  "Budget Expenses"
                ) : (
                  <FormatString text={transactionDetail.category} />
                )}
              </span>
            </div>
            <div className="text-left">
              <span className="inline-block w-24 font-semibold">Method:</span>
              <span className="font-medium text-secondary-foreground">
                <FormatString text={transactionDetail.payment_method} />
              </span>
            </div>
            <div className="text-left">
              <span className="inline-block w-24 font-semibold">Amount:</span>
              <span className="font-medium text-secondary-foreground">
                $<FormatNumber number={Number(transactionDetail.amount)} />
              </span>
            </div>
            <div className="flex items-center justify-center gap-8">
              {transactionDetail.category === "single payment" ? (
                <MoreAction
                  singleId={transactionDetail.id}
                  singleInfo={transactionDetail}
                />
              ) : [
                  "mortgage",
                  "rent",
                  "bill and utilities",
                  "car payment",
                  "loan",
                  "credit card payment",
                  "insurance",
                  "monthly subscription",
                ].includes(transactionDetail.category) ? (
                <MoreActionRecurrence recurrenceId={transactionDetail.id} />
              ) : (
                <Button asChild className="w-2/5">
                  <Link href={getCategory(transactionDetail.category)}>
                    View details
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
