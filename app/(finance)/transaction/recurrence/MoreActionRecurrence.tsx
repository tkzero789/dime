"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDown, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecurrenceDetail } from "@/types/types";
import { useUser } from "@clerk/nextjs";
import DeleteRecurrence from "./DeleteRecurrence";
import Link from "next/link";

type Props = {
  recurrenceId: string;
  recurrenceInfo: RecurrenceDetail;
};

export default function MoreActionRecurrence({
  recurrenceId,
  recurrenceInfo,
}: Props) {
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
          <Button
            asChild
            className="flex h-fit w-full items-center justify-start gap-2 rounded-md bg-transparent px-0 py-2 text-sm font-normal text-dark hover:bg-neutral-200"
          >
            <Link href="/recurring">
              <span className="pl-4">
                <Pencil strokeWidth={2} className="h-4 w-4" color="#555353" />
              </span>
              <span className="font-semibold text-medium">Edit</span>
            </Link>
          </Button>
          <DeleteRecurrence
            recurrenceId={recurrenceId}
            currentUser={currentUser}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
