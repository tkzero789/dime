"use client";

import React from "react";
import Image from "next/image";
import Logo from "@/public/svg/coin.svg";
import {
  CircleDollarSign,
  LayoutGrid,
  LogOut,
  PiggyBank,
  Banknote,
  Settings,
  Landmark,
  ArrowLeftRight,
  RefreshCcwDot,
  BotMessageSquare,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
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
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SideNav() {
  // Menu list
  const menu = [
    { option: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { option: "Budgets", icon: Banknote, href: "/budgets" },
    { option: "Spending", icon: CircleDollarSign, href: "/spending" },
    { option: "Transaction", icon: ArrowLeftRight, href: "/transaction" },
    { option: "Recurring", icon: RefreshCcwDot, href: "/recurring" },
    { option: "Income", icon: Landmark, href: "/income" },
    { option: "Saving", icon: PiggyBank, href: "/saving" },
    { option: "Penny", icon: BotMessageSquare, href: "/penny" },
  ];
  // Path name
  const path = usePathname();

  return (
    <aside className="sticky left-0 top-0 hidden h-dvh w-60 flex-col gap-y-4 border-r shadow-sm lg:flex">
      <div className="flex h-[74px] items-center gap-2 border-b px-6 py-4">
        <Image src={Logo} alt="logo" width={40} height={40} />
        <div className="font-serif text-2xl font-bold text-teal-600">Dime</div>
      </div>
      {/* <SideNavAccount /> */}
      <ul className="flex flex-1 flex-col gap-y-4 px-4 pb-4">
        {menu.map((item, index) => (
          <li
            key={index}
            className={`cursor-pointer rounded-md transition-all hover:bg-gray-200 ${path.startsWith(item.href) && "bg-gray-100"}`}
          >
            <Link href={item.href} className="flex items-center gap-2 p-2">
              <span>
                <item.icon
                  className={`h-6 w-6 ${path.startsWith(item.href) && "stroke-teal-600"}`}
                  strokeWidth={2}
                />
              </span>
              <div
                className={`text-sm ${path.startsWith(item.href) ? "font-semibold" : "font-medium"}`}
              >
                {item.option}
              </div>
            </Link>
          </li>
        ))}
        <div className="mt-auto flex flex-col gap-y-4">
          <div className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-all hover:bg-gray-200">
            <span>
              <Settings className="h-6 w-6" strokeWidth={2} />
            </span>
            <div className="text-sm font-medium">Settings</div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger className="flex w-full items-center gap-2 rounded-md p-2 transition-all hover:bg-gray-200">
              <span>
                <LogOut className="h-6 w-6" strokeWidth={2} />
              </span>
              <div className="text-sm font-medium">Sign out</div>
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
      </ul>
    </aside>
  );
}
