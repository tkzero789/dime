import React from "react";
import SideNav from "../_components/SideNav";
import UserHeader from "../_components/UserHeader";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex">
      <SideNav />
      <div className="flex-1">
        <div className="flex h-full flex-col">
          <UserHeader />
          {children}
        </div>
      </div>
    </main>
  );
}
