import React from "react";

export default function BenefitSection() {
  const benefits = [
    {
      tag: "Manage",
      title: "Full Control",
      description: "Have complete ownership of your financial data.",
    },
    {
      tag: "Customize",
      title: "Flexible Budgeting",
      description: "Categorize your budget to match your spending habits.",
    },
    {
      tag: "Optimize",
      title: "Spend Smarter",
      description:
        "Gain insights into your spending patterns and make informed decisions.",
    },
    {
      tag: "Secure",
      title: "Simple Setup",
      description:
        "No need for complicated bank integrations. Get started quickly.",
    },
  ];

  return (
    <div className="mt-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-medium">
          Embrace the Power of{" "}
          <span className="bg-gradient-to-b from-blue-400 to-indigo-600 bg-clip-text text-transparent">
            Manual Budgeting
          </span>
        </h1>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="group col-span-2 flex flex-col gap-2 rounded-2xl bg-teal-500 bg-opacity-10 p-8 shadow-sm transition-all hover:bg-teal-500 lg:col-span-1"
          >
            <span className="w-fit rounded-lg bg-teal-600 bg-opacity-30 px-2 py-1 text-xs font-medium text-teal-700 group-hover:bg-yellow-400 group-hover:text-blue-700">
              {benefit.tag}
            </span>
            <h1 className="text-lg font-semibold text-medium group-hover:text-white">
              {benefit.title}
            </h1>
            <p className="text-base font-light text-medium group-hover:text-gray-100">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
