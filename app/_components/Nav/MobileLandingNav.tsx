"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/public/svg/coin.svg";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ChevronDown, ChevronUp, LogIn, Menu } from "lucide-react";
import {
  ArrowLeftRight,
  Banknote,
  BotMessageSquare,
  CircleDollarSign,
} from "lucide-react";

export default function MobileLandingNav() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const contents: {
    title: string;
    icon: React.ElementType;
    href: string;
    description: string;
  }[] = [
    {
      title: "Budgets",
      icon: Banknote,
      href: "/",
      description: "Create and manage custom budgets",
    },
    {
      title: "Transactions",
      icon: ArrowLeftRight,
      href: "/",
      description: "Add, edit, and search transactions",
    },
    {
      title: "Spending",
      icon: CircleDollarSign,
      href: "/",
      description: "Visualize income vs. expenses",
    },
    {
      title: "Penny - AI Assistant",
      icon: BotMessageSquare,
      href: "/",
      description: "Get personalized financial advice",
    },
  ];

  const getTitleBg = (title: string) => {
    if (title === "Budgets") {
      return "bg-teal-400 bg-opacity-50";
    } else if (title === "Transactions") {
      return "bg-yellow-400 bg-opacity-50";
    } else if (title === "Spending") {
      return "bg-red-400 bg-opacity-50";
    } else {
      return "bg-sky-400 bg-opacity-50";
    }
  };

  const getTitleStroke = (title: string) => {
    if (title === "Budgets") {
      return "stroke-teal-700";
    } else if (title === "Transactions") {
      return "stroke-yellow-700";
    } else if (title === "Spending") {
      return "stroke-red-700";
    } else {
      return "stroke-sky-700";
    }
  };

  return (
    <div className="fixed left-0 right-0 top-0 mt-2 px-2 lg:hidden">
      <div className="nav-shadow flex items-center justify-between rounded-full bg-white px-4 py-2">
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} alt="logo" width={34} height={34} />
          <h1 className="font-serif text-2xl font-bold text-teal-600">Dime</h1>
        </Link>
        <Sheet>
          <SheetTrigger>
            <Menu />
          </SheetTrigger>
          <SheetContent>
            <VisuallyHidden>
              <SheetHeader>
                <SheetTitle></SheetTitle>
                <SheetDescription></SheetDescription>
              </SheetHeader>
            </VisuallyHidden>
            <div className="mt-8 flex flex-col gap-8 font-medium text-dark">
              <div className="flex flex-col gap-4">
                <Button
                  asChild
                  className="w-full rounded-full border bg-gray-100 text-dark hover:bg-gray-200"
                >
                  <Link href="/sign-in" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" strokeWidth={1.25} />
                    Sign In
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col gap-8">
                <Collapsible>
                  <CollapsibleTrigger
                    className="flex w-full items-center justify-between"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    Features
                    <ChevronDown
                      className={`h-4 w-4 transition-all duration-100 ${isOpen ? "rotate-180" : "rotate-0"}`}
                      strokeWidth={1.25}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="flex flex-col">
                    {contents.map((content) => (
                      <Link
                        href={content.href}
                        key={content.title}
                        className="flex items-center gap-4 border-b py-3 first:mt-4 last:border-b-0"
                      >
                        <div
                          className={`rounded-full p-2 ${getTitleBg(content.title)}`}
                        >
                          <content.icon
                            className={`h-5 w-5 ${getTitleStroke(content.title)}`}
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-medium text-dark">
                            {content.title}
                          </div>
                          <div className="text-xs text-medium">
                            {content.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
                <Link href="/">Pricing</Link>
                <Link href="/">Review</Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
