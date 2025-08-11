"use client";

import { motion } from "motion/react";
import { useState } from "react";

const AsciiGrid = () => {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <div className="p-2 grid grid-cols-20">
      {Array.from({ length: 1000 }).map((_, i) => (
        <motion.div
          key={i}
          onHoverStart={() => setHoveredIndex(i)}
          onHoverEnd={() => setHoveredIndex(-1)}
          className="aspect-square flex items-center cursor-default justify-center"
        >
          <motion.span
            animate={
              i === hoveredIndex
                ? {
                    opacity: 1,
                    transition: {
                      duration: 0,
                    },
                  }
                : {
                    opacity: 0.1,
                    transition: {
                      duration: 1,
                    },
                  }
            }
            className="opacity-0 text-primary"
          >
            {ascii[Math.round(Math.random() * ascii.length)]}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};

export default AsciiGrid;

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
