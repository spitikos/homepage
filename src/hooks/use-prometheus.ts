import { createFetch, createSchema } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const BASE_URL = "/api/prometheus";
const REFRESH_INTERVAL = 5 * 1000; // 5 seconds

const prometheusSchema = {
  status: z.enum(["success", "error"]),
  resultType: z.enum(["vector", "matrix", "scalar", "string"]),
  metric: z.record(z.string(), z.string()),
  value: z.tuple([z.number(), z.string()]),
  query: z.object({ query: z.string() }),

  queryResponse(isRange: boolean) {
    return z.object({
      status: this.status,
      data: z.object({
        resultType: this.resultType,
        result: z.array(
          isRange
            ? z.object({
                metric: this.metric,
                values: z.array(this.value),
              })
            : z.object({
                metric: this.metric,
                value: this.value,
              }),
        ),
      }),
    });
  },
};

const querySchema = createSchema({
  "/query": {
    query: prometheusSchema.query,
    output: prometheusSchema.queryResponse(false),
  },
  "/query_range": {
    query: prometheusSchema.query,
    output: prometheusSchema.queryResponse(true),
  },
});

const $fetch = createFetch({
  baseURL: BASE_URL,
  schema: querySchema,
  throw: true,
});

type UsePrometheusProps = {
  query: string;
  labels?: Record<string, string>;
  range?: {
    start: Date;
    end: Date;
  };
};

function usePrometheus({ query, labels, range }: UsePrometheusProps) {
  const labelString = labels
    ? "{" +
      Object.entries(labels)
        .map(([key, val]) => `${key}="${val}"`)
        .join(", ") +
      "}"
    : "";
  const fullQuery = query + labelString;

  const instantQuery = useQuery({
    enabled: range === undefined,
    queryKey: ["prometheus", query, labels],
    queryFn: () => $fetch("/query", { query: { query: fullQuery } }),
    refetchInterval: REFRESH_INTERVAL,
  });
  const rangeQuery = useQuery({
    enabled: range !== undefined,
    queryKey: ["prometheus", query, labels, range],
    queryFn: () => $fetch("/query_range", { query: { query: fullQuery } }),
    refetchInterval: REFRESH_INTERVAL,
  });

  return range
    ? {
        data: rangeQuery.data?.data.result[0],
        error: rangeQuery.error,
      }
    : {
        data: instantQuery.data?.data.result[0],
        error: instantQuery.error,
      };
}

export default usePrometheus;
