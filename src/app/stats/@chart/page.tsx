"use client";

import { StatChart } from "@/components/stat";
import { SelectedStatContext } from "@/contexts";
import { useContext } from "react";

const Page = () => {
  const { selectedStat } = useContext(SelectedStatContext);

  return (
    <div className="w-full h-[50vh]">
      {selectedStat && <StatChart {...selectedStat} />}
    </div>
  );
};

export default Page;
