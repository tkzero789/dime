import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

export default function SideNavAccount() {
  const { user } = useUser();
  return (
    <div className="px-6 py-4">
      <div className="flex items-center gap-4 rounded-xl border p-4">
        <div className="flex items-center gap-2">
          <Image
            src={user?.imageUrl || ""}
            alt="User profile"
            width={34}
            height={34}
            className="h-[34px] w-[34px] rounded-full"
          />
          <div className="flex flex-col justify-between">
            <div>{user?.fullName}</div>
            <div className="truncate text-xs">
              {user?.primaryEmailAddress?.emailAddress}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
