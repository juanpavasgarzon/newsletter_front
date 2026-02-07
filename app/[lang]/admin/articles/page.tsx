"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { PenSquare, PlusCircle, Search, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  EmptyListIllustration,
  NoSearchResultsIllustration,
} from "@/components/illustrations";
import { getLocaleForDates } from "@/config/i18n";
import { useDebouncedSearchSync } from "@/hooks/useDebouncedSearchSync";
import { useMinLoadingTime } from "@/hooks/useMinLoadingTime";
import { ConfirmModal } from "@/components/ConfirmModal";
import { PageLoader } from "@/components/PageLoader";

const LOADER_MIN_MS = 400;
import {
  useArticleGroupsInfiniteQuery,
  useDeleteArticleGroupMutation,
} from "@/features/newsletter/queries";
import { AdminGuard } from "@/features/admin/AdminGuard";

export default function AdminArticlesPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const qStr = searchParams?.get("q") ?? "";
  const { t } = useTranslation();
  const listLang = lang === "en" ? "en" : "es";
  const { data: groupsData, isLoading } = useArticleGroupsInfiniteQuery(
    listLang,
    {
      pageSize: 20,
      q: qStr.trim() || undefined,
    }
  );
  const deleteGroup = useDeleteArticleGroupMutation();
  const showLoader = useMinLoadingTime(isLoading, LOADER_MIN_MS);
  const [deleteTargetGroupId, setDeleteTargetGroupId] = useState<string | null>(
    null
  );
  const [inputValue, setInputValue] = useState(qStr);

  useEffect(() => {
    setInputValue(qStr);
  }, [qStr]);

  const applySearch = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams?.toString() ?? "");
      const trimmed = value.trim();
      if (trimmed) {
        next.set("q", trimmed);
      } else {
        next.delete("q");
      }
      router.replace(
        `/${lang}/admin/articles${next.toString() ? `?${next.toString()}` : ""}`
      );
    },
    [router, lang, searchParams]
  );

  useDebouncedSearchSync(inputValue, qStr, applySearch);

  const articles = groupsData?.pages.flatMap((p) => p.items) ?? [];
  const sorted = articles
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  const locale = getLocaleForDates(listLang);
  const hasQuery = qStr.length > 0;
  const showEmptySearch = hasQuery && sorted.length === 0;
  const showEmptyList = !hasQuery && articles.length === 0;

  const handleDeleteClick = (groupId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTargetGroupId(groupId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetGroupId) {
      return;
    }
    try {
      await deleteGroup.mutateAsync(deleteTargetGroupId);
      toast.success(t("admin.deleteSuccess"));
      setDeleteTargetGroupId(null);
    } catch {
      toast.error(t("admin.deleteError"));
    }
  };

  return (
    <AdminGuard>
      <main className="min-h-[calc(100vh-3.5rem)] bg-surface">
        <ConfirmModal
          open={deleteTargetGroupId !== null}
          title={t("admin.confirmDeleteTitle")}
          message={t("admin.confirmDeleteDescription")}
          confirmLabel={t("admin.confirmDeleteConfirm")}
          cancelLabel={t("admin.cancel")}
          variant="danger"
          size="wide"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTargetGroupId(null)}
        />
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <section className="mb-8 text-center">
            <h1 className="text-primary mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("admin.panelTitle")}
            </h1>
            <p className="text-surface-muted mx-auto max-w-xl text-lg">
              {t("admin.panelSubtitle")}
            </p>
            <Link
              href={`/${lang}/admin/new`}
              className="bg-accent hover:bg-accent-hover text-white mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              {t("admin.newArticle")}
            </Link>
          </section>

          <div className="text-primary border-theme bg-surface-elevated mb-8 flex items-center gap-2 rounded-xl border px-4 py-2.5 focus-within:ring-2 focus-within:ring-accent/20">
            <Search className="text-surface-muted h-5 w-5 shrink-0" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("admin.searchPlaceholder")}
              className="bg-transparent placeholder-theme w-full min-w-0 border-0 text-base outline-none"
              aria-label={t("admin.searchPlaceholder")}
            />
          </div>

          {showLoader ? (
            <PageLoader label={t("common.loading")} />
          ) : showEmptyList ? (
            <div className="flex flex-col items-center justify-center pt-6 pb-16 text-center sm:pt-8 sm:pb-20">
              <EmptyListIllustration
                className="mb-6 max-h-[200px] w-full max-w-[280px]"
                width={280}
                height={200}
              />
              <p className="text-primary mb-2 text-xl font-semibold sm:text-2xl">
                {t("admin.noArticlesCreate")}
              </p>
              <p className="text-surface-muted max-w-sm text-sm leading-relaxed">
                {t("home.noArticlesHint")}
              </p>
            </div>
          ) : showEmptySearch ? (
            <div className="flex flex-col items-center justify-center pt-6 pb-16 text-center sm:pt-8 sm:pb-20">
              <NoSearchResultsIllustration
                className="mb-6 max-h-[200px] w-full max-w-[280px]"
                width={280}
                height={200}
              />
              <p className="text-primary mb-2 text-xl font-semibold sm:text-2xl">
                {t("admin.noSearchResults", { query: qStr })}
              </p>
              <p className="text-surface-muted max-w-sm text-sm leading-relaxed">
                {t("home.noArticlesHint")}
              </p>
            </div>
          ) : (
            <section className="bg-surface-elevated border-theme rounded-xl border">
              <h2 className="text-primary border-theme border-b px-4 py-3 font-semibold sm:px-6">
                {t("admin.publishedArticles")}
              </h2>
              <ul className="divide-y divide-[var(--color-border)]">
                {sorted.map((row) => (
                  <li key={row.groupId}>
                    <div className="text-primary hover:bg-surface-muted flex items-center gap-3 rounded-lg px-4 py-3 sm:px-6">
                      <Link
                        href={`/${lang}/admin/edit/group/${row.groupId}`}
                        className="text-primary flex min-w-0 flex-1 items-center gap-3"
                      >
                        <PenSquare className="text-surface-muted h-4 w-4 shrink-0" />
                        <span className="font-medium truncate">{row.title}</span>
                        <span className="flex shrink-0 flex-wrap items-center gap-1.5">
                          {row.support.map((code) => (
                            <span
                              key={code}
                              className="bg-accent-muted text-accent rounded-full px-2 py-0.5 text-xs font-medium"
                            >
                              {code.toUpperCase()}
                            </span>
                          ))}
                        </span>
                      </Link>
                      <span className="text-surface-muted shrink-0 text-sm">
                        {new Date(row.publishedAt).toLocaleDateString(locale)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteClick(row.groupId, e)}
                        disabled={deleteGroup.isPending}
                        className="text-surface-muted hover:text-red-500 rounded p-2 transition-colors disabled:opacity-50"
                        aria-label={t("admin.deleteArticle")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </AdminGuard>
  );
}
