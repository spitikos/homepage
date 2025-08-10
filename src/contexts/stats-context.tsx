"use client";

import { Stat } from "@/lib/prometheus/schema";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

type StatsContextType = {
  selectedStat: Stat | null;
  setSelectedStat: Dispatch<SetStateAction<Stat | null>>;
};

export const StatsContext = createContext<StatsContextType>({
  selectedStat: null,
  setSelectedStat: () => {},
});

export const StatsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);

  return (
    <StatsContext.Provider value={{ selectedStat, setSelectedStat }}>
      {children}
    </StatsContext.Provider>
  );
};
