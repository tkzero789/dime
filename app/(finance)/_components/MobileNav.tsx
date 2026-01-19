"use client";

import React from "react";
import {
  CircleDollarSign,
  LayoutGrid,
  Menu,
  Banknote,
  RefreshCcwDot,
  ArrowLeftRight,
  BotMessageSquare,
  Landmark,
  Settings,
  Moon,
  LogOut,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AddTransaction from "./AddTransaction";

export default function MobileNav() {
  const path = usePathname();
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();

  // Menu list
  const menu = {
    main: [
      { option: "Home", icon: LayoutGrid, href: "/dashboard" },
      { option: "Spending", icon: CircleDollarSign, href: "/spending" },
      { option: "Income", icon: Landmark, href: "/income" },
    ],
    sub: [
      { option: "Budgets", icon: Banknote, href: "/budgets" },
      {
        option: "Recurring",
        icon: RefreshCcwDot,
        href: "/recurring",
      },
      {
        option: "Transaction",
        icon: ArrowLeftRight,
        href: "/transaction",
      },
      {
        option: "Penny",
        icon: BotMessageSquare,
        href: "/penny",
      },
    ],
  };
  return (
    <div className="fixed bottom-0 left-0 z-10 h-16 w-dvw bg-background lg:hidden">
      {/* Main menu */}
      <ul className="grid h-full w-full grid-cols-5">
        {menu.main.map((item, index) => (
          <React.Fragment key={item.option}>
            {index === 2 && (
              <li
                key="AddTransaction"
                className="flex items-center justify-center"
              >
                <AddTransaction />
              </li>
            )}
            <li
              key={item.option}
              className={cn(
                "border-t-2",
                path.startsWith(item.href)
                  ? "border-t-primary"
                  : "border-t-background",
              )}
            >
              <Link
                href={item.href}
                className="flex h-full w-full flex-col items-center justify-center"
              >
                <span
                  className={cn(
                    "text-secondary-foreground",
                    path.startsWith(item.href) && "text-primary",
                  )}
                >
                  <item.icon
                    className={cn(
                      path.startsWith(item.href) &&
                        "fill-primary/20 stroke-primary",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "text-xs font-medium text-secondary-foreground",
                    path.startsWith(item.href) && "text-primary",
                  )}
                >
                  {item.option}
                </span>
              </Link>
            </li>
          </React.Fragment>
        ))}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger className="flex h-full w-full flex-col items-center justify-center">
            <span className="text-secondary-foreground">
              <Menu />
            </span>
            <span className="text-xs font-medium text-secondary-foreground">
              More
            </span>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-center">More options</DrawerTitle>
            </DrawerHeader>
            <div className="grid w-full gap-4 px-4 pb-4">
              {user && (
                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="size-9 rounded-lg border">
                    <Image
                      src={user?.imageUrl}
                      height={36}
                      width={36}
                      alt="User profile"
                      className="size-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="w-fit font-medium">{user.fullName}</div>
                    <div className="text-sm">
                      {user.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                </div>
              )}
              {/* Submenu */}
              <ul className="overflow-hidden rounded-lg border">
                {menu.sub.map((item) => (
                  <li key={item.option}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-4 p-4",
                        item.option !== "Budgets" && "border-t",
                      )}
                    >
                      <item.icon />
                      <div className="font-medium">{item.option}</div>
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Account */}
              <ul className="overflow-hidden rounded-lg border">
                <li className="flex items-center gap-4 p-4">
                  <Settings />
                  <div className="font-medium">Setting</div>
                </li>
                <li className="flex items-center gap-4 border-t p-4">
                  <Moon />
                  <div className="font-medium">Theme</div>
                </li>
                <li className="border-t">
                  <button
                    className="flex w-full items-center gap-4 p-4"
                    onClick={() => signOut({ redirectUrl: "/sign-in" })}
                  >
                    <LogOut />
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </DrawerContent>
        </Drawer>
      </ul>
    </div>
  );
}
