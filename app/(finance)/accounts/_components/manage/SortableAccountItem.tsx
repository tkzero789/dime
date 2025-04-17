import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { Ellipsis, GripVertical } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { Button } from "@/components/ui/button";
import FormatNumber from "@/utils/formatNumber";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EditAccount from "./EditAccount";
import { AccountData } from "@/types";
import DeleteAccount from "./DeleteAccount";

type Props = {
  accountId: string;
  accountData: AccountData;
};

export default function SortableAccountItem({ accountId, accountData }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: accountId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative rounded-lg border bg-white p-4",
        isDragging && "z-50 border-primary",
      )}
    >
      <Button
        variant="subtle"
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-1/2 hidden w-4 -translate-y-1/2 cursor-grab touch-manipulation p-0"
      >
        <GripVertical />
      </Button>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">{accountData.name}</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="data-[state=open]:bg-muted"
              >
                <Ellipsis />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="flex w-40 flex-col p-0">
              <div className="flex items-center justify-center border-b px-3 py-2 text-sm font-semibold">
                Actions
              </div>
              <div className="p-1">
                <EditAccount accountData={accountData} />
                <DeleteAccount accountData={accountData} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* Available */}
        <div>
          <span className="text-sm text-muted-foreground">Available:</span>{" "}
          <span className="font-medium">
            $
            <FormatNumber number={Number(accountData.amount)} />
          </span>
        </div>
        {/* Balance */}
        {accountData.type === "credit" && (
          <div>
            <span className="text-sm text-muted-foreground">Balance:</span>{" "}
            <span className="font-medium">
              $<FormatNumber number={Number(accountData.debt)} />
            </span>
          </div>
        )}
        {/* Type */}
        <div
          className={cn(
            "absolute bottom-0 right-0 flex h-8 w-16 items-center justify-center rounded-br-lg rounded-tl-lg bg-gradient-to-br",
            accountData.color,
          )}
        >
          <div className="text-xs font-medium text-white">
            {accountData.type === "checking" ? "Debit" : "Credit"}
          </div>
        </div>
      </div>
    </li>
  );
}
