import z from "zod";

const primitives = {
  status: z.enum(["success", "error"]),
  resultType: z.enum(["vector", "matrix", "scalar", "string"]),
  metric: z.record(z.string(), z.string()),
  value: z.tuple([z.number(), z.string()]),
  query: z.object({ query: z.string() }),
};

const vectorResponse = z.object({
  status: primitives.status,
  data: z.object({
    resultType: primitives.resultType,
    result: z.array(
      z.object({
        metric: primitives.metric,
        value: primitives.value,
      }),
    ),
  }),
});

const matrixResponse = z.object({
  status: primitives.status,
  data: z.object({
    resultType: primitives.resultType,
    result: z.array(
      z.object({
        metric: primitives.metric,
        values: z.array(primitives.value),
      }),
    ),
  }),
});

const scalarResponse = z.object({
  status: primitives.status,
  data: z.object({
    resultType: primitives.resultType,
    result: primitives.value,
  }),
});

const stringResponse = z.object({
  status: primitives.status,
  data: z.object({
    resultType: primitives.resultType,
    result: primitives.value,
  }),
});

type Vector = {
  labels: Record<string, string>;
  value: {
    time: Date;
    value: number;
  };
};

type Matrix = {
  labels: Record<string, string>;
  values: {
    time: Date;
    value: number;
  }[];
};

type Stat = {
  field: string;
  query: string;
  displayType?: "literal" | "gauge";
} & (
  | { type: "label"; label: string; refine?: (data: string) => string }
  | {
      type: "value";
      label?: undefined;
      refine?: (data: number) => number | string;
    }
);

export {
  matrixResponse,
  primitives,
  scalarResponse,
  stringResponse,
  vectorResponse,
};
export type { Matrix, Stat, Vector };
