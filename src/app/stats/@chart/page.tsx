"use client";

import { StatChart } from "@/components/stats";
import { StatsContext } from "@/contexts";
import { useContext } from "react";

const Page = () => {
  const { selectedStat } = useContext(StatsContext);

  return (
    <div className="w-full h-[50vh]">
      {selectedStat && <StatChart {...selectedStat} />}
    </div>
  );
};

export default Page;
