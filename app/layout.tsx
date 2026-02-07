import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "./providers";
import { appEnv } from "@/config/env";

export const metadata: Metadata = {
  title: "Pavas Newsletter — Artículos de programación",
  description: "Tutoriales, buenas prácticas y reflexiones sobre desarrollo de software.",
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
        <script
          defer
          src="https://analytics.pavas.io/script.js"
          data-website-id="c2bb89d5-e4aa-42f6-ab46-861d8c3518cd"
        />
      </head>
      <body className="bg-surface text-primary">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
