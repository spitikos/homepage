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

export type { Stat };
