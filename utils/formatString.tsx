type Props = {
  text: string;
  split?: string;
};

export default function FormatString({ text, split = " " }: Props) {
  return text
    ?.split(split)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
