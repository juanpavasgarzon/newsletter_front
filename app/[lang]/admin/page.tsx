"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAdminSession } from "@/context/admin-session-context";
import { useEffect } from "react";

export default function AdminRootPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const redirectParam = searchParams?.get("redirect");
  const target = redirectParam ?? `/${lang}/admin/articles`;
  const { t } = useTranslation();
  const { isAdmin, checked } = useAdminSession();

  useEffect(() => {
    if (!checked) {
      return
    }
    if (isAdmin) {
      router.replace(target);
    } else {
      const loginUrl = `/${lang}/login?redirect=${encodeURIComponent(target)}`;
      router.replace(loginUrl);
    }
  }, [checked, isAdmin, router, lang, target]);

  if (!checked) {
    return (
      <main className="min-h-[calc(100vh-3.5rem)] bg-surface">
        <div className="flex min-h-[40vh] items-center justify-center">
          <span className="text-surface-muted animate-pulse">
            {t("common.verifying")}
          </span>
        </div>
      </main>
    );
  }

  return null;
}
