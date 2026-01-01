import React from "react";

import MobileNav from "./_components/MobileNav";
import QueryProvider from "./_components/QueryProvider";
import "@/css/app.css";
import "@/css/embla.css";
import TopNav from "./_components/TopNav";

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-muted">
      <div className="mx-auto min-h-dvh w-full max-w-7xl px-4 pb-20">
        <TopNav />
        <QueryProvider>{children}</QueryProvider>
        <MobileNav />
      </div>
    </main>
  );
}
