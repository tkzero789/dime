import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <div className="mx-auto mb-10 mt-24 max-w-2xl text-center">
      <h1 className="text-4xl font-bold lg:font-extrabold">
        <span className="bg-gradient-to-b from-orange-400 to-amber-600 bg-clip-text text-transparent">
          Master Your Life
        </span>{" "}
        with Finance, Health, and Productivity in{" "}
        <span className="block bg-gradient-to-b from-orange-400 to-amber-600 bg-clip-text text-transparent sm:inline">
          One Place
        </span>
      </h1>
      <p className="mt-5 text-gray-600">
        Manage your finances, track your health, and boost your productivity
        with personalized insights to help you thrive.
      </p>
      <Button className="mt-5">
        <Link href="/">Start for free</Link>
      </Button>
    </div>
  );
}
