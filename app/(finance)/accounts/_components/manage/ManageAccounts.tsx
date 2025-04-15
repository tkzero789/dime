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
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableAccountItem from "./SortableAccountItem";
import AddAccount from "../AddAccount";

type Props = {
  accountData: AccountData[];
};

export default function ManageAccounts({ accountData }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [accounts, setAccounts] = React.useState<AccountData[]>(accountData);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setAccounts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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
          <div className="lg:hidden">
            <AddAccount />
          </div>
        </DialogHeader>
        <div className="px-6 pb-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            {/* For DnD: changes accountData to accounts to make it work */}
            <SortableContext
              items={accountData}
              strategy={verticalListSortingStrategy}
            >
              <ul className="flex flex-col gap-4">
                {accountData.map((item) => (
                  <SortableAccountItem
                    key={item.id}
                    accountId={item.id}
                    accountData={item}
                  />
                ))}
                <div className="hidden lg:flex">
                  <AddAccount />
                </div>
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      </DialogContent>
    </Dialog>
  );
}
