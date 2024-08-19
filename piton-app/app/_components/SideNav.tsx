"use client";

import React from "react";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import {
  CircleDollarSign,
  HandCoins,
  LayoutGrid,
  LogOut,
  Settings,
  ShieldPlus,
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
    { option: "Budgets", icon: HandCoins, href: "/budgets" },
    { option: "Expenses", icon: CircleDollarSign, href: "/expenses" },
    { option: "Upgrade", icon: ShieldPlus, href: "/upgrade" },
  ];
  // Path name
  const path = usePathname();

  return (
    <aside className="sticky left-0 top-0 hidden h-screen w-60 border shadow-sm lg:block">
      <div className="flex items-center gap-2 border-b p-4">
        <Image src={Logo} alt="logo" width={60} height={60} />
        <span className="text-2xl font-bold text-teal-700">Piton</span>
      </div>
      <ul className="mt-4 flex flex-col gap-y-4 px-4">
        {menu.map((item, index) => (
          <li
            key={index}
            className={`cursor-pointer rounded-md font-semibold transition-all hover:bg-gray-200 ${path.startsWith(item.href) && "text-teal-700"}`}
          >
            <Link href={item.href} className="flex items-center gap-2 p-2">
              <span>
                <item.icon />
              </span>
              <span>{item.option}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="absolute bottom-10 flex w-full flex-col gap-y-4 px-4">
        <div className="flex cursor-pointer items-center gap-2 p-2 font-semibold transition-all hover:bg-gray-200">
          <span>
            <Settings />
          </span>
          <span>Settings</span>
        </div>
        <AlertDialog>
          <AlertDialogTrigger className="flex items-center gap-2 p-2 font-semibold transition-all hover:bg-gray-200">
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
                This action will terminate your current session, and you'll need
                to log in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <SignOutButton />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
}
