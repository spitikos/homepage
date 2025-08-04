"use client";

import { StatsBox } from "@/components/stats";
import { useStats } from "@/hooks/use-stats";
import { ComponentProps } from "react";

export default function Stats() {
  const { host, cpu, memory, disk, temperature } = useStats();

  const data = [
    {
      title: "host",
      stats: [
        { field: "os", value: host?.os },
        {
          field: "platform",
          value: host ? host.platform + " " + host.platformVersion : null,
        },
        { field: "architecture", value: host?.architecture },
        { field: "uptime", value: host?.uptime },
        { field: "processes", value: host?.processes },
        {
          field: "boot time",
          value: host?.bootTime,
        },
      ],
    },
    {
      title: "resources",
      stats: [
        {
          field: "cpu",
          type: "gauge",
          value: cpu ? cpu.percent[0] / 100 : null,
        },
        {
          field: "memory",
          type: "gauge",
          value: memory ? memory.usedPercent / 100 : null,
        },
        {
          field: "disk",
          type: "gauge",
          value: disk ? disk.usedPercent / 100 : null,
        },
      ],
    },
    {
      title: "network",
      stats: [
        { field: "in", value: null },
        { field: "out", value: null },
      ],
    },
    {
      title: "temperature",
      stats: [
        { field: "cpu", value: temperature ? temperature.cpu + "°C" : null },
        { field: "nvme", value: temperature ? temperature.nvme + "°C" : null },
      ],
    },
  ] satisfies ComponentProps<typeof StatsBox>[];

  return (
    <div className="grid grid-cols-4 border-y">
      {data.map((props, i) => (
        <StatsBox key={i} {...props} />
      ))}
    </div>
  );
}
