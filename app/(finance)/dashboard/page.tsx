"use client";

import React from "react";

import DashboardNav from "./_components/nav/DashboardNav";

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  return (
    <>
      <DashboardNav />
      <div className="flex flex-col gap-4">
        {/* <DashboardTopSection spending={spending} isLoading={isLoading} /> */}
        {/* <DashboardMidSection allData={allData} isLoading={isLoading} /> */}
      </div>
    </>
  );
}
