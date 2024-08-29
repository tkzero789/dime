import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

export default function TransactionSearch() {
  return (
    <div className="relative">
      <Input placeholder="Search transaction" />
      <Search
        strokeWidth={2}
        color="#555353"
        className="absolute right-0 top-0 mr-3 mt-2 h-6 w-6"
      />
    </div>
  );
}
