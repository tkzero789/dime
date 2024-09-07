import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronDown, CircleChevronRight } from "lucide-react";
import Link from "next/link";
import {
  ExpenseDetail,
  IncomeDetail,
  RecurrenceDetail,
  SingleDetail,
} from "@/types/types";
import FormatString from "@/utils/formatString";
import FormatNumber from "@/utils/formatNumber";
import FormatDate from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import MoreAction from "./MoreAction";

type NewExpenseDetail = ExpenseDetail & {
  category: string;
  type: string;
};

type NewIncomeDetail = IncomeDetail & {
  type: string;
};

type NewRecurrenceDetail = RecurrenceDetail & {
  type: string;
};

type NewSingleDetail = SingleDetail & {
  type: string;
};

type Props = {
  transactionDetail:
    | NewExpenseDetail
    | NewIncomeDetail
    | NewRecurrenceDetail
    | NewSingleDetail;
  refreshData: () => void;
};

// Type guard to check if transactionDetail is of type ExpenseDetail
function isExpenseDetail(
  detail: ExpenseDetail | IncomeDetail | RecurrenceDetail | SingleDetail,
): detail is ExpenseDetail {
  return (detail as ExpenseDetail).budget_id !== undefined;
}

// Type guard to check if transactionDetail is of type NewSingleDetail
function isNewSingleDetail(
  detail:
    | NewExpenseDetail
    | NewIncomeDetail
    | NewRecurrenceDetail
    | NewSingleDetail,
): detail is NewSingleDetail {
  return detail.type === "Single";
}

export default function ViewTransaction({
  transactionDetail,
  refreshData,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger className="group flex items-center justify-center">
        <CircleChevronRight
          className="h-5 w-5 group-hover:fill-[#d4d4d4]"
          color="#757373"
          fill="#ebebeb"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">
            {(() => {
              if (transactionDetail.type === "Income") {
                return "Income";
              } else if (transactionDetail.type === "Single") {
                return "Single payment";
              } else if (transactionDetail.type === "Recurring") {
                return "Recurring";
              } else {
                return "Budget Expense";
              }
            })()}
          </DialogTitle>
          <div className="flex flex-col gap-4 px-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-dark">
                <FormatDate fullFormatUTC={new Date(transactionDetail.date)} />
              </span>
            </div>
            <div>
              <span className="inline-block w-24 font-medium text-medium">
                Name:
              </span>
              <span>{transactionDetail.name}</span>
            </div>
            <div>
              <span className="inline-block w-24 font-medium text-medium">
                Category:
              </span>
              <span>
                <FormatString text={transactionDetail.category} />
              </span>
            </div>
            <div>
              <span className="inline-block w-24 font-medium text-medium">
                Method:
              </span>
              <span>
                <FormatString text={transactionDetail.payment_method} />
              </span>
            </div>
            <div>
              <span className="inline-block w-24 font-medium text-medium">
                Amount:
              </span>
              <span>
                $<FormatNumber number={Number(transactionDetail.amount)} />
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-8">
              {isNewSingleDetail(transactionDetail) && (
                <MoreAction
                  singleId={transactionDetail.id}
                  singleInfo={transactionDetail}
                  refreshData={refreshData}
                />
              )}
              {transactionDetail.type === "Single" ? (
                ""
              ) : (
                <Button asChild className="w-2/5">
                  <Link
                    href={(() => {
                      if (transactionDetail.type === "Income") {
                        return "/income";
                      } else if (transactionDetail.type === "Recurring") {
                        return "/recurring";
                      } else if (isExpenseDetail(transactionDetail)) {
                        return `/budgets/${transactionDetail.budget_id}`;
                      } else {
                        return "/";
                      }
                    })()}
                  >
                    View Detail
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
