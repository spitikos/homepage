import { PrometheusSchema } from "@/lib/prometheus";
import { Stat } from "@/lib/prometheus/schema";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import z from "zod";

const BASE_URL = "https://prometheus.spitikos.dev/api/v1";
const REFRESH_INTERVAL = 15 * 1000; // 15 seconds

const querySchema = createSchema({
  "/query": {
    query: z.object({
      query: z.string(),
    }),
    output: PrometheusSchema.vectorResponse,
  },
  "/query_range": {
    query: z.object({
      query: z.string(),
      start: z.number(),
      end: z.number(),
      step: z.number(),
    }),
    output: PrometheusSchema.matrixResponse,
  },
});

const $fetch = createFetch({
  baseURL: BASE_URL,
  schema: querySchema,
  throw: true,
  fetchOptions: {
    cache: "no-store",
  },
});

function usePrometheus({ query, range }: Stat) {
  const now = useMemo(() => Date.now(), []);

  const instantFetch = () => $fetch("/query", { query: { query } });
  const rangeFetch = () =>
    $fetch("/query_range", {
      query: {
        query,
        start: range ? range.start.getTime() / 1000 : now / 1000 - 3600 * 24,
        end: range ? range.end.getTime() / 1000 : now / 1000,
        step: 600,
      },
    });

  const { data: instantData, error: instantError } = useSuspenseQuery({
    queryKey: ["prometheus", query],
    queryFn: instantFetch,
    refetchInterval: REFRESH_INTERVAL,
    select: (data) =>
      data?.data.result.map(({ metric, value: [timestamp, value] }) => ({
        labels: metric,
        value: {
          time: new Date(timestamp * 1000),
          value: parseFloat(value),
        },
      }))[0],
  });
  if (instantError) console.error(instantError);

  const { data: rangeData, error: rangeError } = useSuspenseQuery({
    queryKey: ["prometheus", query, range],
    queryFn: rangeFetch,
    refetchInterval: false,
    select: (data) =>
      data?.data.result.map(({ metric, values }) => ({
        labels: metric,
        values: values.map(([timestamp, value]) => ({
          time: new Date(timestamp * 1000),
          value: parseFloat(value),
        })),
      }))[0],
  });
  if (rangeError) console.error(rangeError);

  return {
    instant: instantData,
    range: rangeData,
  };
}

export default usePrometheus;
