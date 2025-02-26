"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function QueryProvider({ children }: Props) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
