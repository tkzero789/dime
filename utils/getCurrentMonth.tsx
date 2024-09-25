type Props = {
  month?: Date;
  monthYear?: Date;
};

export default function GetCurrentMonth({ month, monthYear }: Props) {
  if (month) {
    return month.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  } else if (monthYear) {
    return monthYear.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  } else {
    return null;
  }
}
