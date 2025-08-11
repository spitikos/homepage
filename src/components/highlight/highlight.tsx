"use client";

import { HighlightContext } from "@/contexts";
import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useContext,
  useRef,
} from "react";

type HighlightProps = {
  padding?: { x?: number; y?: number };
  children: ReactNode;
};

const Highlight = ({ children, padding }: HighlightProps) => {
  const { setElement, setPadding } = useContext(HighlightContext);
  const ref = useRef<HTMLElement>(null);
  const child = Children.only(children);

  if (!isValidElement(child)) return children;

  return cloneElement(child, {
    // @ts-expect-error
    ref,
    onMouseEnter: () => {
      setElement(ref);
      setPadding({ x: 0, y: 0, ...padding });
    },
    onMouseLeave: () => setElement(null),
  });
};

export default Highlight;
