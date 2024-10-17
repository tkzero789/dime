import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function HeroSection() {
  return (
    <section className="mt-32 text-center">
      <h1 className="mx-auto max-w-2xl text-5xl font-bold text-medium">
        Master your{" "}
        <span className="bg-gradient-to-b from-emerald-400 to-teal-600 bg-clip-text text-transparent">
          Monthly Finances
        </span>{" "}
        and{" "}
        <span className="block bg-gradient-to-b from-emerald-400 to-teal-600 bg-clip-text text-transparent sm:inline">
          Build Stability
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl font-medium text-medium">
        Take control of your budget, track spending effortlessly, and get
        AI-powered insights to secure your financial future.
      </p>
      <Button asChild className="mt-12 rounded-full px-6 py-6 text-base">
        <Link href="/sign-up">Start for free</Link>
      </Button>
      <div className="mt-10 flex justify-center">
        <div className="item-start flex flex-col justify-center gap-3 md:flex-row lg:items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500 bg-opacity-50 p-1">
              <Check className="h-4 w-4 stroke-green-700" />
            </div>

            <span className="text-sm text-medium">
              Intuitive Budget Management
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500 bg-opacity-50 p-1">
              <Check className="h-4 w-4 stroke-green-700" />
            </div>
            <span className="text-sm text-medium">
              AI-Powered Spending Insights
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-500 bg-opacity-50 p-1">
              <Check className="h-4 w-4 stroke-green-700" />
            </div>
            <span className="text-sm text-medium">
              Visualize Savings Progress
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
