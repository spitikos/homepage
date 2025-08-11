"use client";

import { Highlight } from "@/components/highlight";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const ascii = [
  "-",
  "|",
  "!",
  ";",
  "~",
  ":",
  ";",
  "i",
  ">",
  "<",
  "r",
  "?",
  "[",
  "]",
  "{",
  "}",
  "1",
  ")",
  "(",
  "|",
  "/",
  "t",
  "f",
  "j",
  "d",
  "L",
  "C",
  "J",
  "U",
  "Y",
  "X",
  "Z",
  "O",
  "0",
  "Q",
  "W",
  "M",
  "M",
  "B",
  "8",
  "&",
  "%",
  "$",
  "#",
  "@",
];

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <main className="h-svh overflow-hidden">
      <div className="p-2 grid grid-cols-20">
        {Array.from({ length: 1000 }).map((_, i) => (
          <Highlight key={i}>
            <motion.div
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(-1)}
              className="aspect-square flex items-center cursor-default justify-center"
            >
              <AnimatePresence>
                {i === hoveredIndex && (
                  <motion.span
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                      transition: {
                        duration: 0,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      transition: {
                        duration: 2,
                      },
                    }}
                    className="text-secondary"
                  >
                    {ascii[Math.round(Math.random() * ascii.length)]}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Highlight>
        ))}
      </div>
    </main>
  );
}
