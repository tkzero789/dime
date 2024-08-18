type Props = {
  number: number;
};

export default function FormatNumber({ number }: Props) {
  return number.toLocaleString();
}
