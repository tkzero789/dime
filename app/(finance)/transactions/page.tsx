import TransactionsContent from "./_components/TransactionsContent";

type Props = {
  searchParams: {
    startDate: string;
    endDate: string;
  };
};

export default function TransactionsPage({ searchParams }: Props) {
  return <TransactionsContent searchParams={searchParams} />;
}
