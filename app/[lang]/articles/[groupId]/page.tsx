"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/api/articles";
import { getLocaleForDates } from "@/config/i18n";
import { ArticleContent } from "@/components/ArticleContent";
import { useArticleByGroupQuery } from "@/features/newsletter/queries";
import { useMinLoadingTime } from "@/hooks/useMinLoadingTime";
import { PageLoader } from "@/components/PageLoader";

const LOADER_MIN_MS = 400;

async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

export default function ArticlePage() {
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const groupId = typeof params?.groupId === "string" ? params.groupId : "";
  const { t } = useTranslation();
  const langKey = lang === "en" ? "en" : "es";
  const { data: article, isLoading, isError, error } = useArticleByGroupQuery(groupId, langKey);
  const locale = getLocaleForDates(langKey);
  const tLng = (key: string, opts?: Record<string, unknown>) =>
    t(key, { ...opts, lng: lang });
  const showLoader = useMinLoadingTime(isLoading, LOADER_MIN_MS);

  useEffect(() => {
    if (!showLoader && isError && error) {
      const message = error instanceof ApiError ? error.message : tLng("article.notFoundShort");
      toast.error(message);
    }
  }, [showLoader, isError, error, tLng]);
  const [shareStatus, setShareStatus] = useState<
    "idle" | "copied" | "shared"
  >("idle");

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined" || !article) {
      return;
    }
    const url = `${window.location.origin}/${lang}/articles/${groupId}`;
    const canUseShare =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function";
    if (canUseShare) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url,
        });
        setShareStatus("shared");
      } catch {
        await copyToClipboard(url);
        setShareStatus("copied");
      }
    } else {
      await copyToClipboard(url);
      setShareStatus("copied");
    }
    setTimeout(() => setShareStatus("idle"), 2000);
  }, [lang, groupId, article]);

  if (showLoader) {
    return <PageLoader label={tLng("common.loading")} />;
  }

  if (!article) {
    return (
      <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center bg-surface px-4 pt-8 pb-16 sm:px-6 sm:pt-10 sm:pb-20">
        <h1 className="text-primary mb-2 text-xl font-semibold sm:text-2xl">
          {tLng("article.notFound")}
        </h1>
        <p className="text-surface-muted mb-8 max-w-sm text-center text-sm leading-relaxed">
          {tLng("article.notFoundHint")}
        </p>
        <Link
          href={`/${lang}/articles`}
          className="text-accent hover:underline inline-flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          {tLng("common.backToArticles")}
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-surface">
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/${lang}/articles`}
            className="text-surface-muted hover:text-accent inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {tLng("common.backToArticles")}
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="text-primary hover:bg-surface-muted inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            aria-label={tLng("common.share")}
          >
            <Share2 className="h-4 w-4" />
            {shareStatus === "copied"
              ? tLng("common.copied")
              : shareStatus === "shared"
                ? tLng("common.shared")
                : tLng("common.share")}
          </button>
        </div>

        <header className="mb-8">
          <h1 className="text-primary mb-4 text-3xl font-bold tracking-tight break-words sm:text-4xl">
            {article.title}
          </h1>
          <div className="text-surface-muted flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span>{article.author}</span>
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            {article.tags.length > 0 ? (
              <span className="flex flex-wrap gap-1">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-accent-muted text-accent rounded-full px-2.5 py-0.5 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            ) : null}
          </div>
        </header>

        <ArticleContent content={article.content} />
      </article>
    </main>
  );
}
