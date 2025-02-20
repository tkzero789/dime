import React from "react";
import SideNav from "./_components/SideNav";
import MobileNav from "../_components/Nav/MobileNav";
import "@/css/app.css";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex bg-[#fbfbfb]">
      <SideNav />
      <div className="finance-layout relative flex-1">{children}</div>
      <MobileNav />
    </main>
  );
}
