"use client";

import React from "react";
import Image from "next/image";
import Logo from "@/public/coin.svg";
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
  Table,
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
    { option: "Tanstack", icon: Table, href: "/tanstack" },
  ];
  // Path name
  const path = usePathname();

  return (
    <aside className="sticky left-0 top-0 hidden h-dvh w-60 flex-col gap-y-4 border-r shadow-sm lg:flex">
      <div className="flex items-center gap-2 border-b px-6 py-4">
        <Image src={Logo} alt="logo" width={40} height={40} />
        <span className="font-serif text-2xl font-bold text-teal-600">
          Dime
        </span>
      </div>
      <ul className="flex flex-1 flex-col gap-y-4 px-4 pb-4">
        {menu.map((item, index) => (
          <li
            key={index}
            className={`cursor-pointer rounded-md font-semibold transition-all hover:bg-gray-200 ${path.startsWith(item.href) && "text-teal-700"}`}
          >
            <Link href={item.href} className="flex items-center gap-2 p-2">
              <span>
                <item.icon
                  className={`${path.startsWith(item.href) && "fill-teal-500 stroke-teal-800"}`}
                />
              </span>
              <span>{item.option}</span>
            </Link>
          </li>
        ))}
        <div className="mt-auto flex flex-col gap-y-4">
          <div className="flex cursor-pointer items-center gap-2 rounded-md p-2 font-semibold transition-all hover:bg-gray-200">
            <span>
              <Settings />
            </span>
            <span>Settings</span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger className="flex w-full items-center gap-2 rounded-md p-2 font-semibold transition-all hover:bg-gray-200">
              <span>
                <LogOut />
              </span>
              <span>Sign out</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to sign out?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action will terminate your current session, and you'll
                  need to log in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
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
