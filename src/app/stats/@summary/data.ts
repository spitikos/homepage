import { StatsBox } from "@/components/stats";
import { PrometheusMetric } from "@/hooks/use-prometheus";
import { ComponentProps } from "react";

const hostQuery = `{__name__=~"node_os_info|node_time_seconds|node_uname_info"}`;
const cpuQuery = `avg(1 - rate(node_cpu_seconds_total{mode="idle"}[1m]))`;
const memoryQuery =
  "(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes";
const diskQuery = `(node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_free_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"}`;
const networkQuery = `{__name__=~"node_network_receive_bytes_total|node_network_transmit_bytes_total", device="wlan0"}`;
const temperatureQuery = `{__name__="node_hwmon_temp_celsius", chip=~"1000120000_pcie_1f000c8000_adc|nvme_nvme0"}`;

export const queries = {
  cpuQuery,
  diskQuery,
  hostQuery,
  memoryQuery,
  networkQuery,
  temperatureQuery,
};

type PrometheusData = {
  hostData: PrometheusMetric[] | undefined;
  cpuData: PrometheusMetric[] | undefined;
  memoryData: PrometheusMetric[] | undefined;
  diskData: PrometheusMetric[] | undefined;
  temperatureData: PrometheusMetric[] | undefined;
  networkData: PrometheusMetric[] | undefined;
};

export const transformData = ({
  hostData,
  cpuData,
  memoryData,
  diskData,
  temperatureData,
  networkData,
}: PrometheusData) => {
  const host = {
    title: "host",
    stats: [
      {
        field: "os",
        value: hostData?.find((m) => m.metric.__name__ === "node_os_info")
          ?.metric.pretty_name,
      },
      {
        field: "architecture",
        value: hostData?.find((m) => m.metric.__name__ === "node_uname_info")
          ?.metric.machine,
      },
      {
        field: "uptime",
        value: hostData?.find((m) => m.metric.__name__ === "node_time_seconds")
          ?.value[1],
      },
    ],
  } satisfies ComponentProps<typeof StatsBox>;

  const resource = {
    title: "resource",
    stats: [
      {
        field: "cpu",
        type: "gauge",
        value: cpuData?.[0]?.value[1],
      },
      {
        field: "memory",
        type: "gauge",
        value: memoryData?.[0]?.value[1],
      },
      {
        field: "disk",
        type: "gauge",
        value: diskData?.[0]?.value[1],
      },
    ],
  } satisfies ComponentProps<typeof StatsBox>;

  const networkIn = networkData?.find(
    (m) => m.metric.__name__ === "node_network_receive_bytes_total",
  )?.value[1];
  const networkOut = networkData?.find(
    (m) => m.metric.__name__ === "node_network_transmit_bytes_total",
  )?.value[1];
  const network = {
    title: "network",
    stats: [
      {
        field: "in",
        value: networkIn ? Math.round(networkIn / 1000000) + " MB" : null,
      },
      {
        field: "out",
        value: networkOut ? Math.round(networkOut / 1000000) + " MB" : null,
      },
    ],
  } satisfies ComponentProps<typeof StatsBox>;

  const tempCpu = temperatureData?.find(
    (m) =>
      m.metric.__name__ === "node_hwmon_temp_celsius" &&
      m.metric.chip === "1000120000_pcie_1f000c8000_adc",
  )?.value[1];
  const tempNvme = temperatureData?.find(
    (m) =>
      m.metric.__name__ === "node_hwmon_temp_celsius" &&
      m.metric.chip === "nvme_nvme0",
  )?.value[1];
  const temperature = {
    title: "temperature",
    stats: [
      {
        field: "cpu",
        value: tempCpu ? tempCpu.toFixed(2) + " °C" : null,
      },
      {
        field: "nvme",
        value: tempNvme ? tempNvme.toFixed(2) + " °C" : null,
      },
    ],
  } satisfies ComponentProps<typeof StatsBox>;

  return [host, resource, network, temperature];
};
