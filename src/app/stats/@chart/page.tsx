"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { StatsContext } from "@/contexts";
import { usePrometheus } from "@/hooks";
import { Stat } from "@/lib/prometheus/schema";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useContext } from "react";
import { Line, LineChart, YAxis } from "recharts";

dayjs.extend(relativeTime);

const StatsChart = () => {
  const { selectedStat } = useContext(StatsContext);

  return (
    <div className="py-5 w-full h-[50vh]">
      {selectedStat && <Chart stat={selectedStat} />}
    </div>
  );
};

export default StatsChart;

const Chart = ({ stat }: { stat: Stat }) => {
  const { range } = usePrometheus(stat);

  const { values } = range;

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
      <LineChart
        accessibilityLayer
        data={values}
        margin={{ top: 20, bottom: 20 }}
      >
        <ChartTooltip
          cursor={false}
          isAnimationActive={true}
          animationDuration={100}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-background/30 backdrop-blur-md border rounded-md p-2.5 w-32 space-y-1 overflow-hidden">
                  <p className="text-xs text-secondary">
                    {dayjs(data.time).fromNow().toUpperCase()}
                  </p>
                  <div className="text-xs inline-flex justify-between gap-2 w-full">
                    <span>{stat.field.toUpperCase()}</span>
                    <span className="truncate">
                      {(stat.refine && payload[0].value
                        ? stat.refine(payload[0].value as never)
                        : payload[0].value
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
          type="natural"
          stroke="var(--color-chart)"
          strokeWidth={1}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};
