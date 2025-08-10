"use client";

import { usePrometheus } from "@/hooks";
import { Stat } from "@/lib/prometheus/schema";
import { IconLoader2 } from "@tabler/icons-react";
import { motion } from "motion/react";
import { ComponentProps, Suspense } from "react";

type StatRowProps = { stat: Stat } & ComponentProps<"tr">;

const StatRow = ({ stat, ...props }: StatRowProps) => {
  return (
    <tr {...props} className="*:w-1/2 cursor-pointer">
      <td className="text-left text-secondary">{stat.field.toUpperCase()}</td>
      <td className="text-right relative">
        <Suspense
          name="stat-value-suspense"
          fallback={
            <IconLoader2
              size={14}
              className="text-secondary animate-spin absolute right-0 top-1/2 -translate-y-1/2"
            />
          }
        >
          <Value {...stat} />
        </Suspense>
      </td>
    </tr>
  );
};

export default StatRow;

const Value = (stat: Stat) => {
  const { instant: data } = usePrometheus(stat);

  if (!data) return "-";

  const {
    labels,
    value: { value },
  } = data;

  let displayValue: string | number;
  switch (stat.type) {
    case "label":
      displayValue = stat.refine
        ? stat.refine(labels[stat.label])
        : (labels[stat.label] ?? "-");
      break;
    case "value":
      displayValue = stat.refine ? stat.refine(value) : value.toFixed(2);
      break;
  }

  return (
    <>
      {stat.displayType === "gauge" ? (
        <Gauge percent={value} />
      ) : (
        displayValue.toString().toUpperCase()
      )}
    </>
  );
};

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
