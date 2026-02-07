"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ArticleContent } from "@/components/ArticleContent";
import {
  useAboutQuery,
  useBasicInfoQuery,
} from "@/features/site/useSiteConfigQuery";
import { useMinLoadingTime } from "@/hooks/useMinLoadingTime";
import { PageLoader } from "@/components/PageLoader";

const LOADER_MIN_MS = 400;

export default function AboutPage() {
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const langKey = lang === "en" ? "en" : "es";
  const { t } = useTranslation();
  const tLng = (key: string, opts?: Record<string, unknown>) =>
    t(key, { ...opts, lng: lang });
  const { data: basicInfo, isLoading: loadingBasic } =
    useBasicInfoQuery(langKey);
  const { data: aboutData, isLoading: loadingAbout } = useAboutQuery(langKey);
  const author = basicInfo;
  const aboutTitle = aboutData?.title;
  const aboutSubtitle = aboutData?.subtitle;
  const aboutSections = aboutData?.sections ?? [];
  const hasAboutContent =
    Boolean(aboutTitle) || Boolean(aboutSubtitle) || aboutSections.length > 0;
  const isLoading = loadingBasic || loadingAbout;
  const showLoader = useMinLoadingTime(isLoading, LOADER_MIN_MS);

  if (showLoader) {
    return <PageLoader label={tLng("common.loading")} />;
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-surface">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href={`/${lang}/articles`}
          className="text-surface-muted hover:text-accent mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {tLng("common.backToHome")}
        </Link>

        <article className="flex flex-col items-start text-left">
          {author?.name ? (
            <h1 className="text-primary mb-2 text-3xl font-bold tracking-tight">
              {author.name}
            </h1>
          ) : null}
          {author?.role ? (
            <p className="text-surface-muted mb-6 text-lg">{author.role}</p>
          ) : null}
          {hasAboutContent ? (
            <div className="text-primary prose prose-lg mt-10 max-w-none text-left prose-p:leading-relaxed">
              {aboutTitle ? (
                <h2 className="text-primary text-2xl font-semibold tracking-tight">
                  {aboutTitle}
                </h2>
              ) : null}
              {aboutSubtitle ? (
                <p className="text-surface-muted mb-4 text-lg">
                  {aboutSubtitle}
                </p>
              ) : null}
              {aboutSections.length > 0 ? (
                <div className="space-y-6">
                  {aboutSections.map((section, i) => (
                    <section key={i}>
                      {section.title ? (
                        <h3 className="text-primary text-lg font-medium">
                          {section.title}
                        </h3>
                      ) : null}
                      <ArticleContent content={section.content} />
                    </section>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-surface-muted">{tLng("about.empty")}</p>
          )}
        </article>
      </div>
    </main>
  );
}
