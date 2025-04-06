import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

export default function EditAccount() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="data-[state=open]:bg-muted"
        >
          <Ellipsis />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">Edit account</PopoverContent>
    </Popover>
  );
}
