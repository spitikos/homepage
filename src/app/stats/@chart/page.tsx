"use client";

import { StatChart } from "@/components/stat";
import { useSelectedStat } from "@/hooks/use-selected-stat";

const Page = () => {
  const { selectedStat } = useSelectedStat();

  return (
    <div className="w-full h-[50vh]">
      {selectedStat && <StatChart {...selectedStat} />}
    </div>
  );
};

export default Page;
