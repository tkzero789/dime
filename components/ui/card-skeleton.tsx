import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

type Props = {
  title?: boolean;
  titleWidth?: number;
  rectangle: number;
  height: number;
  style?: string;
};

export function CardSkeleton({
  title = false,
  titleWidth,
  rectangle,
  height,
  style,
}: Props) {
  const customeTitleWidth = titleWidth;
  const customStyle = style;
  return (
    <div className={cn("rounded-lg bg-background p-4", customStyle)}>
      {title && (
        <Skeleton
          className="mb-4 h-7 w-full bg-muted"
          style={{ width: `${customeTitleWidth}%` }}
        />
      )}
      <div className="flex flex-col gap-4">
        {Array.from({ length: rectangle }).map((_, index) => (
          <Skeleton
            key={index}
            className="w-full bg-muted"
            style={{ height: `${height}rem` }}
          />
        ))}
      </div>
    </div>
  );
}
