import { useMediaQuery } from "usehooks-ts";

export function useDesktop() {
  const isDesktop = useMediaQuery("(min-width: 1024px)", {
    initializeWithValue: false,
  });

  return isDesktop;
}
