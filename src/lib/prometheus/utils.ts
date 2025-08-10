import { Vector, Matrix } from "./schema";

type GetValueProps = {
  data: Vector[] | undefined;
  labels: {
    name: string;
  } & Record<string, string>;
};

const getValue = ({ data, labels }: GetValueProps) => {
  return data?.find(
    (m) =>
      m.labels.__name__ === labels.name &&
      Object.entries(labels).every(
        ([key, val]) => key === "name" || m.labels[key] === val,
      ),
  )?.value.value;
};

type GetRangeValuesProps = {
  data: Matrix[] | undefined;
  labels: {
    name: string;
  } & Record<string, string>;
};

const getRangeValues = ({ data, labels }: GetRangeValuesProps) => {
  return data?.find(
    (m) =>
      m.labels.__name__ === labels.name &&
      Object.entries(labels).every(
        ([key, val]) => key === "name" || m.labels[key] === val,
      ),
  )?.values;
};

type GetLabelProps = {
  data: Vector[] | Matrix[] | undefined;
  name: string;
  label: string;
};

const getLabel = ({ data, name, label }: GetLabelProps) => {
  return data?.find((m) => m.labels.__name__ === name)?.labels[label];
};

export { getLabel, getRangeValues, getValue };
