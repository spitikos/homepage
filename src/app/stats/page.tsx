"use client";

import { StatsBox } from "@/components/stats";
import { usePrometheus } from "@/hooks";
import { ComponentProps, Suspense } from "react";

const NODE_EXPORTER_JOB = "node-exporter";

export default function Stats() {
  const { data: hostOs } = usePrometheus({
    query: "node_os_info",
    labels: { job: NODE_EXPORTER_JOB },
  });
  const { data: hostUptime } = usePrometheus({
    query: "node_time_seconds",
    labels: { job: NODE_EXPORTER_JOB },
  });
  const { data: hostArch } = usePrometheus({
    query: "node_uname_info",
    labels: { job: NODE_EXPORTER_JOB },
  });
  const { data: resourceCpu } = usePrometheus({
    query: "node_load5",
    labels: { job: NODE_EXPORTER_JOB },
  });
  const { data: resourceMem } = usePrometheus({
    query:
      "(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes",
    labels: { job: NODE_EXPORTER_JOB },
  });
  const { data: resourceDisk } = usePrometheus({
    query:
      '(node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"}',
  });
  const { data: networkIn } = usePrometheus({
    query: "node_network_receive_bytes_total",
    labels: { job: NODE_EXPORTER_JOB, device: "wlan0" },
  });
  const { data: networkOut } = usePrometheus({
    query: "node_network_transmit_bytes_total",
    labels: { job: NODE_EXPORTER_JOB, device: "wlan0" },
  });
  const { data: tempCpu } = usePrometheus({
    query: "node_hwmon_temp_celsius",
    labels: { job: NODE_EXPORTER_JOB, chip: "1000120000_pcie_1f000c8000_adc" },
  });
  const { data: tempNvme } = usePrometheus({
    query: "node_hwmon_temp_celsius",
    labels: { job: NODE_EXPORTER_JOB, chip: "nvme_nvme0", sensor: "temp1" },
  });

  const stats = [
    {
      title: "host",
      stats: [
        {
          field: "os",
          value: hostOs?.metric["pretty_name"],
        },
        { field: "architecture", value: hostArch?.metric["machine"] },
        { field: "uptime", value: hostUptime?.value[1] },
      ],
    },
    {
      title: "resource",
      stats: [
        {
          field: "cpu",
          type: "gauge",
          value: parseFloat(resourceCpu?.value[1]),
        },
        {
          field: "memory",
          type: "gauge",
          value: parseFloat(resourceMem?.value[1]),
        },
        {
          field: "disk",
          type: "gauge",
          value: parseFloat(resourceDisk?.value[1]),
        },
      ],
    },
    {
      title: "network",
      stats: [
        { field: "in", value: networkIn?.value[1] },
        { field: "out", value: networkOut?.value[1] },
      ],
    },
    {
      title: "temperature",
      stats: [
        { field: "cpu", value: tempCpu ? tempCpu.value[1] + "°C" : null },
        { field: "nvme", value: tempNvme ? tempNvme.value[1] + "°C" : null },
      ],
    },
  ] satisfies ComponentProps<typeof StatsBox>[];

  return (
    <Suspense>
      <div className="grid grid-cols-4 border-y">
        {stats.map((props, i) => (
          <StatsBox key={i} {...props} />
        ))}
      </div>
    </Suspense>
  );
}
