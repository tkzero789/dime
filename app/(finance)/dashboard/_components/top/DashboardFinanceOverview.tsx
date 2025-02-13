import React from "react";
import { CalendarDays, Edit, PiggyBank, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardFinanceOverview() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-lg border bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Financial Overview</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusCircle className="h-6 w-6" strokeWidth={1.75} color="#555353" />
          Add
        </Button>
      </div>
      {/* Accounts */}
      <div className="flex flex-col justify-center gap-2 text-base font-medium">
        <div className="relative flex w-full flex-col justify-between gap-8 overflow-hidden rounded-xl bg-gradient-to-bl from-blue-600 to-blue-800 p-6">
          <div className="flex flex-col gap-4">
            {/* Top */}
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-white">Capital One</div>
            </div>
            {/* Middle */}
            <div className="flex justify-between">
              <div className="flex flex-col gap-1">
                <div className="text-3xl tracking-wide text-white">
                  $2,121.65
                </div>
                <div className="text-sm text-white">Current Balance</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-3xl tracking-wide text-white">
                  $3,469.15
                </div>
                <div className="text-sm text-white">Available Credit</div>
              </div>
            </div>
          </div>
          {/* Bottom */}
          <div className="flex w-full items-center justify-between gap-4 text-sm text-white">
            <button className="flex w-fit items-center gap-2 rounded-full bg-white/20 px-2 py-1">
              <Edit className="h-4 w-4" strokeWidth={2} />
              Edit account
            </button>
            <div className="text-sm font-semibold text-white">Credit</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/recurring"
          className="flex items-center gap-4 rounded-xl border bg-white px-6 py-4 hover:border-neutral-400"
        >
          <div className="flex items-center justify-center rounded-full bg-teal-100 p-2">
            <CalendarDays className="h-5 w-5 stroke-teal-700" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-semibold">Upcomming Bills</div>
            <div className="text-sm">Your next payments</div>
          </div>
        </Link>
        <Link
          href="/saving"
          className="flex items-center gap-4 rounded-xl border bg-white px-6 py-4 hover:border-neutral-400"
        >
          <div className="flex items-center justify-center rounded-full bg-teal-100 p-2">
            <PiggyBank className="h-5 w-5 stroke-teal-700" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-semibold">Financial Goals</div>
            <div className="text-sm">Track your saving</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
