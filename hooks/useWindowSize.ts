import React from "react";

type WindowSize = {
  width: number | undefined;
  height: number | undefined;
};

export default function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
