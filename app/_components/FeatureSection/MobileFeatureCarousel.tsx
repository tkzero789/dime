"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Dashboard2 from "@/public/img/dashboard2.png";
import Budget1 from "@/public/img/budget1.png";
import Transaction2 from "@/public/img/transaction2.png";
import Spending1 from "@/public/img/spending1.png";
import Image from "next/image";
import { BotMessageSquare } from "lucide-react";
import {
  DotButton,
  useDotButton,
} from "@/components/ui/carousel-dot-indicators";

const features = [
  {
    title: "Dashboard",
    description:
      "View your budgets, income, expenses to stay on track with your goals",
    image: Dashboard2,
    imageAlt: "Dashboard Chart",
    imageClassName: "h-[120px] w-[250px]  rounded-lg md:h-[140px] md:w-[270px]",
  },
  {
    title: "Budgets",
    description:
      "Create and manage multiple budgets tailored to your unique financial needs",
    image: Budget1,
    imageAlt: "Budget Chart",
    imageClassName: "h-[120px] w-[250px]  rounded-lg md:h-[140px] md:w-[270px]",
  },
  {
    title: "Transactions",
    description:
      "Take full control of financial activities with powerful transaction management system",
    image: Transaction2,
    imageAlt: "Transaction Detail",
    imageClassName: "h-[140px] w-[220px]  rounded-lg",
  },
  {
    title: "Spending",
    description:
      "Gain valuable insights into your financial habits with spending analysis tools",
    image: Spending1,
    imageAlt: "Spending Chart",
    imageClassName: "h-[140px] w-[140px]  rounded-lg",
  },
];

export default function MobileFeatureCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ containScroll: false });

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className="init-fade relative mt-14 block lg:hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="carousel__container">
          {features.map((item) => (
            <div
              key={item.title}
              className="min-w-0 flex-none basis-[86%] pl-4"
            >
              <div className="mobile-feature flex h-[19rem] flex-col items-center justify-between rounded-3xl bg-teal-500 bg-opacity-20 bg-feature bg-no-repeat">
                <div className="z-10 px-8 pt-8 text-center text-secondary-foreground">
                  <h1 className="text-lg font-semibold tracking-wide">
                    {item.title}
                  </h1>
                  <p className="mt-2 text-sm font-normal">{item.description}</p>
                </div>
                <div className="z-10 pb-8">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    className={item.imageClassName}
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="min-w-0 flex-none basis-[86%] pl-4">
            <div className="mobile-feature flex h-[19rem] flex-col items-center justify-between rounded-3xl bg-teal-500 bg-opacity-20 bg-feature bg-no-repeat">
              <div className="z-10 px-8 pt-8 text-center text-secondary-foreground">
                <h1 className="text-lg font-semibold tracking-wide">
                  AI Assistant
                </h1>
                <p className="mt-2 text-sm font-normal">
                  Access personalized financial advice at your fingertips with
                  AI-powered assistant
                </p>
              </div>
              <div className="z-10 px-8 pb-8 md:px-40">
                <div className="flex flex-col gap-2 rounded-lg bg-white p-2">
                  <div className="flex gap-2">
                    <div className="mt-2">
                      <BotMessageSquare className="h-4 w-4" />
                    </div>
                    <div className="w-fit rounded-lg bg-gray-200 bg-opacity-80 p-2">
                      <p className="text-xs font-normal">
                        Hi! How can I assist you today with your financial data
                        or any finance-related questions?
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto rounded-lg bg-teal-600 bg-opacity-90 p-2 text-xs font-normal text-white">
                    What are my potential savings for this month?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid place-items-center">
        <div className="carousel__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`carousel__dot ${
                index === selectedIndex ? "carousel__dot--selected" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
