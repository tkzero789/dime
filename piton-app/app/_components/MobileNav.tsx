import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  CircleDollarSign,
  HandCoins,
  LayoutGrid,
  Menu,
  ShieldPlus,
} from "lucide-react";
import Link from "next/link";

export default function MobileNav() {
  // Menu list
  const menu = [
    { option: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { option: "Budgets", icon: HandCoins, href: "/budgets" },
    { option: "Expenses", icon: CircleDollarSign, href: "/expenses" },
    { option: "Upgrade", icon: ShieldPlus, href: "/upgrade" },
  ];
  return (
    <Sheet>
      <SheetTrigger className="block lg:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            <ul className="flex flex-col">
              {menu.map((item, index) => (
                <li key={index}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      className="flex w-full gap-4 border-b py-3 text-base font-medium text-dark"
                    >
                      <item.icon />
                      <span>{item.option}</span>
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
