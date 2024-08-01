import React from "react";
import { UserButton, SignOutButton } from "@clerk/nextjs";

export default function Dashboard() {
  return (
    <div>
      Dashboard
      <UserButton />
      <SignOutButton />
    </div>
  );
}
