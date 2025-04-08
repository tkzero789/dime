import React from "react";
import SideNav from "./_components/SideNav";
import MobileNav from "./_components/MobileNav";
import QueryProvider from "./_components/QueryProvider";
import "@/css/app.css";
import "@/css/embla.css";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-[#fbfbfb]">
      <div className="mx-auto flex w-full max-w-[96rem]">
        <SideNav />
        <div className="finance-layout relative flex-1">
          <QueryProvider>{children}</QueryProvider>
        </div>
        <MobileNav />
      </div>
    </main>
  );
}
