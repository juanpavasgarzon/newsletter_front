"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Copy, Languages, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { Article } from "@/features/newsletter/contracts/article";
import { ArticleForm } from "@/components/ArticleForm";
import { ConfirmModal } from "@/components/ConfirmModal";
import { AdminGuard } from "@/features/admin/AdminGuard";
import {
  useArticleByGroupQuery,
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useUpdateArticleMutation,
} from "@/features/newsletter/queries";
import { useBasicInfoQuery } from "@/features/site/useSiteConfigQuery";

type TabLang = "es" | "en";

export default function EditGroupPage() {
  const params = useParams();
  const router = useRouter();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const groupId = typeof params?.groupId === "string" ? params.groupId : "";
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabLang>("es");

  const { data: articleEs, isLoading: loadingEs } = useArticleByGroupQuery(
    groupId,
    "es"
  );
  const { data: articleEn, isLoading: loadingEn } = useArticleByGroupQuery(
    groupId,
    "en"
  );
  const update = useUpdateArticleMutation();
  const create = useCreateArticleMutation();
  const deleteArticle = useDeleteArticleMutation();
  const { data: basicInfoEs } = useBasicInfoQuery("es");
  const { data: basicInfoEn } = useBasicInfoQuery("en");
  const defaultAuthorEs = basicInfoEs?.name ?? "";
  const defaultAuthorEn = basicInfoEn?.name ?? "";

  const [copyFromArticle, setCopyFromArticle] = useState<Article | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const isLoading = loadingEs && loadingEn;
  const hasEs = Boolean(articleEs);
  const hasEn = Boolean(articleEn);

  const handleConfirmDeleteVersion = async () => {
    if (!deleteTargetId) {
      return;
    }
    try {
      await deleteArticle.mutateAsync(deleteTargetId);
      toast.success(t("admin.deleteSuccess"));
      setDeleteTargetId(null);
    } catch {
      toast.error(t("admin.deleteError"));
    }
  };

  const otherArticleForCopy = (tab: TabLang): Article | null =>
    tab === "es" ? (articleEn ?? null) : (articleEs ?? null);

  if (!isLoading && !hasEs && !hasEn) {
    return (
      <AdminGuard>
        <main className="min-h-[calc(100vh-3.5rem)] bg-surface">
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
            <Link
              href={`/${lang}/admin/articles`}
              className="text-surface-muted hover:text-accent mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("common.backToAdmin")}
            </Link>
            <p className="text-primary">{t("article.notFoundShort")}</p>
          </div>
        </main>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <ConfirmModal
        open={deleteTargetId !== null}
        title={t("admin.confirmDeleteVersionTitle")}
        message={t("admin.confirmDeleteVersionDescription")}
        confirmLabel={t("admin.confirmDeleteConfirm")}
        cancelLabel={t("admin.cancel")}
        variant="danger"
        size="wide"
        onConfirm={handleConfirmDeleteVersion}
        onCancel={() => setDeleteTargetId(null)}
      />
      <main className="min-h-[calc(100vh-3.5rem)] bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            href={`/${lang}/admin/articles`}
            className="text-surface-muted hover:text-accent mb-6 inline-flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("common.backToAdmin")}
          </Link>
          <h1 className="text-primary mb-6 flex items-center gap-2 text-2xl font-bold">
            <Languages className="h-7 w-7" />
            {t("admin.editArticleTitle")}
          </h1>

          <div className="border-theme mb-6 flex rounded-lg border bg-surface-elevated p-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("es");
                setCopyFromArticle(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${
                activeTab === "es"
                  ? "bg-accent text-white"
                  : "text-primary hover:bg-surface-muted"
              }`}
            >
              {hasEs ? <Check className="h-4 w-4" /> : null}
              {t("admin.spanish")}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("en");
                setCopyFromArticle(null);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${
                activeTab === "en"
                  ? "bg-accent text-white"
                  : "text-primary hover:bg-surface-muted"
              }`}
            >
              {hasEn ? <Check className="h-4 w-4" /> : null}
              {t("admin.english")}
            </button>
          </div>

          {activeTab === "es" ? (
            <section className="border-theme rounded-xl border bg-surface-elevated p-6">
              {loadingEs ? (
                <p className="text-surface-muted animate-pulse">
                  {t("common.loading")}
                </p>
              ) : articleEs ? (
                <ArticleForm
                  lang="es"
                  defaultAuthor={articleEs.author}
                  initialValues={{
                    slug: articleEs.slug,
                    author: articleEs.author,
                    tags: articleEs.tags,
                    title: articleEs.title,
                    excerpt: articleEs.excerpt,
                    content: articleEs.content,
                  }}
                  onSubmit={async (data) => {
                    await update.mutateAsync({
                      id: articleEs.id,
                      input: {
                        slug: data.slug,
                        author: data.author,
                        tags: data.tags,
                        title: data.title,
                        excerpt: data.excerpt,
                        content: data.content,
                      },
                    });
                    toast.success(t("admin.updateSuccess"));
                  }}
                  isSubmitting={update.isPending}
                />
              ) : (
                <>
                  <p className="text-surface-muted mb-4 text-sm">
                    {t("admin.articleNotInThisLanguage")}
                  </p>
                  {otherArticleForCopy("es") ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCopyFromArticle(otherArticleForCopy("es"))
                      }
                      className="text-accent hover:underline mb-4 flex items-center gap-2 text-sm font-medium"
                    >
                      <Copy className="h-4 w-4" />
                      {t("admin.copyFromOtherLanguage")}
                    </button>
                  ) : null}
                  <ArticleForm
                    key={`es-create-${copyFromArticle?.id ?? "new"}`}
                    lang="es"
                    groupId={groupId}
                    defaultAuthor={defaultAuthorEs}
                    initialValues={
                      copyFromArticle
                        ? {
                            title: copyFromArticle.title,
                            excerpt: copyFromArticle.excerpt,
                            content: copyFromArticle.content,
                            author: copyFromArticle.author,
                            tags: copyFromArticle.tags,
                          }
                        : undefined
                    }
                    onSubmit={async (data) => {
                      await create.mutateAsync(data);
                      toast.success(t("admin.createSuccess"));
                      setCopyFromArticle(null);
                    }}
                    isSubmitting={create.isPending}
                  />
                </>
              )}
            </section>
          ) : null}

          {activeTab === "en" ? (
            <section className="border-theme rounded-xl border bg-surface-elevated p-6">
              {loadingEn ? (
                <p className="text-surface-muted animate-pulse">
                  {t("common.loading")}
                </p>
              ) : articleEn ? (
                <ArticleForm
                  lang="en"
                  defaultAuthor={articleEn.author}
                  initialValues={{
                    slug: articleEn.slug,
                    author: articleEn.author,
                    tags: articleEn.tags,
                    title: articleEn.title,
                    excerpt: articleEn.excerpt,
                    content: articleEn.content,
                  }}
                  onSubmit={async (data) => {
                    await update.mutateAsync({
                      id: articleEn.id,
                      input: {
                        slug: data.slug,
                        author: data.author,
                        tags: data.tags,
                        title: data.title,
                        excerpt: data.excerpt,
                        content: data.content,
                      },
                    });
                    toast.success(t("admin.updateSuccess"));
                  }}
                  isSubmitting={update.isPending}
                />
              ) : (
                <>
                  <p className="text-surface-muted mb-4 text-sm">
                    {t("admin.articleNotInThisLanguage")}
                  </p>
                  {otherArticleForCopy("en") ? (
                    <button
                      type="button"
                      onClick={() =>
                        setCopyFromArticle(otherArticleForCopy("en"))
                      }
                      className="text-accent hover:underline mb-4 flex items-center gap-2 text-sm font-medium"
                    >
                      <Copy className="h-4 w-4" />
                      {t("admin.copyFromOtherLanguage")}
                    </button>
                  ) : null}
                  <ArticleForm
                    key={`en-create-${copyFromArticle?.id ?? "new"}`}
                    lang="en"
                    groupId={groupId}
                    defaultAuthor={defaultAuthorEn}
                    initialValues={
                      copyFromArticle
                        ? {
                            title: copyFromArticle.title,
                            excerpt: copyFromArticle.excerpt,
                            content: copyFromArticle.content,
                            author: copyFromArticle.author,
                            tags: copyFromArticle.tags,
                          }
                        : undefined
                    }
                    onSubmit={async (data) => {
                      await create.mutateAsync(data);
                      toast.success(t("admin.createSuccess"));
                      setCopyFromArticle(null);
                    }}
                    isSubmitting={create.isPending}
                  />
                </>
              )}
            </section>
          ) : null}

          <section className="border-red-300/40 bg-red-500/[0.06] dark:border-red-500/20 dark:bg-red-500/[0.08] mt-10 rounded-xl border p-6 shadow-[0_0_40px_-10px_rgba(239,68,68,0.15)] dark:shadow-[0_0_40px_-10px_rgba(239,68,68,0.12)] backdrop-blur-sm">
            <h2 className="text-red-600/90 dark:text-red-400/90 mb-1 text-lg font-semibold">
              {t("admin.dangerZone")}
            </h2>
            <p className="text-red-600/80 dark:text-red-400/70 mb-4 text-sm leading-relaxed">
              {t("admin.dangerZoneHint")}
            </p>
            {hasEs && hasEn ? (
              activeTab === "es" && articleEs ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-500/[0.04] dark:bg-red-500/[0.06] border border-red-400/10 dark:border-red-500/10 p-3">
                  <span className="text-primary text-sm font-medium">
                    {t("admin.spanish")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(articleEs.id)}
                    disabled={deleteArticle.isPending}
                    className="text-red-600/90 hover:bg-red-500/10 dark:text-red-400/90 dark:hover:bg-red-500/15 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("admin.deleteSpanishVersion")}
                  </button>
                </div>
              ) : activeTab === "en" && articleEn ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-500/[0.04] dark:bg-red-500/[0.06] border border-red-400/10 dark:border-red-500/10 p-3">
                  <span className="text-primary text-sm font-medium">
                    {t("admin.english")}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(articleEn.id)}
                    disabled={deleteArticle.isPending}
                    className="text-red-600/90 hover:bg-red-500/10 dark:text-red-400/90 dark:hover:bg-red-500/15 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("admin.deleteEnglishVersion")}
                  </button>
                </div>
              ) : null
            ) : (
              <p className="text-red-600/80 dark:text-red-400/70 text-sm leading-relaxed">
                {t("admin.onlyOneVersionHint")}
              </p>
            )}
          </section>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => router.push(`/${lang}/admin/articles`)}
              className="text-accent hover:underline text-sm font-medium"
            >
              ← {t("common.backToAdmin")}
            </button>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}
