"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { getLocaleForDates } from "@/config/i18n";
import {
  useArticlesByGroupInfiniteQuery,
  useArticlesInfiniteQuery,
} from "@/features/newsletter/queries";
import { useDebouncedSearchSync } from "@/hooks/useDebouncedSearchSync";
import { useMinLoadingTime } from "@/hooks/useMinLoadingTime";
import { PageLoader } from "@/components/PageLoader";

const LOADER_MIN_MS = 400;

export default function ArticlesPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const langKey = lang === "en" ? "en" : "es";
  const qStr = searchParams?.get("q") ?? "";
  const { t } = useTranslation();
  const tLng = (key: string, opts?: Record<string, unknown>) =>
    t(key, { ...opts, lng: lang });
  const hasSearch = qStr.trim().length > 0;
  const byGroupQuery = useArticlesByGroupInfiniteQuery(langKey, {
    pageSize: 10,
    enabled: !hasSearch,
  });
  const searchQuery = useArticlesInfiniteQuery(langKey, {
    q: hasSearch ? qStr : undefined,
    pageSize: 10,
    enabled: hasSearch,
  });
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    hasSearch ? searchQuery : byGroupQuery;
  const locale = getLocaleForDates(langKey);
  const showLoader = useMinLoadingTime(isLoading, LOADER_MIN_MS);

  const [inputValue, setInputValue] = useState(qStr);
  useEffect(() => {
    setInputValue(qStr);
  }, [qStr]);

  const applySearch = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams?.toString() ?? "");
      if (value.trim()) {
        next.set("q", value.trim());
      } else {
        next.delete("q");
      }
      router.replace(
        `/${lang}/articles${next.toString() ? `?${next.toString()}` : ""}`
      );
    },
    [router, lang, searchParams]
  );

  useDebouncedSearchSync(inputValue, qStr, applySearch);

  const articles = data?.pages.flatMap((p) => p.items) ?? [];
  const sorted = articles
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  const hasQuery = qStr.length > 0;
  const showEmptySearch = hasQuery && sorted.length === 0;
  const showEmptyList = !hasQuery && articles.length === 0;

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <section className="mb-8 text-center">
          <h1 className="text-primary mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {tLng("home.title")}
          </h1>
          <p className="text-surface-muted mx-auto max-w-xl text-lg">
            {tLng("home.subtitle")}
          </p>
        </section>

        <div className="text-primary border-theme bg-surface-elevated mb-8 flex items-center gap-2 rounded-xl border px-4 py-2.5 focus-within:ring-2 focus-within:ring-accent/20">
          <Search className="text-surface-muted h-5 w-5 shrink-0" />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={tLng("home.searchPlaceholder")}
            className="bg-transparent placeholder-theme w-full min-w-0 border-0 text-base outline-none"
            aria-label={tLng("home.searchPlaceholder")}
          />
        </div>

        {showLoader ? (
          <PageLoader label={tLng("home.loadingArticles")} />
        ) : showEmptyList ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center pt-6 pb-16 text-center sm:pt-8 sm:pb-20">
            <p className="text-primary mb-2 text-xl font-semibold sm:text-2xl">
              {tLng("home.noArticles")}
            </p>
            <p className="text-surface-muted max-w-sm text-sm leading-relaxed">
              {tLng("home.noArticlesHint")}
            </p>
          </div>
        ) : showEmptySearch ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center pt-6 pb-16 text-center sm:pt-8 sm:pb-20">
            <p className="text-primary mb-2 text-xl font-semibold sm:text-2xl">
              {tLng("home.noSearchResults", { query: qStr })}
            </p>
            <p className="text-surface-muted max-w-sm text-sm leading-relaxed">
              {tLng("home.noArticlesHint")}
            </p>
          </div>
        ) : (
          <>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {sorted.map((article) => (
                <li key={article.groupId}>
                  <Link
                    href={`/${lang}/articles/${article.groupId}`}
                    className="bg-surface-elevated border-theme hover:border-accent/50 group block rounded-xl border p-6 transition-all hover:shadow-lg"
                  >
                    <h2 className="text-primary group-hover:text-accent mb-2 text-xl font-semibold transition-colors break-words">
                      {article.title}
                    </h2>
                    <p className="text-surface-muted mb-3 line-clamp-2 text-sm break-words">
                      {article.excerpt}
                    </p>
                    <div className="text-surface-muted flex flex-wrap items-center gap-2 text-xs">
                      <span>{article.author}</span>
                      <span>·</span>
                      <time dateTime={article.publishedAt}>
                        {new Date(article.publishedAt).toLocaleDateString(
                          locale,
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </time>
                      {article.tags.length > 0 && (
                        <>
                          <span>·</span>
                          <span className="break-words">
                            {article.tags.join(", ")}
                          </span>
                        </>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="border-theme text-primary rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-surface-muted disabled:opacity-50"
                >
                  {isFetchingNextPage
                    ? tLng("common.loading")
                    : tLng("common.loadMore")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
