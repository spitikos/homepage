import { createClient } from "@connectrpc/connect";

import { StatsService } from "@buf/ethantlee_pi-protos.bufbuild_es/stats/stats_pb";

import { createGrpcWebTransport } from "@connectrpc/connect-web";

const transport = createGrpcWebTransport({
  baseUrl: "http://api-stats.api-stats.svc.cluster.local:50051",
  useBinaryFormat: true,
  interceptors: [],
  fetch: globalThis.fetch,
  jsonOptions: {},
});

export const statsClient = createClient(StatsService, transport);
