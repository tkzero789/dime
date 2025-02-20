import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";

const CardBG = [
  { name: "Red", value: "from-red-600 to-red-800" },
  { name: "Orange", value: "from-orange-600 to-orange-800" },
  { name: "Yellow", value: "from-yellow-600 to-yellow-800" },
  { name: "Lime", value: "from-lime-600 to-lime-800" },
  { name: "Green", value: "from-green-600 to-green-800" },
  { name: "Emerald", value: "from-emerald-600 to-emerald-800" },
  { name: "Cyan", value: "from-cyan-600 to-cyan-800" },
  { name: "Sky", value: "from-sky-600 to-sky-800" },
  { name: "Blue", value: "from-blue-600 to-blue-800" },
  { name: "Violet", value: "from-violet-600 to-violet-800" },
  { name: "Purple", value: "from-purple-600 to-purple-800" },
  { name: "Fuchsia", value: "from-fuchsia-600 to-fuchsia-800" },
  { name: "Pink", value: "from-pink-600 to-pink-800" },
  { name: "Rose", value: "from-rose-600 to-rose-800" },
  { name: "Slate", value: "from-slate-600 to-slate-800" },
  { name: "Stone", value: "from-stone-600 to-stone-800" },
];

type AddAccountState = {
  name: string;
  type: string;
  amount: string;
  debt: string;
  color: string;
};

type Props = {
  handleFormChange: (field: keyof AddAccountState, value: string) => void;
};

export default function PickCardBg({ handleFormChange }: Props) {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-2 rounded-full bg-white/20 px-2 py-1 text-xs hover:bg-white/30">
        <Edit className="h-4 w-4" strokeWidth={2} />
        Card background
      </PopoverTrigger>
      <PopoverContent className="grid w-fit grid-cols-4 gap-4">
        {CardBG.map((item) => (
          <PopoverClose asChild key={item.name}>
            <button
              className={cn(
                "relative h-12 w-20 rounded-md bg-gradient-to-bl transition-all hover:scale-105",
                item.value,
              )}
              onClick={() => handleFormChange("color", item.value)}
            >
              <div className="absolute left-0 top-0 px-2 py-1 text-xs text-white">
                {item.name}
              </div>
            </button>
          </PopoverClose>
        ))}
      </PopoverContent>
    </Popover>
  );
}
