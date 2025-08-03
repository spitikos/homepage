"use client";

import { statsClient } from "@/lib/api/stats/client";
import { StreamCpuResponse } from "@buf/ethantlee_pi-protos.bufbuild_es/stats/stats_pb";
import { useEffect, useState } from "react";

export function CpuStats() {
  const [cpuData, setCpuData] = useState<StreamCpuResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const streamCpuStats = async () => {
      try {
        const stream = statsClient.streamCpu({});
        for await (const response of stream) {
          setCpuData(response);
          console.log(response);
        }
      } catch (err) {
        console.error("gRPC Stream Error:", err);
        setError("Failed to connect to the stats service.");
      }
    };

    streamCpuStats();
  }, []);

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
