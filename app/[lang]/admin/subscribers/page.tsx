"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Users } from "lucide-react";
import { getLocaleForDates } from "@/config/i18n";
import { AdminGuard } from "@/features/admin/AdminGuard";
import {
  useSubscribersInfiniteQuery,
  useUnsubscribeMutation,
} from "@/features/newsletter/useSubscriberAdmin";
import { ConfirmModal } from "@/components/ConfirmModal";
import { useState } from "react";
import { useMinLoadingTime } from "@/hooks/useMinLoadingTime";
import { PageLoader } from "@/components/PageLoader";

const LOADER_MIN_MS = 400;

export default function AdminSubscribersPage() {
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const { t } = useTranslation();
  const locale = getLocaleForDates(lang === "en" ? "en" : "es");
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSubscribersInfiniteQuery();
  const unsubscribe = useUnsubscribeMutation();
  const showLoader = useMinLoadingTime(isLoading, LOADER_MIN_MS);
  const [deleteTargetEmail, setDeleteTargetEmail] = useState<string | null>(null);

  const subscribers = data?.pages.flatMap((p) => p.items) ?? [];
  const sorted = subscribers
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const handleDeleteClick = (email: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTargetEmail(email);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetEmail) {
      return;
    }
    try {
      await unsubscribe.mutateAsync(deleteTargetEmail);
      toast.success(t("admin.subscriberRemoved"));
      setDeleteTargetEmail(null);
    } catch {
      toast.error(t("admin.deleteError"));
    }
  };

  return (
    <AdminGuard>
      <main className="min-h-[calc(100vh-3.5rem)] bg-surface">
        <ConfirmModal
          open={deleteTargetEmail !== null}
          title={t("admin.confirmUnsubscribeTitle")}
          message={t("admin.confirmUnsubscribeDescription", {
            email: deleteTargetEmail ?? "",
          })}
          confirmLabel={t("admin.confirmDeleteConfirm")}
          cancelLabel={t("admin.cancel")}
          variant="danger"
          size="wide"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTargetEmail(null)}
        />
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-primary mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {t("admin.subscribersTitle")}
              </h1>
              <p className="text-surface-muted text-lg">
                {t("admin.subscribersSubtitle")}
              </p>
            </div>
            <Link
              href={`/${lang}/admin/articles`}
              className="text-primary hover:bg-surface-muted inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("common.backToAdmin")}
            </Link>
          </div>

          {showLoader ? (
            <PageLoader label={t("common.loading", { lng: lang })} />
          ) : sorted.length === 0 ? (
            <section className="bg-surface-elevated border-theme flex min-h-[50vh] flex-col rounded-xl border">
              <h2 className="text-primary border-theme flex items-center gap-2 border-b px-4 py-3 font-semibold sm:px-6">
                <Users className="h-5 w-5" />
                {t("admin.subscribersList")}
              </h2>
              <p className="text-surface-muted flex flex-1 items-center justify-center px-4 py-8 text-center sm:px-6">
                {t("admin.noSubscribers")}
              </p>
            </section>
          ) : (
            <section className="bg-surface-elevated border-theme rounded-xl border">
              <h2 className="text-primary border-theme flex items-center gap-2 border-b px-4 py-3 font-semibold sm:px-6">
                <Users className="h-5 w-5" />
                {t("admin.subscribersList")} ({sorted.length})
              </h2>
              <ul className="divide-y divide-[var(--color-border)]">
                {sorted.map((row) => (
                  <li key={row.id}>
                    <div className="text-primary hover:bg-surface-muted flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {row.email}
                      </span>
                      <span className="bg-accent-muted text-accent shrink-0 rounded-full px-2 py-0.5 text-xs font-medium uppercase">
                        {row.lang}
                      </span>
                      <span className="text-surface-muted shrink-0 text-sm">
                        {new Date(row.createdAt).toLocaleDateString(locale)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteClick(row.email, e)}
                        disabled={unsubscribe.isPending}
                        className="text-surface-muted hover:text-red-500 rounded p-2 transition-colors disabled:opacity-50"
                        aria-label={t("admin.unsubscribeSubscriber")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {hasNextPage && (
                <div className="border-theme flex justify-center border-t p-4">
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="border-theme text-primary rounded-lg border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-surface-muted disabled:opacity-50"
                  >
                    {isFetchingNextPage
                      ? t("common.loading")
                      : t("common.loadMore")}
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </AdminGuard>
  );
}
