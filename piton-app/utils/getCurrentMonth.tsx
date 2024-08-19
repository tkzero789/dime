type Props = {
  month: Date;
};

export default function GetCurrentMonth({ month }: Props) {
  const getMonth = (date: Date) => {
    return date.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  };
  return month && getMonth(month);
}
