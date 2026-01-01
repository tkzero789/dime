"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import BudgetImg from "@/public/img/budget2.png";
import SpendingImg1 from "@/public/img/spending1.png";
import SpendingImg2 from "@/public/img/spending2.png";
import { motion } from "framer-motion";
import Container from "@/components/ui/container";

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.4,
    },
  },
};

export default function CallToActionSection() {
  return (
    <motion.div
      variants={fadeInAnimationVariants}
      initial="initial"
      whileInView="animate"
      viewport={{
        once: true,
      }}
      className="mt-40"
    >
      <Container>
        <div className="flex flex-col-reverse items-center justify-center gap-4 rounded-3xl bg-gradient-to-tr from-orange-200 to-amber-300 px-10 py-10 md:flex-row md:justify-between xl:px-32">
          <div className="flex w-full flex-col gap-8 md:w-1/2">
            <h1 className="pr-0 text-center text-2xl font-bold text-secondary-foreground md:pr-8 md:text-start lg:text-3xl">
              Save More, Spend Less, and Live Better
            </h1>
            <Button
              asChild
              className="mx-auto w-fit rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 text-base hover:to-emerald-600 md:mx-0"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
          <div className="flex w-full justify-center md:w-1/2">
            <div className="h-[220px] w-[300px] overflow-hidden object-cover md:h-[230px] md:w-[320px] lg:h-[280px] lg:w-[448px] xl:h-[400px] xl:w-[440px]">
              <div className="relative flex h-full w-full items-center justify-center">
                <Image
                  src={BudgetImg}
                  alt="budget chart"
                  className="z-10 h-[140px] w-[140px] skew-y-6 rounded-lg lg:h-[160px] lg:w-[160px] xl:h-[200px] xl:w-[200px]"
                />

                <Image
                  src={SpendingImg1}
                  alt="expense chart"
                  className="absolute bottom-[20px] left-[10px] z-20 h-[140px] w-[140px] skew-y-6 rounded-lg md:left-[20px] lg:bottom-[40px] lg:left-[60px] lg:h-[160px] lg:w-[160px] xl:bottom-[60px] xl:left-[20px] xl:h-[200px] xl:w-[200px]"
                />

                <Image
                  src={SpendingImg2}
                  alt="payment method chart"
                  className="absolute right-[10px] top-[20px] z-0 h-[140px] w-[140px] skew-y-6 rounded-lg md:right-[20px] lg:right-[60px] lg:top-[40px] lg:h-[160px] lg:w-[160px] xl:right-[20px] xl:top-[60px] xl:h-[200px] xl:w-[200px]"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
