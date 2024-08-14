"use client";

import React from "react";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import {
  CircleDollarSign,
  HandCoins,
  LayoutGrid,
  ShieldPlus,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SideNav() {
  // Menu list
  const menu = [
    { option: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { option: "Budgets", icon: HandCoins, href: "/budgets" },
    { option: "Expenses", icon: CircleDollarSign, href: "/expenses" },
    { option: "Upgrade", icon: ShieldPlus, href: "/upgrade" },
  ];
  // Params
  const path = usePathname();

  return (
    <aside className="left-0 top-0 hidden h-screen w-60 border shadow-sm lg:block">
      <div className="flex items-center gap-2 border-b p-4">
        <Image src={Logo} alt="logo" width={60} height={60} />
        <span className="text-2xl font-semibold">Piton</span>
      </div>
      <ul className="mt-4 flex flex-col gap-y-4 px-4">
        {menu.map((item, index) => (
          <li
            key={index}
            className={`cursor-pointer rounded-md font-semibold transition-all hover:bg-gray-200 ${path.startsWith(item.href) && "text-orange-700"}`}
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
    </aside>
  );
}
