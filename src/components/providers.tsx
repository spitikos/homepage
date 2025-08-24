"use client";

import { HighlightProvider } from "@/contexts";
import { TransportProvider } from "@connectrpc/connect-query";
import { createConnectTransport } from "@connectrpc/connect-web";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode } from "react";

const transport = createConnectTransport({
  baseUrl: "https://api.spitikos.dev:443",
  useBinaryFormat: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TransportProvider transport={transport}>
      <QueryClientProvider client={queryClient}>
        <HighlightProvider>{children}</HighlightProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </TransportProvider>
  );
}
