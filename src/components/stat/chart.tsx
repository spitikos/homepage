"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { usePrometheus } from "@/hooks";
import { type Value } from "@/lib/api/proto";
import { timestampDate } from "@bufbuild/protobuf/wkt";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { memo } from "react";
import { Line, LineChart, YAxis } from "recharts";
import { type Stat } from "./types";

dayjs.extend(relativeTime);

const StatChart = memo((stat: Stat) => {
  const { labels, values } = usePrometheus({ stat, queryType: "range" });

  if (!labels || !values) return null;

  const chartConfig = {
    chart: {
      label: stat.field.toUpperCase(),
      color: "var(--color-secondary)",
    },
  } satisfies ChartConfig;

  const yDomain =
    stat.displayType === "gauge"
      ? [0, 1]
      : [0, Math.max(...values.map((v) => v.value)) * 1.2];

  return (
    <ChartContainer config={chartConfig} className="size-full">
      <LineChart accessibilityLayer data={values}>
        <ChartTooltip
          cursor={false}
          isAnimationActive={true}
          animationDuration={100}
          content={({ active, payload }) => {
            if (active && payload?.length) {
              const data = payload[0]?.payload as Value;
              return (
                <div className="bg-background/30 backdrop-blur-md border rounded-md p-2.5 w-40 space-y-1 overflow-hidden">
                  <p className="text-xs text-secondary">
                    {dayjs(timestampDate(data.timestamp!))
                      .fromNow()
                      .toUpperCase()}
                  </p>
                  <div className="text-xs inline-flex justify-between gap-2 w-full">
                    <span>{stat.field.toUpperCase()}</span>
                    <span className="truncate">
                      {(stat.refine && payload[0]?.value
                        ? stat.refine(payload[0]?.value as never)
                        : payload[0]?.value
                      )
                        ?.toString()
                        .toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />

        <YAxis hide domain={yDomain} />

        <Line
          dataKey="value"
          name={stat.field.toUpperCase()}
          type="linear"
          animationEasing="ease-out"
          animationDuration={500}
          stroke="var(--color-chart)"
          strokeWidth={1}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
});
StatChart.displayName = "StatChart";

export default StatChart;
