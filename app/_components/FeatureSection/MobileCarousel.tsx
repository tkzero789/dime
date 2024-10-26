"use client";

import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./MobileCarouselButton";
import useEmblaCarousel from "embla-carousel-react";
import Dashboard2 from "@/public/img/dashboard2.png";
import Budget1 from "@/public/img/budget1.png";
import Transaction2 from "@/public/img/transaction2.png";
import Spending1 from "@/public/img/spending1.png";
import Image from "next/image";
import { BotMessageSquare } from "lucide-react";

type PropType = {
  options?: EmblaOptionsType;
};

const MobileCarousel: React.FC<PropType> = (props) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className="embla init-fade mt-14 block lg:hidden">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          <div className="embla__slide">
            <div className="embla__slide__number border bg-gradient-to-t from-emerald-400 to-emerald-500">
              <div className="px-8 pt-8 text-center text-white">
                <h1 className="text-lg font-semibold tracking-wide">
                  Dashboard
                </h1>
                <p className="mt-2 text-sm font-normal">
                  View your budgets, income, expenses to stay on track with your
                  goals
                </p>
              </div>
              <div className="pb-8">
                <Image
                  src={Dashboard2}
                  alt="Dashboard Chart"
                  className="h-[120px] w-[250px] rounded-xl"
                />
              </div>
            </div>
          </div>
          <div className="embla__slide">
            <div className="embla__slide__number border bg-gradient-to-t from-emerald-400 to-emerald-500">
              <div className="px-8 pt-8 text-center text-white">
                <h1 className="text-lg font-semibold tracking-wide">Budgets</h1>
                <p className="mt-2 text-sm font-normal">
                  Create and manage multiple budgets tailored to your unique
                  financial needs
                </p>
              </div>
              <div className="pb-8">
                <Image
                  src={Budget1}
                  alt="Budget Chart"
                  className="h-[120px] w-[250px] rounded-xl"
                />
              </div>
            </div>
          </div>
          <div className="embla__slide">
            <div className="embla__slide__number border bg-gradient-to-t from-emerald-400 to-emerald-500">
              <div className="px-8 pt-8 text-center text-white">
                <h1 className="text-lg font-semibold tracking-wide">
                  Transactions
                </h1>
                <p className="mt-2 text-sm font-normal">
                  Take full control of financial activities with powerful
                  transaction management system
                </p>
              </div>
              <div className="pb-8">
                <Image
                  src={Transaction2}
                  alt="Transaction Detail"
                  className="h-[140px] w-[220px] rounded-xl"
                />
              </div>
            </div>
          </div>
          <div className="embla__slide">
            <div className="embla__slide__number border bg-gradient-to-t from-emerald-400 to-emerald-500">
              <div className="px-8 pt-8 text-center text-white">
                <h1 className="text-lg font-semibold tracking-wide">
                  Spending
                </h1>
                <p className="mt-2 text-sm font-normal">
                  Gain valuable insights into your financial habits with
                  spending analysis tools
                </p>
              </div>
              <div className="pb-8">
                <Image
                  src={Spending1}
                  alt="Spending Chart"
                  className="h-[140px] w-[140px] rounded-xl"
                />
              </div>
            </div>
          </div>
          <div className="embla__slide">
            <div className="embla__slide__number border bg-gradient-to-t from-emerald-400 to-emerald-500">
              <div className="px-8 pt-8 text-center text-white">
                <h1 className="text-lg font-semibold tracking-wide">
                  AI Assistant
                </h1>
                <p className="mt-2 text-sm font-normal">
                  Access personalized financial advice at your fingertips with
                  AI-powered assistant
                </p>
              </div>
              <div className="px-8 pb-8 md:px-40">
                <div className="flex flex-col gap-2 rounded-xl bg-white p-2">
                  <div className="flex gap-2">
                    <div className="mt-2">
                      <BotMessageSquare className="h-4 w-4" />
                    </div>
                    <div className="w-fit rounded-xl bg-gray-200 bg-opacity-80 p-2">
                      <p className="text-xs font-normal">
                        Hi! How can I assist you today with your financial data
                        or any finance-related questions?
                      </p>
                    </div>
                  </div>
                  <div className="ml-auto rounded-xl bg-teal-600 bg-opacity-90 p-2 text-xs font-normal text-white">
                    What are my potential savings for this month?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`embla__dot ${
                index === selectedIndex ? "embla__dot--selected" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileCarousel;
