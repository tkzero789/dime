"use client";

import GetGreeting from "@/utils/getGreeting";
import { LayoutGrid } from "lucide-react";
import React from "react";

export default function DashboardNav() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
        <LayoutGrid className="size-4 text-primary-foreground" />
      </div>
      <h1>
        <GetGreeting />
      </h1>
    </div>
  );
}
