"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

type Element = RefObject<HTMLElement | null>;
type Padding = { x: number; y: number };

type HighlightContextType = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  element: Element | null;
  setElement: Dispatch<SetStateAction<Element | null>>;
  padding: Padding;
  setPadding: Dispatch<SetStateAction<Padding>>;
};

export const HighlightContext = createContext<HighlightContextType>({
  show: false,
  setShow: () => {
    /* */
  },
  element: null,
  setElement: () => {
    /* */
  },
  padding: { x: 0, y: 0 },
  setPadding: () => {
    /* */
  },
});

type HighlightProviderProps = {
  children: ReactNode;
};

export const HighlightProvider = ({ children }: HighlightProviderProps) => {
  const path = usePathname();
  const [show, setShow] = useState(false);
  const [element, setElement] = useState<Element | null>(null);
  const [padding, setPadding] = useState<Padding>({ x: 0, y: 0 });
  const [config, setConfig] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout;

    if (element?.current) {
      setShow(true);
      const rect = element.current.getBoundingClientRect();
      setConfig({
        x: rect.x - padding.x,
        y: rect.y - padding.y,
        width: rect.width + padding.x * 2,
        height: rect.height + padding.y * 2,
      });
    } else {
      hideTimeout = setTimeout(() => {
        setShow(false);
      }, 100);
    }

    return () => {
      clearTimeout(hideTimeout);
    };
  }, [element, padding.x, padding.y]);

  useEffect(() => {
    setElement(null);
    setShow(false);
  }, [path]);

  return (
    <HighlightContext.Provider
      value={{ show, setShow, element, setElement, padding, setPadding }}
    >
      <motion.div
        animate={{
          x: config.x,
          y: config.y,
          width: config.width,
          height: config.height,
          opacity: show ? 1 : 0,
        }}
        transition={{
          duration: 0.1,
          ease: "circOut",
        }}
        className="absolute bg-highlight -z-10 rounded-sm"
      />
      {children}
    </HighlightContext.Provider>
  );
};
