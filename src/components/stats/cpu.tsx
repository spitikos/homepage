"use client";

import {
  StatsService,
  StreamCpuResponse,
} from "@buf/ethantlee_pi-protos.bufbuild_es/stats/stats_pb";
import { createClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { useEffect, useMemo, useState } from "react";

export function CpuStats() {
  const [cpuData, setCpuData] = useState<StreamCpuResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const client = useMemo(() => {
    const transport = createGrpcWebTransport({
      baseUrl: "/api/stats",
    });
    return createClient(StatsService, transport);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const streamCpuStats = async () => {
      try {
        const stream = client.streamCpu({});
        for await (const response of stream) {
          if (isCancelled) break;
          setCpuData(response);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("gRPC Stream Error:", err);
          setError("Failed to connect to the stats service.");
        }
      }
    };

    streamCpuStats();

    return () => {
      isCancelled = true;
    };
  }, [client]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!cpuData) {
    return <div>Loading CPU stats...</div>;
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">CPU Stats</h2>
      <p>Clock Speed: {cpuData.clock.toFixed(2)} MHz</p>
      <ul>
        {cpuData.percent.map((core, i) => (
          <li key={i}>
            Core {i}: {core.toFixed(2)}%
          </li>
        ))}
      </ul>
    </div>
  );
}
