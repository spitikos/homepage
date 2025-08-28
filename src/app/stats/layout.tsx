import { SelectedStatProvider } from "@/contexts";
import { type ReactNode } from "react";

type LayoutProps = {
  current: Readonly<ReactNode>;
  chart: Readonly<ReactNode>;
};

const StatsLayout = ({ current, chart }: LayoutProps) => {
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
