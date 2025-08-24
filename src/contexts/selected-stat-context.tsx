"use client";

import { type Stat } from "@/lib/prometheus";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";

type SelectedStatContextType = {
  selectedStat: Stat | null;
  setSelectedStat: Dispatch<SetStateAction<Stat | null>>;
};

export const SelectedStatContext = createContext<SelectedStatContextType>({
  selectedStat: null,
  setSelectedStat: () => {
    /* */
  },
});

export const SelectedStatProvider = ({ children }: { children: ReactNode }) => {
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);

  return (
    <SelectedStatContext.Provider value={{ selectedStat, setSelectedStat }}>
      {children}
    </SelectedStatContext.Provider>
  );
};
