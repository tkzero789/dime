"use client";

import React from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { db } from "@/db/dbConfig";
import { Budgets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  // Get user information from clerk
  const { user } = useUser();
  const router = useRouter();

  // If budget == 0, move to budgets page
  React.useEffect(() => {
    checkUserBudgets();
  }, [user]);

  const checkUserBudgets = async () => {
    const result = await db
      .select()
      .from(Budgets)
      .where(
        eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress ?? ""),
      );
    if (result?.length == 0) {
      router.replace("/dashboard/budgets");
    } else {
      router.replace("/dashboard");
    }
  };

  return (
    <div>
      <div className="fixed hidden md:block md:w-64">
        <SideNav />
      </div>
      <div className="md:ml-64">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}
