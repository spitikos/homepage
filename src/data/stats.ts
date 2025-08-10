import { Stat } from "@/lib/prometheus/schema";

const host: Stat[] = [
  {
    type: "label",
    field: "os",
    query: "node_os_info",
    label: "pretty_name",
  },
  {
    type: "label",
    field: "architecture",
    query: "node_uname_info",
    label: "machine",
  },
  {
    type: "value",
    field: "uptime",
    query: "node_time_seconds - node_boot_time_seconds",
    refine: (data) => Math.round(data / 3600) + " h",
  },
];

const resource: Stat[] = [
  {
    type: "value",
    field: "cpu",
    displayType: "gauge",
    query: `avg(1 - rate(node_cpu_seconds_total{mode="idle"}[15m]))`,
  },
  {
    type: "value",
    field: "memory",
    displayType: "gauge",
    query:
      "(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes",
  },
  {
    type: "value",
    field: "disk",
    displayType: "gauge",
    query: `(node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"}`,
  },
];

const network: Stat[] = [
  {
    type: "value",
    field: "in",
    query: `node_network_receive_bytes_total`,
    refine: (data) => Math.round(data / 1000000) + " mb",
  },
  {
    type: "value",
    field: "out",
    query: `node_network_transmit_bytes_total`,
    refine: (data) => Math.round(data / 1000000) + " mb",
  },
];

const temperature: Stat[] = [
  {
    type: "value",
    field: "cpu",
    query: `node_hwmon_temp_celsius{chip="1000120000_pcie_1f000c8000_adc", sensor="temp1"}`,
    refine: (data) => data.toFixed(2) + " °C",
  },
  {
    type: "value",
    field: "nvme",
    query: `node_hwmon_temp_celsius{chip="nvme_nvme0", sensor="temp1"}`,
    refine: (data) => data.toFixed(2) + " °C",
  },
];

export const stats = { host, resource, network, temperature };
