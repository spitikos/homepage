import { PrometheusSchema } from "@/lib/schema";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = "/api/prometheus";
const REFRESH_INTERVAL = 5 * 1000; // 5 seconds

const querySchema = createSchema({
  "/query": {
    query: PrometheusSchema.primitives.query,
    output: PrometheusSchema.vectorResponse,
  },
  "/query_range": {
    query: PrometheusSchema.primitives.query,
    output: PrometheusSchema.matrixResponse,
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

function usePrometheus(props: Omit<UsePrometheusProps, "range">): {
  data: PrometheusSchema.VectorResponse["data"]["result"][0];
  error: Error | null;
};

function usePrometheus(props: Required<UsePrometheusProps>): {
  data: PrometheusSchema.MatrixResponse["data"]["result"][0];
  error: Error | null;
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
