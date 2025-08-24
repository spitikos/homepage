"use client";

import { Stat } from "@/lib/prometheus";
import {
  PrometheusProxyService,
  QueryResponse,
} from "@buf/spitikos_api.bufbuild_es/prometheusproxy/v1/service_pb";
import {
  Sample,
  SampleStream,
} from "@buf/spitikos_api.bufbuild_es/prometheusproxy/v1/types_pb";
import { timestampFromDate } from "@bufbuild/protobuf/wkt";
import { createClient } from "@connectrpc/connect";
import { useQuery, useTransport } from "@connectrpc/connect-query";
import { useEffect, useState } from "react";

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000); /* 24 hours ago */
const since = timestampFromDate(yesterday);

type UsePrometheusProps = {
  stat: Stat;
  queryType: "instant" | "range";
};

const usePrometheus = ({ stat, queryType }: UsePrometheusProps) => {
  const transport = useTransport();
  const client = createClient(PrometheusProxyService, transport);

  const { data: rangeData } = useQuery(
    PrometheusProxyService.method.queryRange,
    { query: stat.query, since },
    {
      enabled: queryType === "range",
      refetchInterval: 60 * 1000 /* 1 minute */,
      refetchIntervalInBackground: true,
    },
  );

  const [instantMessage, setInstantMessage] = useState<QueryResponse | null>(
    null,
  );

  useEffect(() => {
    if (queryType !== "instant") return;

    let active = true;
    const stream = client.streamQuery({ query: stat.query });

    (async () => {
      for await (const msg of stream) {
        if (!active) break;
        setInstantMessage(msg);
      }
    })();

    return () => {
      active = false;
    };
  }, [client, stat.query, queryType]);

  if (queryType === "instant") {
    const metric = instantMessage?.data?.[0]?.metric ?? null;
    const value =
      (instantMessage?.data?.[0] as Sample | undefined)?.value?.value ?? null;
    return { labels: metric, value };
  }

  const metric = rangeData?.data?.[0]?.metric ?? null;
  const values =
    (rangeData?.data?.[0] as SampleStream | undefined)?.values ?? null;
  return { labels: metric, values };
};

export default usePrometheus;
