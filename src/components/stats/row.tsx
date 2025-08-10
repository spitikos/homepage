"use client";

import { Stat } from "@/lib/prometheus/schema";
import { IconLoader2 } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { ComponentProps } from "react";

const Value = dynamic(() => import("./row-value"), {
  ssr: false,
  loading: () => (
    <IconLoader2
      size={14}
      className="text-secondary animate-spin absolute right-0 top-1/2 -translate-y-1/2"
    />
  ),
});

type StatRowProps = { stat: Stat } & ComponentProps<"tr">;

const StatRow = ({ stat, ...props }: StatRowProps) => {
  return (
    <tr {...props} className="*:w-1/2 cursor-pointer">
      <td className="text-left text-secondary">{stat.field.toUpperCase()}</td>
      <td className="text-right relative">
        <Value {...stat} />
      </td>
    </tr>
  );
};

export default StatRow;
