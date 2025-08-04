import {
  StatsService,
  StreamCpuResponse,
  StreamDiskResponse,
  StreamHostResponse,
  StreamMemoryResponse,
  StreamTemperatureResponse,
} from "@buf/ethantlee_pi-protos.bufbuild_es/api-stats/stats_pb";
import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

export const useStats = () => {
  const [cpu, setCpu] = useState<StreamCpuResponse | null>(null);
  const [memory, setMemory] = useState<StreamMemoryResponse | null>(null);
  const [disk, setDisk] = useState<StreamDiskResponse | null>(null);
  const [host, setHost] = useState<StreamHostResponse | null>(null);
  const [temperature, setTemperature] =
    useState<StreamTemperatureResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const client = useMemo(() => {
    const transport = createGrpcWebTransport({
      baseUrl: "/api/stats",
    });
    return createClient(StatsService, transport);
  }, []);

  useEffect(() => {
    let isCanceled = false;

    streamStats({
      stream: client.streamCpu({}),
      isCanceled,
      setStat: setCpu,
      setError,
    });
    streamStats({
      stream: client.streamMemory({}),
      isCanceled,
      setStat: setMemory,
      setError,
    });
    streamStats<StreamDiskResponse>({
      stream: client.streamDisk({}),
      isCanceled,
      setStat: setDisk,
      setError,
    });
    streamStats({
      stream: client.streamHost({}),
      isCanceled,
      setStat: setHost,
      setError,
    });
    streamStats({
      stream: client.streamTemperature({}),
      isCanceled,
      setStat: setTemperature,
      setError,
    });

    return () => {
      isCanceled = true;
    };
  }, [client]);

  return {
    cpu,
    memory,
    disk,
    host,
    temperature,
    error,
  };
};

const streamStats = async <T>({
  stream,
  isCanceled,
  setStat,
  setError,
}: {
  stream: AsyncIterable<T>;
  isCanceled: boolean;
  setStat: Dispatch<SetStateAction<T | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
}) => {
  try {
    for await (const response of stream) {
      if (isCanceled) break;
      setStat(response);
    }
  } catch (err) {
    if (!isCanceled) {
      console.error("gRPC Stream Error:", err);
      setError("Failed to connect to the stats service.");
    }
  }
};
