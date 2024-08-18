type Props = {
  numDate?: Date;
  numMonthNumDate?: Date;
  shortMonthNumDate?: Date;
};

export default function FormatDate({
  numDate,
  numMonthNumDate,
  shortMonthNumDate,
}: Props) {
  if (numDate) {
    return numDate.toLocaleDateString("en-US", {
      day: "numeric",
      timeZone: "UTC",
    });
  } else if (numMonthNumDate) {
    return numMonthNumDate.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      timeZone: "UTC",
    });
  } else if (shortMonthNumDate) {
    return shortMonthNumDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  } else {
    return null;
  }
}
