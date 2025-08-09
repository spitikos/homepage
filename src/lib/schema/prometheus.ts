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

type VectorResponse = z.infer<typeof vectorResponse>;
type MatrixResponse = z.infer<typeof matrixResponse>;
type ScalarResponse = z.infer<typeof scalarResponse>;
type StringResponse = z.infer<typeof stringResponse>;

export {
  matrixResponse,
  primitives,
  scalarResponse,
  stringResponse,
  vectorResponse,
};
export type { MatrixResponse, ScalarResponse, StringResponse, VectorResponse };
