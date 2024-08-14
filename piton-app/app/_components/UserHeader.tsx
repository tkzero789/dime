"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import MobileNav from "./MobileNav";

export default function UserHeader() {
  return (
    <div className="flex items-center justify-between bg-[#f5f5f5] px-8 py-4 lg:justify-end">
      <MobileNav />
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
