import { ReactNode } from "react";

const StatsLayout = ({
  children,
  summary,
}: {
  children: Readonly<ReactNode>;
  summary: Readonly<ReactNode>;
}) => {
  return (
    <>
      {summary}
      {children}
    </>
  );
};

export default StatsLayout;
