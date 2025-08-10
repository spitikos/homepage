"use client";

import { StatChart } from "@/components/stats";
import { StatsContext } from "@/contexts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useContext } from "react";

dayjs.extend(relativeTime);

const Page = () => {
  const { selectedStat } = useContext(StatsContext);

  return (
    <div className="py-5 w-full h-[50vh]">
      {selectedStat && <StatChart {...selectedStat} />}
    </div>
  );
};

export default Page;
