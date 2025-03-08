type Props = {
  number: number;
  decimals?: number;
};

export default function FormatNumber({ number, decimals }: Props) {
  return (
    <>
      {new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(number)}
    </>
  );
}
