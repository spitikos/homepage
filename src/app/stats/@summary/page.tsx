"use client";

import { StatsBox } from "@/components/stats";
import { usePrometheus } from "@/hooks";
import { queries, transformData } from "./data";

export default function Stats() {
  const { data: hostData } = usePrometheus({ query: queries.hostQuery });
  const { data: cpuData } = usePrometheus({ query: queries.cpuQuery });
  const { data: memoryData } = usePrometheus({ query: queries.memoryQuery });
  const { data: diskData } = usePrometheus({ query: queries.diskQuery });
  const { data: networkData } = usePrometheus({ query: queries.networkQuery });
  const { data: temperatureData } = usePrometheus({
    query: queries.temperatureQuery,
  });

  const stats = transformData({
    hostData,
    cpuData,
    memoryData,
    diskData,
    temperatureData,
    networkData,
  });

  return (
    <div className="grid grid-cols-4 border-y">
      {stats.map((stat, i) => (
        <StatsBox key={i} {...stat} />
      ))}
    </div>
  );
}
