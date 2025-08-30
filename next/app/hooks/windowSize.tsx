import { useEffect, useState } from "react";

function getWindowDimensions() {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions(delay = 200) {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    // Using debouncing with timeout
    // to only have one event at the end of a resize.
    let timeoutId: NodeJS.Timeout | undefined = undefined;

    const handleResize = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        setWindowDimensions(getWindowDimensions());
      }, delay);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowDimensions;
}
