import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Container from "@/components/ui/container";

export default function QASection() {
  return (
    <section className="mt-40">
      <Container>
        <div className="flex flex-col gap-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-secondary-foreground">
              Got a{" "}
              <span className="bg-gradient-to-b from-orange-400 to-amber-600 bg-clip-text text-transparent">
                Question?
              </span>{" "}
              <span className="block md:inline-block">Look here</span>
            </h1>
          </div>
          <div className="flex justify-center">
            <Accordion
              type="single"
              collapsible
              className="rounded-xl bg-transparent md:w-[40rem] lg:w-[52rem]"
            >
              <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="text-start">
                  What features does your budgeting website offer?
                </AccordionTrigger>
                <AccordionContent className="text-base text-secondary-foreground">
                  Our website provides tools for tracking income and expenses,
                  setting budgets, analyzing spending habits, and saving for
                  goals.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-start">
                  Is my data safe from unauthorized access?
                </AccordionTrigger>
                <AccordionContent className="text-base text-secondary-foreground">
                  Yes, your data is treated with the utmost confidentiality. We
                  do not share your information with third parties without your
                  consent.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-start">
                  What are the different pricing plans for your budgeting
                  website?
                </AccordionTrigger>
                <AccordionContent className="text-base text-secondary-foreground">
                  <div className="font-semibold">
                    We offer two pricing plans:
                  </div>
                  <ul>
                    <li className="mt-2">
                      <span className="font-bold">Basic:</span> This plan is
                      completely free and includes essential features like
                      tracking income and expenses, setting budgets, and
                      analyzing spending habits.
                    </li>
                    <li className="mt-2">
                      <span className="font-bold">Pro:</span> The Pro plan,
                      priced at $2.99 per month, provides all the features of
                      the Basic plan, plus advanced AI-powered features such as
                      personalized budgeting recommendations, predictive
                      spending analysis, and automated goal setting.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-b-0">
                <AccordionTrigger className="text-start">
                  How can I contact customer support if I encounter issues?
                </AccordionTrigger>
                <AccordionContent className="text-base text-secondary-foreground">
                  You can contact our support team via dimesupport@gmail.com
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </Container>
    </section>
  );
}
