import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { AspectRatio } from "@/components/ui/aspect-ratio";

import {
  ArrowLeftRight,
  Banknote,
  BotMessageSquare,
  CircleDollarSign,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardTabs() {
  return (
    <section className="mx-auto mt-14 hidden w-full max-w-7xl items-center justify-center px-4 lg:flex">
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
        <TabsContent value="Dashboard" className="mt-0 w-full">
          <div className="flex h-[536px] w-full rounded-xl bg-teal-500 bg-opacity-20 p-12 pb-28 xl:pb-32">
            <div className="relative w-1/2">
              {[Dashboard1, Dashboard2].map((item, index) => (
                <Image
                  key={index}
                  src={item}
                  alt={`${index === 0 ? "Dashboard Chart" : "Financial Overview"}`}
                  className={`rounded-xl ${index === 0 ? "h-[160px] w-[380px] xl:h-[240px] xl:w-[540px]" : "absolute bottom-[120px] right-[40px] z-10 h-[120px] w-[240px] xl:bottom-0 xl:right-0 xl:h-[180px] xl:w-[380px]"}`}
                />
              ))}
            </div>
            <div className="mt-8 flex w-1/2 flex-col gap-8 pl-12">
              <h1 className="text-3xl font-bold text-medium">
                Comprehensive Financial Overview
              </h1>
              <p className="w-auto text-base text-medium xl:w-11/12">
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
          </div>
        </TabsContent>

        {/* Budgets */}
        <TabsContent value="Budgets" className="mt-0 w-full">
          <div className="flex h-[536px] w-full rounded-xl bg-teal-500 bg-opacity-20 p-12 pb-28 xl:pb-32">
            <div className="relative w-1/2">
              {[Budget1, Budget2].map((item, index) => (
                <Image
                  key={index}
                  src={item}
                  alt={`${index === 0 ? "Budget Chart" : "Budget Tracker"}`}
                  className={`rounded-xl ${index === 0 ? "h-[160px] w-[380px] xl:h-[220px] xl:w-[500px]" : "absolute bottom-[80px] right-[30px] z-10 h-[200px] w-[200px] xl:bottom-[-40px] xl:right-0 xl:h-[280px] xl:w-[280px]"}`}
                />
              ))}
            </div>
            <div className="mt-8 flex w-1/2 flex-col gap-8 pl-12">
              <h1 className="text-3xl font-bold text-medium">
                Flexible Multi-Budget Management
              </h1>
              <p className="w-auto text-base text-medium xl:w-11/12">
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
          </div>
        </TabsContent>

        {/* Transactions */}
        <TabsContent value="Transactions" className="mt-0 w-full">
          <div className="flex h-[536px] w-full rounded-xl bg-teal-500 bg-opacity-20 p-12 pb-28 xl:pb-32">
            <div className="relative w-1/2">
              {[Transaction1, Transaction2].map((item, index) => (
                <Image
                  key={index}
                  src={item}
                  alt={`${index === 0 ? "Transaction Table" : "Transaction Detail"}`}
                  className={`rounded-xl ${index === 0 ? "h-[340px] w-[400px] xl:h-[360px] xl:w-[500px]" : "absolute bottom-[-50px] right-0 z-10 h-[180px] w-[260px]"}`}
                />
              ))}
            </div>
            <div className="mt-8 flex w-1/2 flex-col gap-8 pl-12">
              <h1 className="text-3xl font-bold text-medium">
                Dynamic Transaction Tracking
              </h1>
              <p className="w-auto text-base text-medium xl:w-11/12">
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
          </div>
        </TabsContent>

        {/* Spending */}
        <TabsContent value="Spending" className="mt-0 w-full">
          <div className="flex h-[536px] w-full rounded-xl bg-teal-500 bg-opacity-20 p-12 pb-28 xl:pb-32">
            <div className="relative w-1/2">
              {[Spending1, Spending2].map((item, index) => (
                <Image
                  key={index}
                  src={item}
                  alt={`${index === 0 ? "Chart" : "Payment Method Chart"}`}
                  className={`rounded-xl ${index === 0 ? "h-[240px] w-[240px] xl:h-[280px] xl:w-[280px]" : "absolute bottom-[-10px] left-[200px] z-10 h-[240px] w-[240px] xl:bottom-[-60px] xl:left-[240px] xl:h-[280px] xl:w-[280px]"}`}
                />
              ))}
            </div>
            <div className="mt-8 flex w-1/2 flex-col gap-8 pl-12">
              <h1 className="text-3xl font-bold text-medium">
                Insightful Spending Analysis
              </h1>
              <p className="w-auto text-base text-medium xl:w-11/12">
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
          </div>
        </TabsContent>

        {/* Penny */}
        <TabsContent value="AI-Assistant" className="mt-0 w-full">
          <div className="flex h-[536px] w-full rounded-xl bg-teal-500 bg-opacity-20 p-12 pb-28 xl:pb-32">
            <div className="relative w-1/2">
              {[Penny1, Penny2].map((item, index) => (
                <Image
                  key={index}
                  src={item}
                  alt={`${index === 0 ? "User Chat" : "AI Response"}`}
                  className={`rounded-xl ${index === 0 ? "h-[240px] w-[420px] xl:h-[280px] xl:w-[480px]" : "absolute bottom-[95px] right-0 z-10 h-[40px] w-[380px] xl:bottom-[60px] xl:w-[420px]"}`}
                />
              ))}
            </div>
            <div className="mt-8 flex w-1/2 flex-col gap-8 pl-12">
              <h1 className="text-3xl font-bold text-medium">
                Penny - Intelligent Financial Guidance
              </h1>
              <p className="w-auto text-base text-medium xl:w-11/12">
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
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
