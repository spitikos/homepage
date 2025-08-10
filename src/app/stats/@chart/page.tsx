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
import { Area, AreaChart } from "recharts";

dayjs.extend(relativeTime);

const StatsChart = () => {
  const { selectedStat } = useContext(StatsContext);

  return (
    <div className="">{selectedStat && <Chart stat={selectedStat} />}</div>
  );
};

export default StatsChart;

const Chart = ({ stat }: { stat: Stat }) => {
  const { range } = usePrometheus(stat);

  const { values } = range;

  const chartConfig = {
    chart: {
      label: stat.field.toUpperCase(),
      color: "var(--color-primary)",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="w-full">
      <AreaChart accessibilityLayer data={values}>
        {/*<CartesianGrid
          vertical={false}
          syncWithTicks={true}
          stroke="var(--color-tertiary)"
        />*/}
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
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-tertiary)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-tertiary)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          name={stat.field.toUpperCase()}
          type="natural"
          stroke="var(--color-chart)"
          fill="url(#gradient)"
          strokeWidth={1}
          stackId={1}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  );
};
