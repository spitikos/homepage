"use client";

import { StatsContext } from "@/contexts";
import { usePrometheus } from "@/hooks";
import { Stat } from "@/lib/prometheus";
import { IconLoader2 } from "@tabler/icons-react";
import { motion } from "motion/react";
import { ComponentProps, memo, useContext } from "react";

type StatRowProps = { stat: Stat } & Omit<ComponentProps<"tr">, "onClick">;

const StatRow = memo(({ stat, ...props }: StatRowProps) => {
  const { setSelectedStat } = useContext(StatsContext);
  return (
    <tr
      {...props}
      onClick={() => setSelectedStat(stat)}
      className="*:w-1/2 cursor-pointer"
    >
      <td className="text-left text-secondary">{stat.field.toUpperCase()}</td>
      <td className="text-right relative">
        <Value {...stat} />
      </td>
    </tr>
  );
});

StatRow.displayName = "StatRow";
export default StatRow;

const Value = memo((stat: Stat) => {
  const { labels, value } = usePrometheus({ stat, queryType: "instant" });
  if (!labels || !value)
    return (
      <IconLoader2 className="animate-spin text-secondary size-4 inline" />
    );

  let displayValue: string;

  switch (stat.type) {
    case "label":
      displayValue = stat.refine
        ? stat.refine(labels[stat.label])
        : (labels[stat.label] ?? "-");
      break;
    case "value":
      displayValue = stat.refine
        ? stat.refine(value).toString()
        : value.toFixed(2);
      break;
  }

  return (
    <span className="truncate">
      {stat.displayType === "gauge" ? (
        <Gauge percent={value} />
      ) : (
        displayValue.toString().toUpperCase()
      )}
    </span>
  );
});

const Gauge = ({ percent }: { percent: number }) => {
  if (percent < 0 || percent > 1)
    console.error("Invalid percent value:", percent);

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
