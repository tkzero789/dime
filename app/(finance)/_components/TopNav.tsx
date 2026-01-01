"use client";

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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@clerk/nextjs";
import {
  ArrowLeftRight,
  Banknote,
  BotMessageSquare,
  CircleDollarSign,
  Landmark,
  LayoutGrid,
  PiggyBank,
  RefreshCcwDot,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const menu = [
  { option: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { option: "Budgets", icon: Banknote, href: "/budgets" },
  { option: "Spending", icon: CircleDollarSign, href: "/spending" },
  { option: "Transaction", icon: ArrowLeftRight, href: "/transaction" },
  { option: "Recurring", icon: RefreshCcwDot, href: "/recurring" },
  {
    option: "Income",
    icon: Landmark,
    href: "/income",
  },
  { option: "Saving", icon: PiggyBank, href: "/saving" },
  { option: "Penny", icon: BotMessageSquare, href: "/penny" },
];

export default function TopNav() {
  const pathName = usePathname();

  return (
    <div className="hidden w-full items-center justify-between rounded-b-xl bg-background p-2 lg:flex">
      <ul className="flex items-center">
        {menu.map((item) => (
          <li key={item.option} className="relative">
            <Button
              asChild
              variant="subtle"
              className={cn("bg-transparent hover:bg-muted")}
            >
              <Link
                href={item.href}
                className={cn(
                  "font-normal",
                  pathName === item.href && "font-semibold",
                )}
              >
                {item.option}
              </Link>
            </Button>
            <div
              className={cn(
                "absolute bottom-0 left-1/2 h-[2px] w-1/2 -translate-x-1/2 bg-primary",
                pathName === item.href ? "block" : "hidden",
              )}
            ></div>
          </li>
        ))}
      </ul>
      <div className="flex items-center">
        <Button variant="ghost" className="justify-start font-normal">
          Settings
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="justify-start font-normal">
              Sign out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to sign out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will terminate your current session, and you&apos;ll
                need to log in again to access your account.
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
  );
}
