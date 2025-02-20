"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  ArrowLeftRight,
  Banknote,
  BotMessageSquare,
  CircleDollarSign,
} from "lucide-react";

const components: {
  title: string;
  icon: React.ElementType;
  href: string;
  description: string;
}[] = [
  {
    title: "Budgets",
    icon: Banknote,
    href: "/",
    description: "Create and manage budgets",
  },
  {
    title: "Transactions",
    icon: ArrowLeftRight,
    href: "/",
    description: "Customize transactions",
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
    return "bg-red-400 bg-opacity-50";
  } else if (title === "Spending") {
    return "bg-yellow-400 bg-opacity-50";
  } else {
    return "bg-sky-400 bg-opacity-50";
  }
};

const getTitleStroke = (title: string) => {
  if (title === "Budgets") {
    return "stroke-teal-700";
  } else if (title === "Transactions") {
    return "stroke-red-700";
  } else if (title === "Spending") {
    return "stroke-yellow-700";
  } else {
    return "stroke-sky-700";
  }
};

const getHoverBg = (title: string) => {
  if (title === "Budgets") {
    return "hover:bg-teal-400 hover:bg-opacity-10";
  } else if (title === "Transactions") {
    return "hover:bg-red-400 hover:bg-opacity-10";
  } else if (title === "Spending") {
    return "hover:bg-yellow-400 hover:bg-opacity-10";
  } else {
    return "hover:bg-sky-400 hover:bg-opacity-10";
  }
};

export function FeaturesDropDown() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-base hover:bg-transparent hover:text-secondary-foreground focus:bg-transparent">
            Features
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[620px] md:grid-cols-2">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  href={component.href}
                  className={`${getHoverBg(component.title)}`}
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`rounded-lg p-2 ${getTitleBg(component.title)}`}
                    >
                      <component.icon
                        className={`h-5 w-5 ${getTitleStroke(component.title)}`}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm leading-none text-foreground">
                        {component.title}
                      </div>
                      <p className="text-[13px] font-normal leading-snug text-secondary-foreground">
                        {component.description}
                      </p>
                    </div>
                  </div>
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-secondary hover:text-secondary-foreground focus:bg-secondary focus:text-secondary-foreground",
            className,
          )}
          {...props}
        >
          <div>{children}</div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
