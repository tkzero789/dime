import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";

export default function EditAccount() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <EllipsisVertical />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">Edit account</PopoverContent>
    </Popover>
  );
}
