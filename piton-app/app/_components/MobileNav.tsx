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

export default function MobileNav() {
  const path = usePathname();
  // Menu list
  const menu = [
    { option: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { option: "Budgets", icon: Banknote, href: "/budgets" },
    { option: "Spending", icon: CircleDollarSign, href: "/spending" },
    { option: "Saving", icon: PiggyBank, href: "/saving" },
  ];

  return (
    <div className="fixed bottom-0 left-0 h-16 w-dvw bg-white shadow-[rgba(0,0,0,0.35)_0px_5px_15px] lg:hidden">
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
                className={`text-medium ${path.startsWith(item.href) && "text-teal-700"}`}
              >
                <item.icon
                  strokeWidth={2}
                  className={`${path.startsWith(item.href) && "fill-teal-500 stroke-teal-800"}`}
                />
              </span>
              <span
                className={`text-sm font-medium text-medium ${path.startsWith(item.href) && "text-teal-700"}`}
              >
                {item.option}
              </span>
            </Link>
          </li>
        ))}

        <Drawer>
          <DrawerTrigger className="flex h-full w-full flex-col items-center justify-center">
            <span className="text-medium">
              <Menu strokeWidth={2.25} />
            </span>
            <span className="text-sm font-medium text-medium">More</span>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-center">More options</DrawerTitle>
            </DrawerHeader>
            <div className="grid w-full grid-cols-2 gap-4 px-4 pb-4">
              <Link
                href="/"
                className="flex flex-col items-center justify-center rounded-lg border p-2 shadow-md"
              >
                <span className="text-medium">
                  <CircleHelp strokeWidth={2} />
                </span>
                <span className="font-medium text-medium">Help & Privacy</span>
              </Link>
              <Link
                href="/"
                className="flex flex-col items-center justify-center rounded-lg border p-2 shadow-md"
              >
                <span className="text-medium">
                  <Bell strokeWidth={2} />
                </span>
                <span className="font-medium text-medium">Notifications</span>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger className="flex flex-col items-center justify-center rounded-lg border p-2 text-medium shadow-md">
                  <span className="text-medium">
                    <LogOut strokeWidth={2} />
                  </span>
                  <span className="font-medium text-medium">Sign Out</span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to sign out?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will terminate your current session, and
                      you'll need to log in again to access your account.
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
              <Link
                href="/"
                className="flex flex-col items-center justify-center rounded-lg border p-2 shadow-md"
              >
                <span className="text-medium">
                  <BookUp2 strokeWidth={2} />
                </span>
                <span className="font-medium text-medium">Upgrade</span>
              </Link>
            </div>
          </DrawerContent>
        </Drawer>
      </ul>
    </div>
  );
}
