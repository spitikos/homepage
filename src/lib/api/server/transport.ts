import CONFIG from "@/lib/config";
import { createConnectTransport } from "@connectrpc/connect-node";

export const transport = createConnectTransport({
  baseUrl: CONFIG.API.URL,
  httpVersion: "2",
  useBinaryFormat: true,
});
