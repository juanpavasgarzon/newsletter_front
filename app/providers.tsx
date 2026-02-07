"use client";

// Import i18n-client first to ensure i18next is initialized before any component uses useTranslation
import "@/lib/i18n-client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ThemeProvider } from "@/context/theme-context";
import { AdminSessionProvider } from "@/context/admin-session-context";
import { GlobalLoaderProvider } from "@/context/global-loader-context";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GlobalLoaderProvider>
          <AdminSessionProvider>
            {children}
            <Toaster richColors position="top-center" />
          </AdminSessionProvider>
        </GlobalLoaderProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
