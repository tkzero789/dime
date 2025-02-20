"use client";

import React from "react";
import {
  Bell,
  BookUp2,
  CircleDollarSign,
  CircleHelp,
  LayoutGrid,
  Menu,
  PiggyBank,
  Banknote,
  LogOut,
  RefreshCcwDot,
  ArrowLeftRight,
  BotMessageSquare,
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

export default function MobileNav() {
  const path = usePathname();
  const [open, setOpen] = React.useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  // Menu list
  const menu = [
    { option: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { option: "Budgets", icon: Banknote, href: "/budgets" },
    { option: "Spending", icon: CircleDollarSign, href: "/spending" },
    { option: "Income", icon: Banknote, href: "/income" },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-10 h-16 w-dvw bg-white shadow-[rgba(0,0,0,0.35)_0px_5px_15px] lg:hidden">
      <ul className="grid h-full w-full grid-cols-5">
        {menu.map((item, index) => (
          <li
            key={index}
            className={`border-t-2 ${path.startsWith(item.href) ? "border-t-teal-700" : "border-t-white"}`}
          >
            <Link
              href={item.href}
              className="flex h-full w-full flex-col items-center justify-center"
            >
              <span
                className={`text-secondary-foreground ${path.startsWith(item.href) && "text-teal-700"}`}
              >
                <item.icon
                  strokeWidth={2}
                  className={`${path.startsWith(item.href) && "fill-teal-500 stroke-teal-800"}`}
                />
              </span>
              <span
                className={`text-sm font-medium text-secondary-foreground ${path.startsWith(item.href) && "text-teal-700"}`}
              >
                {item.option}
              </span>
            </Link>
          </li>
        ))}

        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger className="flex h-full w-full flex-col items-center justify-center">
            <span className="text-secondary-foreground">
              <Menu strokeWidth={2.25} />
            </span>
            <span className="text-sm font-medium text-secondary-foreground">
              More
            </span>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-center">More options</DrawerTitle>
            </DrawerHeader>
            <div className="grid w-full grid-cols-2 gap-4 px-4 pb-4">
              {/* Noti */}
              <Link
                href="/dashboard"
                onClick={handleLinkClick}
                className="flex flex-col items-center justify-center rounded-lg border p-2 shadow-md"
              >
                <span className="text-secondary-foreground">
                  <Bell strokeWidth={2} />
                </span>
                <span className="font-medium text-secondary-foreground">
                  Notifications
                </span>
              </Link>
              {/* Upgrade */}
              <Link
                href="/dashboard"
                onClick={handleLinkClick}
                className="flex flex-col items-center justify-center rounded-lg border p-2 shadow-md"
              >
                <span className="text-secondary-foreground">
                  <BookUp2 strokeWidth={2} />
                </span>
                <span className="font-medium text-secondary-foreground">
                  Upgrade
                </span>
              </Link>
              {/* Saving */}
              <Link
                href="/saving"
                onClick={handleLinkClick}
                className="flex flex-col items-center justify-center rounded-lg border p-2 shadow-md"
              >
                <span className="text-secondary-foreground">
                  <PiggyBank strokeWidth={2} />
                </span>
                <span className="font-medium text-secondary-foreground">
                  Saving
                </span>
              </Link>
              {/* Recurring */}
              <Link
                href="/recurring"
                onClick={handleLinkClick}
                className="flex flex-col items-center justify-center rounded-lg border p-2 shadow-md"
              >
                <span className="text-secondary-foreground">
                  <RefreshCcwDot strokeWidth={2} />
                </span>
                <span className="font-medium text-secondary-foreground">
                  Recurring
                </span>
              </Link>
              {/* Transaction */}
              <Link
                href="/transaction"
                onClick={handleLinkClick}
                className="flex flex-col items-center justify-center rounded-lg border p-2 shadow-md"
              >
                <span className="text-secondary-foreground">
                  <ArrowLeftRight strokeWidth={2} />
                </span>
                <span className="font-medium text-secondary-foreground">
                  Transaction
                </span>
              </Link>
              {/* Penny Chatbot */}
              <Link
                href="/penny"
                onClick={handleLinkClick}
                className="flex flex-col items-center justify-center rounded-lg border p-2 shadow-md"
              >
                <span className="text-secondary-foreground">
                  <BotMessageSquare strokeWidth={2} />
                </span>
                <span className="font-medium text-secondary-foreground">
                  Penny
                </span>
              </Link>
              {/* Sign Out */}
              <AlertDialog>
                <AlertDialogTrigger className="flex flex-col items-center justify-center rounded-lg border p-2 text-secondary-foreground shadow-md">
                  <span className="text-secondary-foreground">
                    <LogOut strokeWidth={2} />
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
              {/* Help & Privacy */}
              <Link
                href="/dashboard"
                onClick={handleLinkClick}
                className="flex flex-col items-center justify-center rounded-lg border p-2 shadow-md"
              >
                <span className="text-secondary-foreground">
                  <CircleHelp strokeWidth={2} />
                </span>
                <span className="font-medium text-secondary-foreground">
                  Help & Privacy
                </span>
              </Link>
            </div>
          </DrawerContent>
        </Drawer>
      </ul>
    </div>
  );
}
