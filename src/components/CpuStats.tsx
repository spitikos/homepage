// src/components/CpuStats.tsx
"use client";

import { useEffect, useState } from "react";
import { statsClient } from "@/lib/grpc";
import { CpuResponse } from "@ethantlee/pi-protos/gen/ts/proto/api-stats/stats_pb";

export function CpuStats() {
  const [cpuData, setCpuData] = useState<CpuResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function streamCpuStats() {
      try {
        const stream = statsClient.streamCpu({});
        for await (const response of stream) {
          setCpuData(response);
        }
      } catch (err) {
        console.error("gRPC Stream Error:", err);
        setError("Failed to connect to the stats service.");
      }
    }

    streamCpuStats();
  }, []); // The empty dependency array ensures this runs once on mount

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
