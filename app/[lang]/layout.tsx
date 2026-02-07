"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { setStoredLanguage } from "@/lib/i18n-client";
import { isSupportedLang } from "@/config/i18n";
import { NewsletterHeader } from "@/components/NewsletterHeader";
import { Footer } from "@/components/Footer";

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const lang = typeof params?.lang === "string" ? params.lang : "es";

  useEffect(() => {
    if (!isSupportedLang(lang)) {
      router.replace("/es/articles");
      return;
    }
    setStoredLanguage(lang);
  }, [lang, router]);

  if (!isSupportedLang(lang)) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NewsletterHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
