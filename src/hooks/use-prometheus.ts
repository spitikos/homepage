"use client";

import { type Stat } from "@/lib/prometheus";
import {
  PrometheusService,
  type StreamQueryResponse,
} from "@buf/spitikos_api.bufbuild_es/prometheus/prometheus_pb";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { createClient } from "@connectrpc/connect";
import { useQuery, useTransport } from "@connectrpc/connect-query";
import { useEffect, useMemo, useState } from "react";

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); /* 24 hours ago */
const since = timestampFromDate(yesterday);

type UsePrometheusProps = {
  stat: Stat;
  queryType: "instant" | "range";
};

const usePrometheus = ({ stat, queryType }: UsePrometheusProps) => {
  const { data: rangeData } = useQuery(
    PrometheusService.method.queryRange,
    { query: stat.query, since },
    {
      enabled: queryType === "range",
      refetchInterval: 60 * 1000 /* 1 minute */,
      refetchIntervalInBackground: true,
    },
  );

  const [instantData, setInstantData] = useState<StreamQueryResponse | null>(
    null,
  );
  const transport = useTransport();
  const client = useMemo(
    () => createClient(PrometheusService, transport),
    [transport],
  );
  const stream = useMemo(
    () => client.streamQuery({ query: stat.query }),
    [client, stat.query],
  );

  useEffect(() => {
    if (queryType !== "instant") return;

    let active = true;

    void (async () => {
      for await (const msg of stream) {
        if (!active) break;
        setInstantData(msg);
      }
    })();

    return () => {
      active = false;
    };
  }, [client, stream, stat.query, queryType]);

  if (queryType === "instant") {
    const labels = instantData?.data?.[0]?.metric ?? null;
    const value = instantData?.data?.[0]?.value?.value ?? null;
    return { labels, value };
  }

  const labels = rangeData?.data?.[0]?.metric ?? null;
  const values = rangeData?.data?.[0]?.values ?? null;
  return { labels, values };
};

export default usePrometheus;
