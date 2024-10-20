"use client";

import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./MobileCarouselButton";
import useEmblaCarousel from "embla-carousel-react";
import Dashboard1 from "@/public/img/dashboard1.png";
import Dashboard2 from "@/public/img/dashboard2.png";
import Budget1 from "@/public/img/budget1.jpg";
import Budget2 from "@/public/img/budget2.jpg";
import Transaction1 from "@/public/img/transaction1.jpg";
import Transaction2 from "@/public/img/transaction2.jpg";
import Spending1 from "@/public/img/spending1.jpg";
import Spending2 from "@/public/img/spending2.jpg";
import Penny1 from "@/public/img/penny1.jpg";
import Penny2 from "@/public/img/penny2.jpg";
import Image from "next/image";

type PropType = {
  options?: EmblaOptionsType;
};

const MobileCarousel: React.FC<PropType> = (props) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className="embla mt-14 block lg:hidden">
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
              <div className="pb-8">
                <Image
                  src={Penny1}
                  alt="Dashboard chart"
                  className="h-[14 0px] w-[260px] rounded-xl"
                />
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
