import { useRef } from "react";
const useDebounce = (
  callbackFn: (...args: any) => void,
  delay: number = 1000
) => {
  const timerRef = useRef<number | undefined>(undefined);
  return (...args: any) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      callbackFn(...args);
      return () => {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      };
    }, delay);
  };
};

export default useDebounce;
