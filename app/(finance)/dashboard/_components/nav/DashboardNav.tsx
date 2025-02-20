"use client";

import { Button } from "@/components/ui/button";
import GetGreeting from "@/utils/getGreeting";
import React from "react";

export default function DashboardNav() {
  return (
    <div className="rounded-xl bg-white p-4 shadow-card-shadow">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">
          <GetGreeting />
        </div>
        <Button>Action</Button>
      </div>
    </div>
  );
}
