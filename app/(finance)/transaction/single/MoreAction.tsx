"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteSingle from "./DeleteSingle";

import { SingleDetail } from "@/types";
import EditSingle from "./EditSingle";
import { useUser } from "@clerk/nextjs";

type Props = {
  singleId: string;
  singleInfo: SingleDetail;
};

export default function MoreAction({ singleId, singleInfo }: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress ?? "";
  return (
    <Popover>
      <PopoverTrigger asChild className="w-auto md:w-2/5">
        <Button variant="outline">
          <span className="inline-block pr-2">More Actions</span>{" "}
          <ChevronDown strokeWidth={1} className="h-auto w-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 px-0 py-0">
        <div className="p-1">
          <EditSingle singleInfo={singleInfo} currentUser={currentUser} />
          <DeleteSingle singleId={singleId} currentUser={currentUser} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
