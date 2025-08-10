"use client";

import { StatsBox } from "@/components/stats";
import { statsData } from "@/data";

const StatsCurrent = () => {
  return (
    <div className="grid max-sm:grid-cols-1 max-md:grid-cols-2 grid-cols-4 border-y">
      {Object.entries(statsData).map(([title, data], i) => (
        <StatsBox key={i} title={title} stats={data} />
      ))}
    </div>
  );
};

export default StatsCurrent;
