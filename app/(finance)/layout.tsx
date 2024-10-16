import React from "react";
import SideNav from "../_components/Nav/SideNav";
import MobileNav from "../_components/Nav/MobileNav";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex">
      <SideNav />
      <div className="flex-1 overflow-hidden">
        <div className="h-full">{children}</div>
      </div>
      <MobileNav />
    </main>
  );
}
