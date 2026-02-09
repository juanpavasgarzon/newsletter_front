import { appEnv } from "@/config/env";
import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";

export const metadata: Metadata = {
  title: "Pavas Newsletter — Programming Articles",
  description: "Tutorials, best practices, and thoughts on software development.",
};

const themeStorageKey = appEnv.themeStorageKey;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k=${JSON.stringify(themeStorageKey)};try{var t=localStorage.getItem(k);if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);else if(window.matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.setAttribute('data-theme','dark');else document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`,
          }}
        />
        {appEnv.enableAnalytics && (
          <script
            defer
            src="https://analytics.pavas.io/script.js"
            data-website-id="24a4fb35-1508-46a9-8e21-7972110be429"
          />
        )}
      </head>
      <body className="bg-surface text-primary">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
