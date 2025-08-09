import { PrometheusSchema } from "@/lib/schema";
import { createFetch, createSchema } from "@better-fetch/fetch";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = "https://prometheus.spitikos.dev/api/v1";
const REFRESH_INTERVAL = 2 * 1000; // 5 seconds

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
  fetchOptions: {
    cache: "no-store",
  },
});

type UsePrometheusProps = {
  query: string;
  range?: {
    start: Date;
    end: Date;
  };
};

function usePrometheus(props: Omit<UsePrometheusProps, "range">): {
  data:
    | {
        metric: Record<string, string>;
        value: [Date, number];
      }[]
    | undefined;
  error: Error | null;
};

function usePrometheus(props: Required<UsePrometheusProps>): {
  data:
    | {
        metric: Record<string, string>;
        values: [Date, number][];
      }[]
    | undefined;
  error: Error | null;
};

function usePrometheus({ query, range }: UsePrometheusProps) {
  const instantQuery = useQuery({
    enabled: range === undefined,
    queryKey: ["prometheus", query],
    queryFn: () => $fetch("/query", { query: { query } }),
    refetchInterval: REFRESH_INTERVAL,
  });
  const rangeQuery = useQuery({
    enabled: range !== undefined,
    queryKey: ["prometheus", query, range],
    queryFn: () => $fetch("/query_range", { query: { query } }),
    refetchInterval: REFRESH_INTERVAL,
  });

  const instantResult = instantQuery.data?.data.result.map(
    ({ metric, value: [timestamp, value] }) => ({
      metric,
      value: [new Date(timestamp * 1000), parseFloat(value)] satisfies [
        Date,
        number,
      ],
    }),
  );

  const rangeResult = rangeQuery.data?.data.result.map(
    ({ metric, values }) => ({
      metric,
      values: values.map(([timestamp, value]) => [
        new Date(timestamp * 1000),
        parseFloat(value),
      ]) satisfies [Date, number][],
    }),
  );

  return !!range
    ? {
        data: rangeResult,
        error: rangeQuery.error,
      }
    : {
        data: instantResult,
        error: instantQuery.error,
      };
}

export default usePrometheus;
