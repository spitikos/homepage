"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [stat, setStat] = useState<string>();

  useEffect(() => {
    const statSource = new EventSource("https://pi.taehoonlee.dev/api/stats");

    statSource.onmessage = (event) => {
      setStat(event.data);
    };

    statSource.onerror = (err) => {
      console.error("SSE error:", err);
      statSource.close();
    };

    return () => {
      statSource.close();
    };
  }, []);

  return (
    <main>
      <p>CPU: {JSON.parse(stat ?? "{}").temperature?.cpuTemperature}</p>
    </main>
  );
}
