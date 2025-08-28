import CONFIG from "@/lib/config";
import { createConnectTransport } from "@connectrpc/connect-web";

export const transport = createConnectTransport({
  baseUrl: CONFIG.API.URL,
  useBinaryFormat: true,
});
