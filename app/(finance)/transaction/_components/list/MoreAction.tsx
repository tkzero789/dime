import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteSingle from "../single/DeleteSingle";
import { useUser } from "@clerk/nextjs";
import EditSingle from "../single/EditSingle";
import { SingleDetail } from "@/types/types";

type NewSingleDetail = SingleDetail & {
  type: string;
};

type Props = {
  singleId: string;
  singleInfo: NewSingleDetail;
  refreshData: () => void;
};

export default function MoreAction({
  singleId,
  singleInfo,
  refreshData,
}: Props) {
  const { user } = useUser();
  const currentUser = user?.primaryEmailAddress?.emailAddress;
  return (
    <Popover>
      <PopoverTrigger asChild className="w-auto md:w-2/5">
        <Button variant="ghost">
          <span className="inline-block pr-2">More Actions</span>{" "}
          <ChevronDown strokeWidth={1} className="h-auto w-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-44 px-0 py-0">
        <div className="p-1">
          <EditSingle
            currentUser={currentUser || "default"}
            singleInfo={singleInfo}
            refreshData={refreshData}
          />
          <DeleteSingle
            currentUser={currentUser || "default"}
            singleId={singleId}
            refreshData={refreshData}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
