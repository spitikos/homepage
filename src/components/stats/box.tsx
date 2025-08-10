"use client";

import { StatsContext } from "@/contexts";
import { Stat } from "@/lib/prometheus/schema";
import { motion } from "motion/react";
import { memo, useContext, useState } from "react";
import StatRow from "./row";

type StatsBoxProps = {
  title: string;
  stats: Stat[];
};

const StatsBox = memo(({ title, stats }: StatsBoxProps) => {
  const [highlightPos, setHighlightPos] = useState(-1);
  const [showHighlight, setShowHighlight] = useState(false);
  const { setSelectedStat } = useContext(StatsContext);

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
                stat={stat}
                onMouseEnter={() => {
                  setHighlightPos(i);
                  setShowHighlight(true);
                }}
                onClick={() => setSelectedStat(stat)}
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
