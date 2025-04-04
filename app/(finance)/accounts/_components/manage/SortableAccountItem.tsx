import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { CSS } from "@dnd-kit/utilities";
import React from "react";
import { Button } from "@/components/ui/button";
import EditAccount from "./EditAccount";
import FormatNumber from "@/utils/formatNumber";

type Props = {
  accountId: string;
  name: string;
  type: string;
  amount: string;
  debt: string;
  color: string;
};

export default function SortableAccountItem({
  accountId,
  name,
  type,
  amount,
  debt,
  color,
}: Props) {
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
        className="absolute -left-2 top-1/2 w-4 -translate-y-1/2 cursor-grab touch-manipulation p-0"
      >
        <GripVertical />
      </Button>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="font-medium">{name}</div>
          <EditAccount />
        </div>
        <div className="grid grid-cols-2">
          <div>
            <span className="text-sm text-muted-foreground">Balance:</span>{" "}
            <span className="font-medium">
              $
              <FormatNumber
                number={type === "checking" ? Number(amount) : Number(debt)}
              />
            </span>
          </div>
          {type === "credit" && (
            <div>
              <span className="text-sm text-muted-foreground">Credit:</span>{" "}
              <span className="font-medium">
                $<FormatNumber number={Number(amount)} />
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "absolute bottom-0 right-0 flex h-8 w-16 items-center justify-center rounded-br-lg rounded-tl-lg bg-gradient-to-br",
            color,
          )}
        >
          <div className="text-xs font-medium text-white">
            {type === "checking" ? "Debit" : "Credit"}
          </div>
        </div>
      </div>
    </li>
  );
}
