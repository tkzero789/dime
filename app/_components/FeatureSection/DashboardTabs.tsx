import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabImg from "@/public/dashboard.webp";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardTabs() {
  const contents = [
    {
      img: TabImg,
      value: "Dashboard",
      title: "Comprehensive Financial Overview",
      description:
        "The dashboard provides quick insights to help you manage and adjust your financial plans easily. View your budgets, income, expenses, and savings progress at a glance to stay on track with your goals.",
    },
    {
      img: TabImg,
      value: "Budgets",
      title: "Flexible Multi-Budget Management",
      description:
        "Create and manage multiple budgets tailored to your unique financial needs. Customize categories for each budget, allowing you to track spending across various aspects of your life, from daily expenses to long-term projects.",
    },
    {
      img: TabImg,
      value: "Transactions",
      title: "Dynamic Transaction Tracking",
      description:
        "Take full control of your financial activities with our powerful transaction management system. Easily view, add, edit, and search your transactions, with advanced sorting and filtering options at your fingertips.",
    },
    {
      img: TabImg,
      value: "Spending",
      title: "Insightful Spending Analysis",
      description:
        "Gain valuable insights into your financial habits with our comprehensive spending analysis tools. Visualize your spending patterns in relation to your income, and dive deep into detailed breakdowns of where your money goes.",
    },
    {
      img: TabImg,
      value: "AI-Assistant",
      title: "Penny - Intelligent Financial Guidance",
      description:
        "Access personalized financial advice at your fingertips with our AI-powered assistant. Ask questions about your finances, receive tailored suggestions, and get proactive tips to enhance your spending habits.",
    },
  ];

  return (
    <section className="mt-14 hidden items-center justify-center lg:flex">
      <Tabs defaultValue="Dashboard" className="w-full">
        <TabsList className="h-auto w-full bg-transparent pb-0">
          {contents.map((content) => (
            <TabsTrigger
              value={content.value}
              className="w-32 rounded-b-none rounded-t-xl"
            >
              {content.value}
            </TabsTrigger>
          ))}
        </TabsList>
        {contents.map((content) => (
          <TabsContent value={content.value} className="mt-0 w-full">
            <div className="flex w-full rounded-xl bg-teal-500 bg-opacity-20 p-12">
              <div className="h-96 w-1/2">
                <Image
                  src={content.img}
                  alt={content.title}
                  className="h-full w-full rounded-xl"
                />
              </div>
              <div className="mt-8 flex w-1/2 flex-col gap-8 pl-12">
                <h1 className="text-3xl font-bold text-medium">
                  {content.title}
                </h1>
                <p className="w-auto text-base text-medium xl:w-11/12">
                  {content.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-fit bg-transparent"
                >
                  <Link href="/">Learn More</Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
