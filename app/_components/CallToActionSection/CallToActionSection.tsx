import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import IMG from "@/public/remind.png";
import Link from "next/link";

export default function CallToActionSection() {
  return (
    <div className="mx-auto mt-40 w-full max-w-7xl px-4">
      <div className="flex flex-col-reverse items-center justify-center gap-4 rounded-3xl bg-gradient-to-tr from-orange-200 to-amber-300 px-10 py-10 md:flex-row md:justify-between xl:px-40">
        <div className="flex w-full flex-col gap-8 md:w-1/2">
          <h1 className="pr-0 text-center text-2xl font-bold text-medium md:pr-8 md:text-start lg:text-3xl">
            Save More, Spend Less, and Live Better
          </h1>
          <Button
            asChild
            className="mx-auto w-fit rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-base hover:to-emerald-600 md:mx-0"
            size="lg"
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
        <div className="flex w-full justify-center md:w-1/2">
          <div className="h-[220px] w-[300px] overflow-hidden object-cover md:h-[230px] md:w-[320px] lg:h-[280px] lg:w-[448px] xl:w-[440px]">
            <Image
              src={IMG}
              alt="call to action"
              className="h-[220px] w-[300px] md:h-[230px] md:w-[320px] lg:h-[280px] lg:w-[448px] xl:w-[440px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
