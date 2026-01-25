"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Banknote,
  Bell,
  BotMessageSquare,
  CircleDollarSign,
  LayoutGrid,
  Settings,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Image from "next/image";

const DESKTOP_MENU = [
  { title: "Home", href: "/dashboard", icon: LayoutGrid },
  { title: "Transactions", href: "/transactions", icon: CircleDollarSign },
  { title: "Budgets", href: "/budgets", icon: Banknote },
  { title: "Penny", href: "/penny", icon: BotMessageSquare },
];

export default function TopNav() {
  const pathName = usePathname();
  const { user } = useUser();

  return (
    <div className="hidden w-full items-center justify-between rounded-b-xl bg-background p-2 lg:flex">
      <ul className="flex items-center">
        {DESKTOP_MENU.map((item) => (
          <li key={item.title} className="relative">
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
                {item.title}
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
      <div className="flex items-center gap-2 pr-4">
        <Button variant="outline" size="icon-sm" className="relative">
          <Bell />
          <div className="absolute -right-1 -top-1 size-3 rounded-full bg-primary"></div>
        </Button>
        <Button variant="outline" size="icon-sm">
          <Settings />
        </Button>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex size-8 items-center justify-center rounded-lg border focus-visible:outline-none">
              <Image
                src={user?.imageUrl}
                height={32}
                width={32}
                alt="User profile"
                className="size-full rounded-lg object-cover"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>{user.fullName}</div>
                <div className="font-normal">
                  {user.primaryEmailAddress?.emailAddress}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Theme</DropdownMenuItem>
              <DropdownMenuItem asChild className="w-full">
                <SignOutButton redirectUrl="/sign-in" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
