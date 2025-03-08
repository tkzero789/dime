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
import { usePathname, useRouter } from "next/navigation";
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
import { cn } from "@/lib/utils";
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

export default function SideNav() {
  const path = usePathname();
  const router = useRouter();

  return (
    <aside className="sticky left-0 top-0 hidden h-dvh w-60 flex-col gap-y-4 border-r bg-white shadow-sm lg:flex">
      <div className="flex h-[74px] items-center gap-2 border-b px-6 py-4">
        <Image src={Logo} alt="logo" width={40} height={40} />
        <div className="font-serif text-2xl font-bold text-teal-600">Dime</div>
      </div>
      {/* <SideNavAccount /> */}
      <ul className="flex flex-1 flex-col gap-y-4 px-4 pb-4">
        {menu.map((item, index) => (
          <li key={index}>
            <Button
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start",
                path.startsWith(item.href) && "bg-muted",
              )}
            >
              <Link
                href={item.href}
                onClick={(e) => {
                  if (item.href === "/income") {
                    e.preventDefault();
                    router.replace(
                      "/income?startDate=2025-01-01&endDate=2025-12-31",
                    );
                  }
                }}
                className="flex items-center gap-2 p-2"
              >
                <item.icon
                  className={`${path.startsWith(item.href) && "stroke-primary"}`}
                />
                <div
                  className={`${path.startsWith(item.href) && "font-semibold"}`}
                >
                  {item.option}
                </div>
              </Link>
            </Button>
          </li>
        ))}
        <div className="mt-auto flex flex-col gap-y-4">
          <Button variant="ghost" className="justify-start">
            <Settings />
            Settings
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="justify-start">
                <LogOut />
                Sign out
              </Button>
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
