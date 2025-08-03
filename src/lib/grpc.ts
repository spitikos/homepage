import { createConnectTransport } from "@connectrpc/connect-web";
import { Stats } from "@ethantlee/pi-protos/gen/ts/proto/api-stats/stats_connect";

const transport = createConnectTransport({
  baseUrl: "http://api-stats.api-stats.svc.cluster.local:50051",
});

export const statsClient = createPromiseClient(Stats, transport);
