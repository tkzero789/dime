import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

type Props = {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TransactionSearch({
  searchQuery,
  onSearchChange,
}: Props) {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search transaction"
        value={searchQuery}
        onChange={onSearchChange}
      />
      <Search
        strokeWidth={2}
        color="#555353"
        className="absolute right-0 top-0 mr-3 mt-2 h-6 w-6"
      />
    </div>
  );
}
