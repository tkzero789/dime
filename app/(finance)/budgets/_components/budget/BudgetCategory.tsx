import React from "react";
import {
  BadgeDollarSign,
  BriefcaseMedical,
  Building2,
  Car,
  Drama,
  HeartHandshake,
  Martini,
  PawPrint,
  Plane,
  School,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BudgetState } from "@/types";

const budgetCategory = [
  {
    icon: Car,
    color: "#000000",
    name: "Auto & Transport",
  },
  {
    icon: Building2,
    color: "#000000",
    name: "Business",
  },
  {
    icon: Martini,
    color: "#000000",
    name: "Dining & Drinks",
  },
  {
    icon: School,
    color: "#000000",
    name: "Education",
  },
  {
    icon: Drama,
    color: "#000000",
    name: "Entertainment",
  },
  {
    icon: HeartHandshake,
    color: "#000000",
    name: "Gifts & Donations",
  },
  {
    icon: ShoppingCart,
    color: "#000000",
    name: "Groceries",
  },
  {
    icon: BriefcaseMedical,
    color: "#000000",
    name: "Medical",
  },
  {
    icon: PawPrint,
    color: "#000000",
    name: "Pets",
  },
  {
    icon: ShoppingBag,
    color: "#000000",
    name: "Shopping",
  },
  {
    icon: Plane,
    color: "#000000",
    name: "Travel & Vacation",
  },
  {
    icon: BadgeDollarSign,
    color: "#000000",
    name: "Others",
  },
];

type Props = {
  category: string;
  handleFormChange: (field: keyof BudgetState, value: string | number) => void;
};

export default function BudgetCategory({ category, handleFormChange }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 border">
          {category || "Budget category"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What is this budget for?</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="item flex max-h-96 flex-col overflow-y-auto">
          {budgetCategory.map((item, index) => (
            <div key={index} className="flex items-center py-4 pr-4">
              <item.icon
                color={item.color}
                strokeWidth={1.5}
                className="h-[30px] w-[30px]"
              />
              <span className="pl-4 text-base font-semibold lg:pl-6">
                {item.name}
              </span>
              <DialogClose asChild>
                <Button
                  className="ml-auto"
                  onClick={() => handleFormChange("category", item.name)}
                >
                  Select
                </Button>
              </DialogClose>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
