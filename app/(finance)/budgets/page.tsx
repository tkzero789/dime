import React from "react";
import BudgetsContent from "./_components/BudgetsContent";

type Props = {
  searchParams: {
    startDate: string;
    endDate: string;
  };
};

export default function BudgetsPage({ searchParams }: Props) {
  return <BudgetsContent searchParams={searchParams} />;
}
