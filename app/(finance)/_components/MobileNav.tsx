"use client";

import React from "react";
import {
  CircleDollarSign,
  LayoutGrid,
  Menu,
  PiggyBank,
  Banknote,
  LogOut,
  RefreshCcwDot,
  ArrowLeftRight,
  BotMessageSquare,
  Landmark,
  Plus,
} from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const path = usePathname();
  const [open, setOpen] = React.useState(false);

  // Menu list
  const menu = {
    main: [
      { option: "Home", icon: LayoutGrid, href: "/dashboard" },
      { option: "Spending", icon: CircleDollarSign, href: "/spending" },
      { option: "Income", icon: Landmark, href: "/income" },
    ],
    more: [
      { option: "Budgets", icon: Banknote, href: "/budgets" },
      { option: "Saving", icon: PiggyBank, href: "/piggybank" },
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
      <ul className="grid h-full w-full grid-cols-5">
        {menu.main.map((item, index) => (
          <React.Fragment key={item.option}>
            {index === 2 && (
              <li key="Add" className="flex items-center justify-center">
                <Button size="icon">
                  <Plus />
                </Button>
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
              <div className="rounded-lg border">
                {menu.more.map((item) => (
                  <Link
                    key={item.option}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-4 p-4",
                      item.option !== "Budgets" && "border-t",
                    )}
                  >
                    <span className="text-secondary-foreground">
                      <item.icon />
                    </span>
                    <span className="font-medium text-secondary-foreground">
                      {item.option}
                    </span>
                  </Link>
                ))}
                <AlertDialog>
                  <AlertDialogTrigger className="flex w-full items-center gap-4 border-t p-4 text-secondary-foreground">
                    <span className="text-secondary-foreground">
                      <LogOut />
                    </span>
                    <span className="font-medium text-secondary-foreground">
                      Sign Out
                    </span>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to sign out?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action will terminate your current session, and
                        you&apos;ll need to log in again to access your account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                      </AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <SignOutButton redirectUrl="/sign-in" />
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </ul>
    </div>
  );
}
