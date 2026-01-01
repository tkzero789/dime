import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:stroke-[1.5] leading-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        subtle: "bg-muted text-foreground hover:bg-secondary",
        outline:
          "border bg-background text-foreground hover:border-primary hover:text-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        translucent: "bg-white/20 text-white hover:bg-white/30",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-4 [&_svg]:size-4",
        icon: "size-9",
        "icon-sm": "size-8 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
