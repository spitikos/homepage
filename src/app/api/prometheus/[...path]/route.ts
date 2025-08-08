import { NextRequest, NextResponse } from "next/server";

const PROMETHEUS_URL =
  "http://prometheus-kube-prometheus-prometheus.prometheus.svc.cluster.local:9090";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const path = (await params).path.join("/");
  const searchParams = req.nextUrl.searchParams.toString();
  const url = `${PROMETHEUS_URL}/api/v1/${path}?${searchParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { error: `Error from Prometheus: ${text}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      { error: "Error proxying to Prometheus", details: errorMessage },
      { status: 500 },
    );
  }
}
