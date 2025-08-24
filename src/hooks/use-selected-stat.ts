import { SelectedStatContext } from "@/contexts";
import { useContext } from "react";

export const useSelectedStat = () => {
  const context = useContext(SelectedStatContext);
  if (!context) {
    throw new Error("useStats must be used within a SelectedStatProvider");
  }
  return context;
};
