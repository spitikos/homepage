import { PrometheusConfig, PrometheusSchema } from "@/lib/prometheus";
import { Stat } from "@/lib/prometheus/schema";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { useSuspenseQuery } from "@tanstack/react-query";
import z from "zod";

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
  baseURL: PrometheusConfig.BASE_URL,
  schema: querySchema,
  throw: true,
  fetchOptions: {
    cache: "no-store",
  },
});

function usePrometheus({ query }: Stat) {
  const { data: instantData, error: instantError } = useSuspenseQuery({
    queryKey: ["prometheus", "instant", query],
    queryFn: () => $fetch("/query", { query: { query } }),
    refetchInterval: PrometheusConfig.REFRESH_INTERVAL,
    staleTime: PrometheusConfig.REFRESH_INTERVAL,
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
    queryKey: ["prometheus", "range", query],
    queryFn: () => {
      const now = Math.floor(Date.now() / 1000);
      const range = {
        start: now - PrometheusConfig.RANGE_LENGTH,
        end: now,
      };

      return $fetch("/query_range", {
        query: {
          query,
          start: range.start,
          end: range.end,
          step: PrometheusConfig.RANGE_LENGTH / PrometheusConfig.RANGE_POINTS,
        },
      });
    },
    refetchInterval: PrometheusConfig.REFRESH_INTERVAL,
    staleTime: PrometheusConfig.REFRESH_INTERVAL,
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
