"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { unsubscribePostPublic } from "@/api/subscriptions";
import { toast } from "sonner";

type Status = "form" | "loading" | "success" | "error";

function UnsubscribeForm({
  initialEmail,
  lang,
}: {
  initialEmail: string;
  lang: string;
}) {
  const { t } = useTranslation();
  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState<Status>("form");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      toast.error(t("subscribe.unsubscribeError"));
      return;
    }
    setStatus("loading");
    try {
      await unsubscribePostPublic({ email: trimmed });
      setStatus("success");
    } catch {
      setStatus("error");
      toast.error(t("subscribe.errorGeneric"));
    }
  };

  if (status === "success") {
    return (
      <main className="min-h-[calc(100vh-3.5rem)] bg-surface">
        <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
          <div className="bg-surface-elevated border-theme rounded-2xl border p-8">
            <h1 className="text-primary mb-4 text-2xl font-semibold">
              {t("subscribe.unsubscribeSuccessTitle")}
            </h1>
            <p className="text-surface-muted mb-6">
              {t("subscribe.unsubscribeSuccess")}
            </p>
            <Link
              href={`/${lang}/articles`}
              className="text-primary hover:bg-surface-muted inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("common.backToArticles")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-surface">
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="bg-surface-elevated border-theme rounded-2xl border p-8">
          <h1 className="text-primary mb-2 text-2xl font-semibold">
            {t("subscribe.unsubscribePageTitle")}
          </h1>
          <p className="text-surface-muted mb-6">
            {t("subscribe.unsubscribePageSubtitle")}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="unsubscribe-email" className="text-primary text-sm font-medium">
              {t("subscribe.label")}
            </label>
            <input
              id="unsubscribe-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("subscribe.placeholder")}
              disabled={status === "loading"}
              className="border-theme bg-surface text-primary placeholder-theme w-full rounded-lg border px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
              autoComplete="email"
            />
            <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
              <button
                type="submit"
                disabled={status === "loading" || !email.trim()}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {status === "loading"
                  ? t("common.loading")
                  : t("subscribe.unsubscribeButton")}
              </button>
              <Link
                href={`/${lang}/articles`}
                className="border-theme text-primary flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors hover:bg-surface-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("admin.cancel")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function SubscriptionUnsubscribePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const emailFromUrl = (searchParams?.get("email") ?? "").trim();

  return (
    <UnsubscribeForm
      key={emailFromUrl}
      initialEmail={emailFromUrl}
      lang={lang}
    />
  );
}
