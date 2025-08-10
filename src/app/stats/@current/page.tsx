"use client";

import { StatsBox } from "@/components/stats";
import { statsData } from "@/data";

const Page = () => {
  return (
    <div className="grid max-sm:grid-cols-1 max-lg:grid-cols-2 grid-cols-4 border-b">
      {Object.entries(statsData).map(([title, data], i) => (
        <StatsBox key={i} title={title} stats={data} />
      ))}
    </div>
  );
};

export default Page;
