type Props = {
  createdAt: Date;
};

export default function GetCurrentMonth({ createdAt }: Props) {
  const getMonth = (date: Date) => {
    return date.toLocaleString("default", { month: "long" });
  };
  return createdAt && getMonth(createdAt);
}
