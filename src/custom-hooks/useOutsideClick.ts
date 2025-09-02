import React, { useCallback, useEffect } from "react";

type useOutsideClickProps = {
  elementRef: React.RefObject<HTMLElement | null>;
  handleOutsideClick: (e?: MouseEvent) => void;
};
const useOutsideClick = ({
  elementRef,
  handleOutsideClick,
}: useOutsideClickProps) => {
  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (
        elementRef.current &&
        e.button === 0 &&
        !elementRef.current.contains(e.currentTarget as Node)
      ) {
        handleOutsideClick(e);
      }
    },
    [handleOutsideClick, elementRef]
  );
  useEffect(() => {
    if (!elementRef.current || !handleClick) return;
    document.addEventListener("click", handleClick);
    return document.removeEventListener("click", handleClick);
  }, [handleOutsideClick, elementRef]);
};

export default useOutsideClick;
