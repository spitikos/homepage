"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { motion } from "motion/react";
import { ComponentProps, memo, useState } from "react";

type Stat = {
  field: string;
  type?: "literal" | "gauge";
  value: string | number | bigint | undefined | null;
};

type StatsBoxProps = {
  title: string;
  stats: Stat[];
};

const StatsBox = memo(({ title, stats }: StatsBoxProps) => {
  const [highlightPos, setHighlightPos] = useState(-1);
  const [showHighlight, setShowHighlight] = useState(false);

  return (
    <div className="**:leading-none p-5 not-last:border-r *:w-full">
      <h3 className="font-normal mb-4">{title.toUpperCase()}</h3>

      <div className="relative">
        {/* HIGHLIGHTER*/}
        <motion.div
          animate={{
            y: highlightPos * 24,
            opacity: showHighlight ? 1 : 0,
          }}
          transition={{
            duration: 0.1,
            ease: "circOut",
          }}
          className="absolute bg-highlight -z-10 h-6 rounded w-[calc(100%+16px)] -left-2"
        />

        {/* TABLE */}
        <table className="text-sm w-full">
          <thead className="sr-only">
            <tr>
              <th className="text-left w-1/2">FIELD</th>
              <th className="text-right w-1/2">VALUE</th>
            </tr>
          </thead>
          <tbody className="[&_tr]:h-6">
            {stats.map((stat, i) => (
              <StatRow
                key={i}
                {...stat}
                onMouseEnter={() => {
                  setHighlightPos(i);
                  setShowHighlight(true);
                }}
                onMouseLeave={() => setShowHighlight(false)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
StatsBox.displayName = "StatsBox";

export default StatsBox;

const StatRow = memo(
  ({
    field,
    value,
    type = "literal",
    ...props
  }: Stat & ComponentProps<"tr">) => {
    const isGauge =
      type === "gauge" && typeof value === "number" && value >= 0 && value <= 1;

    return (
      <tr {...props} className="*:w-1/2 cursor-pointer">
        <td className="text-left text-secondary">{field.toUpperCase()}</td>
        <td className="text-right relative">
          {isGauge ? (
            <Gauge percent={value} />
          ) : (
            (value?.toString().toUpperCase() ?? (
              <IconLoader2
                size={14}
                className="text-secondary animate-spin absolute right-0 top-1/2 -translate-y-1/2"
              />
            ))
          )}
        </td>
      </tr>
    );
  },
);
StatRow.displayName = "StatRow";

const Gauge = ({ percent }: { percent: number }) => {
  return (
    <span className="h-1 bg-tertiary w-full block relative">
      <motion.span
        animate={{ scaleX: percent }}
        transition={{ duration: 0.3, ease: "circOut" }}
        className="h-1 bg-primary w-full origin-left block"
      />
    </span>
  );
};
