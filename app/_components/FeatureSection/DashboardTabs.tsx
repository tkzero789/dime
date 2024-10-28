"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dashboard1 from "@/public/img/dashboard1.png";
import Dashboard2 from "@/public/img/dashboard2.png";
import Budget1 from "@/public/img/budget1.png";
import Budget2 from "@/public/img/budget2.png";
import Transaction1 from "@/public/img/transaction1.png";
import Transaction2 from "@/public/img/transaction2.png";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Banknote,
  BotMessageSquare,
  CircleDollarSign,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SpendingExpense } from "./chart/SpendingExpense";
import { SpendingMethod } from "./chart/SpendingMethod";

// Zoom Out
const zoomOutAnimationVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.1,
    },
  },
};

// Fade
const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.1,
      delay: 0.1,
    },
  },
};

// Slide in (index)
const slideInAnimationVariants = {
  initial: (index: number) => ({
    x: index === 0 ? 50 : -50,
  }),
  animate: {
    x: 0,
    transition: {
      duration: 0.4,
      delay: 0.2,
    },
  },
};

// Slide to left
const slideLeftAnimationVariants = {
  initial: {
    x: 50,
  },
  animate: {
    x: 0,
    transition: {
      duration: 0.4,
      delay: 0.2,
    },
  },
};

// Slide to right
const slideRightAnimationVariants = {
  initial: {
    x: -50,
  },
  animate: {
    x: 0,
    transition: {
      duration: 0.4,
      delay: 0.2,
    },
  },
};

export default function DashboardTabs() {
  return (
    <motion.section
      variants={zoomOutAnimationVariants}
      initial="initial"
      whileInView="animate"
      viewport={{
        once: true,
      }}
      className="mx-auto mt-14 hidden w-full max-w-7xl items-center justify-center px-4 lg:flex"
    >
      <Tabs defaultValue="Dashboard" className="w-full">
        <TabsList className="h-auto w-full bg-transparent pb-0">
          <TabsTrigger
            value="Dashboard"
            className="flex w-40 items-center gap-2 rounded-b-none rounded-t-xl py-2"
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-semibold font-medium">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger
            value="Budgets"
            className="flex w-40 items-center gap-2 rounded-b-none rounded-t-xl py-2"
          >
            <Banknote className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-semibold font-medium">Budgets</span>
          </TabsTrigger>
          <TabsTrigger
            value="Transactions"
            className="flex w-40 items-center gap-2 rounded-b-none rounded-t-xl py-2"
          >
            <ArrowLeftRight className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-semibold font-medium">Transactions</span>
          </TabsTrigger>
          <TabsTrigger
            value="Spending"
            className="flex w-40 items-center gap-2 rounded-b-none rounded-t-xl py-2"
          >
            <CircleDollarSign className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-semibold font-medium">Spending</span>
          </TabsTrigger>
          <TabsTrigger
            value="AI-Assistant"
            className="flex w-40 items-center gap-2 rounded-b-none rounded-t-xl py-2"
          >
            <BotMessageSquare className="h-5 w-5" strokeWidth={1.5} />
            <span className="text-semibold font-medium">AI Assistant</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent
          value="Dashboard"
          className="feature-tab relative mt-0 w-full"
        >
          <motion.div
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            className="bg-feature flex h-[420px] w-full rounded-xl bg-teal-500 bg-opacity-20 bg-[right_bottom_4rem] bg-no-repeat p-12 xl:h-[480px]"
          >
            <div className="relative z-10 w-1/2">
              {[Dashboard1, Dashboard2].map((item, index) => (
                <motion.div
                  key={index}
                  variants={slideInAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{
                    once: true,
                  }}
                  custom={index}
                  className={`rounded-xl ${index === 0 ? "h-[160px] w-[380px] xl:h-[240px] xl:w-[540px]" : "absolute bottom-[120px] right-[40px] z-10 h-[120px] w-[240px] xl:bottom-[80px] xl:right-0 xl:h-[180px] xl:w-[380px]"}`}
                >
                  <Image
                    src={item}
                    alt={`${index === 0 ? "Dashboard Chart" : "Financial Overview"}`}
                    className="h-full w-full rounded-xl"
                  />
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex w-1/2 flex-col gap-8 pl-12">
              <h1 className="text-3xl font-bold text-medium">
                Comprehensive Financial Overview
              </h1>
              <p className="w-auto text-base tracking-wide text-medium xl:w-11/12">
                The dashboard provides quick insights to help you manage and
                adjust your financial plans easily. View your budgets, income,
                expenses, and savings progress at a glance to stay on track with
                your goals.
              </p>
              <Button
                asChild
                variant="outline"
                className="w-fit bg-transparent hover:bg-gray-800 hover:text-white"
              >
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Budgets */}
        <TabsContent
          value="Budgets"
          className="feature-tab relative mt-0 w-full"
        >
          <motion.div
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            className="bg-feature flex h-[420px] w-full rounded-xl bg-teal-500 bg-opacity-20 bg-[right_bottom_4rem] bg-no-repeat p-12 xl:h-[480px]"
          >
            <div className="relative z-10 w-1/2">
              {[Budget1, Budget2].map((item, index) => (
                <motion.div
                  key={index}
                  variants={slideInAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{
                    once: true,
                  }}
                  custom={index}
                  className={`rounded-xl ${index === 0 ? "h-[160px] w-[380px] xl:h-[220px] xl:w-[500px]" : "absolute bottom-[80px] right-[30px] z-10 h-[200px] w-[200px] xl:bottom-[40px] xl:right-0 xl:h-[320px] xl:w-[300px]"}`}
                >
                  <Image
                    src={item}
                    alt={`${index === 0 ? "Budget Chart" : "Budget Tracker"}`}
                    className="h-full w-full rounded-xl"
                  />
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex w-1/2 flex-col gap-8 pl-12">
              <h1 className="text-3xl font-bold text-medium">
                Flexible Multi-Budget Management
              </h1>
              <p className="w-auto text-base tracking-wide text-medium xl:w-11/12">
                Create and manage multiple budgets tailored to your unique
                financial needs. Customize categories for each budget, allowing
                you to track spending across various aspects of your life, from
                daily expenses to long-term projects.
              </p>
              <Button
                asChild
                variant="outline"
                className="w-fit bg-transparent hover:bg-gray-800 hover:text-white"
              >
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Transactions */}
        <TabsContent
          value="Transactions"
          className="feature-tab relative mt-0 w-full"
        >
          <motion.div
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            className="bg-feature flex h-[420px] w-full rounded-xl bg-teal-500 bg-opacity-20 bg-[right_bottom_4rem] bg-no-repeat p-12 xl:h-[480px]"
          >
            <div className="relative z-10 w-1/2">
              {[Transaction1, Transaction2].map((item, index) => (
                <motion.div
                  key={index}
                  variants={slideInAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{
                    once: true,
                  }}
                  custom={index}
                  className={`rounded-xl ${index === 0 ? "h-[160px] w-[340px] xl:h-[260px] xl:w-[500px]" : "absolute bottom-[100px] right-0 z-10 h-[150px] w-[250px] xl:bottom-[40px] xl:h-[200px] xl:w-[300px]"}`}
                >
                  <Image
                    src={item}
                    alt={`${index === 0 ? "Transaction Table" : "Transaction Detail"}`}
                    className="h-full w-full rounded-xl"
                  />
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex w-1/2 flex-col gap-8 pl-12">
              <h1 className="text-3xl font-bold text-medium">
                Dynamic Transaction Tracking
              </h1>
              <p className="w-auto text-base tracking-wide text-medium xl:w-11/12">
                Take full control of your financial activities with our powerful
                transaction management system. Easily view, add, edit, and
                search your transactions, with advanced sorting and filtering
                options at your fingertips.
              </p>
              <Button
                asChild
                variant="outline"
                className="w-fit bg-transparent hover:bg-gray-800 hover:text-white"
              >
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Spending */}
        <TabsContent
          value="Spending"
          className="feature-tab relative mt-0 w-full"
        >
          <motion.div
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            className="bg-feature flex h-[420px] w-full rounded-xl bg-teal-500 bg-opacity-20 bg-[right_bottom_4rem] bg-no-repeat p-12 xl:h-[480px]"
          >
            <div className="relative z-10 w-1/2">
              <SpendingExpense />
              <SpendingMethod />
            </div>
            <div className="mt-8 flex w-1/2 flex-col gap-8 pl-12">
              <h1 className="text-3xl font-bold text-medium">
                Insightful Spending Analysis
              </h1>
              <p className="w-auto text-base tracking-wide text-medium xl:w-11/12">
                Gain valuable insights into your financial habits with our
                comprehensive spending analysis tools. Visualize your spending
                patterns in relation to your income, and dive deep into detailed
                breakdowns of where your money goes.
              </p>
              <Button
                asChild
                variant="outline"
                className="w-fit bg-transparent hover:bg-gray-800 hover:text-white"
              >
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        {/* Penny */}
        <TabsContent
          value="AI-Assistant"
          className="feature-tab relative mt-0 w-full"
        >
          <motion.div
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            className="bg-feature flex h-[420px] w-full rounded-xl bg-teal-500 bg-opacity-20 bg-[right_bottom_4rem] bg-no-repeat p-12 xl:h-[480px]"
          >
            <div className="z-10 w-1/2">
              <div className="flex select-none flex-col gap-2 rounded-xl bg-white p-4 xl:gap-6">
                <motion.div
                  variants={slideLeftAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{
                    once: true,
                  }}
                  className="flex gap-2 rounded-xl"
                >
                  <div className="mt-2">
                    <BotMessageSquare className="h-5 w-5 xl:h-6 xl:w-6" />
                  </div>
                  <div className="w-fit rounded-xl bg-gray-200 bg-opacity-80 px-4 py-2">
                    <p className="text-sm xl:text-base">
                      Hi! How can I assist you today with your financial data or
                      any finance-related questions?
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  variants={slideRightAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{
                    once: true,
                  }}
                  className="ml-auto rounded-xl bg-teal-600 bg-opacity-90 px-4 py-2 text-sm text-white xl:text-base"
                >
                  What are my potential savings for this month?
                </motion.div>
                <motion.div
                  variants={slideLeftAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{
                    once: true,
                  }}
                  className="flex gap-2 rounded-xl"
                >
                  <div className="mt-2">
                    <BotMessageSquare className="h-5 w-5 xl:h-6 xl:w-6" />
                  </div>
                  <div className="w-fit rounded-xl bg-gray-200 bg-opacity-80 px-4 py-2">
                    <p className="text-sm xl:text-base">
                      To calculate your potential savings for October 2024, we
                      start with your total income and subtract your expenses,
                      including budgeted, single, and recurring payments.
                    </p>
                    <p className="mt-2 text-sm font-semibold xl:text-base">
                      Total Expenses = $700.13 (Budgeted) + $752.57 (Single) +
                      $2,383.49 (Recurring) = $3,836.19
                    </p>
                    <p className="mt-2 text-sm font-semibold xl:text-base">
                      Potential Savings for October 2024 = Total Income - Total
                      Expenses = $4,500.00 - $3,836.19 = $663.81
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
            <div className="mt-8 flex w-1/2 flex-col gap-8 pl-12">
              <h1 className="text-3xl font-bold text-medium">
                Penny - Intelligent Financial Guidance
              </h1>
              <p className="w-auto text-base tracking-wide text-medium xl:w-11/12">
                Access personalized financial advice at your fingertips with our
                AI-powered assistant. Ask questions about your finances, receive
                tailored suggestions, and get proactive tips to enhance your
                spending habits.
              </p>
              <Button
                asChild
                variant="outline"
                className="w-fit bg-transparent hover:bg-gray-800 hover:text-white"
              >
                <Link href="/">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.section>
  );
}
