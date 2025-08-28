import { type Stat } from "@/components/stat";
import CONFIG from "@/lib/config";

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
    query: `avg_over_time((1 - avg without (cpu) (rate(node_cpu_seconds_total{mode="idle"}[1m])))[${CONFIG.STATS.AVG_OVER}:])`,
  },
  {
    type: "value",
    field: "memory",
    displayType: "gauge",
    query: `avg_over_time(((node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes)[${CONFIG.STATS.AVG_OVER}:])`,
  },
  {
    type: "value",
    field: "disk",
    displayType: "gauge",
    query: `avg_over_time(((node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"})[${CONFIG.STATS.AVG_OVER}:])`,
  },
];

const network: Stat[] = [
  {
    type: "value",
    field: "in",
    query: `rate(node_network_receive_bytes_total{device="wlan0"}[${CONFIG.STATS.AVG_OVER}])`,
    refine: (data) => Math.round((data * 8) / 1000) + " kbps",
  },
  {
    type: "value",
    field: "out",
    query: `rate(node_network_transmit_bytes_total{device="wlan0"}[${CONFIG.STATS.AVG_OVER}])`,
    refine: (data) => Math.round((data * 8) / 1000) + " kbps",
  },
];

const temperature: Stat[] = [
  {
    type: "value",
    field: "cpu",
    query: `avg_over_time(node_hwmon_temp_celsius{chip="1000120000_pcie_1f000c8000_adc", sensor="temp1"}[${CONFIG.STATS.AVG_OVER}:])`,
    refine: (data) => data.toFixed(2) + " °C",
  },
  {
    type: "value",
    field: "nvme",
    query: `avg_over_time(node_hwmon_temp_celsius{chip="nvme_nvme0", sensor="temp1"}[${CONFIG.STATS.AVG_OVER}:])`,
    refine: (data) => data.toFixed(2) + " °C",
  },
];

export const stats = { host, resource, network, temperature };
