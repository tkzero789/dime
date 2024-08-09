"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function DashboardHeader() {
  // Display correct name in the span base   on the path
  const path = usePathname();
  // Get the specific string for each path
  function checkPath(path: string) {
    if (path === "/dashboard") {
      const pathSplit = path.split("/");
      return pathSplit[1].charAt(0).toUpperCase() + pathSplit[1].slice(1);
    } else {
      const pathSplit = path.split("/");
      return pathSplit[2].charAt(0).toUpperCase() + pathSplit[2].slice(1);
    }
  }
  // Assign the path string to a variable
  const pathUrl = checkPath(path);

  return (
    <div className="flex items-center justify-between bg-[#f8f8f8] px-8 py-4">
      <span className="text-2xl font-semibold">{pathUrl}</span>
      <UserButton
        showName
        appearance={{
          variables: {
            fontSize: "0.9rem",
          },
          elements: {
            userButtonBox: {
              flexDirection: "row-reverse",
            },
            userButtonOuterIdentifier: {
              paddingLeft: "0px",
            },
          },
        }}
      />
    </div>
  );
}
