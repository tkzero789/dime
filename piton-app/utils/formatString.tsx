import React from "react";

type Props = {
  text: string;
};

export default function FormatString({ text }: Props) {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
