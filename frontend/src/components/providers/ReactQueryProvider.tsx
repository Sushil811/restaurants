"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setShowDevtools(true);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && (
        <DevtoolsWrapperClient />
      )}
    </QueryClientProvider>
  );
}

function DevtoolsWrapperClient() {
  const [Devtools, setDevtools] = useState<any>(null);

  useEffect(() => {
    import("@tanstack/react-query-devtools").then((mod) => {
      setDevtools(() => mod.ReactQueryDevtools);
    });
  }, []);

  if (!Devtools) return null;
  return <Devtools initialIsOpen={false} buttonPosition="bottom-left" />;
}
