import { StatsProvider } from "@/contexts";
import { ReactNode } from "react";

const StatsLayout = ({
  current,
  chart,
}: {
  current: Readonly<ReactNode>;
  chart: Readonly<ReactNode>;
}) => {
  return (
    <main className="*:border-b">
      <StatsProvider>
        <section>{current}</section>
        <section>{chart}</section>
      </StatsProvider>
    </main>
  );
};

export default StatsLayout;
