type Props = {
  number: number;
  decimals?: number;
  negative?: boolean;
};

export default function FormatNumber({
  number,
  decimals,
  negative = true,
}: Props) {
  const displayValue = !negative && number < 0 ? Math.abs(number) : number;
  return (
    <>
      {new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(displayValue)}
    </>
  );
}
