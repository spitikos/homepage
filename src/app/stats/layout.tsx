import { SelectedStatProvider } from "@/contexts";
import { type ReactNode } from "react";

const StatsLayout = ({
  current,
  chart,
}: {
  current: Readonly<ReactNode>;
  chart: Readonly<ReactNode>;
}) => {
  return (
    <main className="*:border-b">
      <SelectedStatProvider>
        <section>{current}</section>
        <section>{chart}</section>
      </SelectedStatProvider>
    </main>
  );
};

export default StatsLayout;
