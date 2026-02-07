"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Languages } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { SupportedLang } from "@/config/i18n";
import { AdminGuard } from "@/features/admin/AdminGuard";
import { useBasicInfoQuery } from "@/features/site/useSiteConfigQuery";
import { useCreateArticleMutation } from "@/features/newsletter/queries";
import { ApiError } from "@/api/articles";
import { ArticleForm } from "@/components/ArticleForm";

export default function NewArticlePage() {
  const params = useParams();
  const router = useRouter();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const { t } = useTranslation();
  const create = useCreateArticleMutation();
  const [selectedLang, setSelectedLang] = useState<SupportedLang>("es");
  const { data: basicInfo } = useBasicInfoQuery(selectedLang);
  const defaultAuthor = basicInfo?.name ?? "";

  const handleSubmit = async (
    data: Parameters<typeof create.mutateAsync>[0]
  ) => {
    try {
      const created = await create.mutateAsync(data);
      toast.success(t("admin.createSuccess"));
      router.push(`/${lang}/admin/edit/group/${created.groupId}`);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
        return;
      }
      toast.error(t("common.unexpectedError"));
      console.error(err);
    }
  };

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
          <h1 className="text-primary mb-6 flex items-center gap-2 text-2xl font-bold">
            <Languages className="h-7 w-7" />
            {t("admin.newArticleTitle")}
          </h1>

          <div className="border-theme mb-6 flex rounded-lg border bg-surface-elevated p-1">
            <button
              type="button"
              onClick={() => setSelectedLang("es")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${
                selectedLang === "es"
                  ? "bg-accent text-white"
                  : "text-primary hover:bg-surface-muted"
              }`}
            >
              {selectedLang === "es" ? <Check className="h-4 w-4" /> : null}
              {t("admin.spanish")}
            </button>
            <button
              type="button"
              onClick={() => setSelectedLang("en")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${
                selectedLang === "en"
                  ? "bg-accent text-white"
                  : "text-primary hover:bg-surface-muted"
              }`}
            >
              {selectedLang === "en" ? <Check className="h-4 w-4" /> : null}
              {t("admin.english")}
            </button>
          </div>

          <section className="border-theme rounded-xl border bg-surface-elevated p-6">
            <ArticleForm
              lang={selectedLang}
              defaultAuthor={defaultAuthor}
              onSubmit={handleSubmit}
              isSubmitting={create.isPending}
            />
          </section>
        </div>
      </main>
    </AdminGuard>
  );
}
