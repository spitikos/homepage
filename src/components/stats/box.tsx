"use client";

import { Highlight } from "@/components/highlight";
import { type Stat } from "@/lib/prometheus";
import { memo } from "react";
import StatRow from "./row";

type StatsBoxProps = {
  title: string;
  stats: Stat[];
};

const StatsBox = memo(({ title, stats }: StatsBoxProps) => {
  return (
    <div className="**:leading-none p-5 not-last:border-r *:w-full overflow-hidden">
      <h3 className="font-normal mb-4">{title.toUpperCase()}</h3>

      <table className="text-sm w-full">
        <thead className="sr-only">
          <tr>
            <th className="text-left w-1/2">FIELD</th>
            <th className="text-right w-1/2">VALUE</th>
          </tr>
        </thead>
        <tbody className="[&_tr]:h-6">
          {stats.map((stat, i) => (
            <Highlight key={i} padding={{ x: 8 }}>
              <StatRow stat={stat} />
            </Highlight>
          ))}
        </tbody>
      </table>
    </div>
  );
});
StatsBox.displayName = "StatsBox";

export default StatsBox;
