import { NextRequest } from "next/server";

const API_URL = "http://api-stats.api-stats.svc.cluster.local:50051";

export async function POST(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const path = pathname.replace("/api/stats", "");
  const url = `${API_URL}${path}${search}`;

  const res = await fetch(url, {
    method: "POST",
    headers: req.headers,
    body: req.body,
    signal: req.signal,
    // @ts-expect-error duplex is required for streaming but not yet in standard types
    duplex: "half",
  });

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
}
