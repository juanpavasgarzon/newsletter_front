"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAdminSession } from "@/context/admin-session-context";
import { ApiError } from "@/api/auth";
import { useMinLoadingTime } from "@/hooks/useMinLoadingTime";
import { PageLoader } from "@/components/PageLoader";

const LOADER_MIN_MS = 400;

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = typeof params?.lang === "string" ? params.lang : "es";
  const redirectTo = searchParams?.get("redirect") ?? `/${lang}/admin/articles`;
  const { t } = useTranslation();
  const { isAdmin, checked, login } = useAdminSession();
  const tLng = (key: string) => t(key, { lng: lang });
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const showLoader = useMinLoadingTime(!checked, LOADER_MIN_MS);

  useEffect(() => {
    if (checked && isAdmin) {
      router.replace(redirectTo);
    }
  }, [checked, isAdmin, router, redirectTo]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await login(secret);
      router.push(redirectTo);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : tLng("admin.loginError")
      );
    }
  };

  if (showLoader) {
    return <PageLoader label={tLng("common.verifying")} />;
  }

  if (isAdmin) {
    return null;
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-surface">
      <div className="mx-auto max-w-md px-4 py-16 sm:max-w-lg sm:px-6">
        <div className="bg-surface-elevated border-theme rounded-2xl border p-8 sm:p-10">
          <h1 className="text-primary mb-8 text-2xl font-semibold sm:text-3xl">
            {tLng("admin.adminAccess")}
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <label className="text-primary block text-sm font-medium">
              {tLng("admin.adminSecret")}
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="border-theme bg-surface text-primary placeholder-theme w-full rounded-lg border px-4 py-3 text-base focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {error ? (
              <p className="text-sm text-red-500 dark:text-red-400">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              className="bg-accent hover:bg-accent-hover text-white mt-2 w-full rounded-lg py-3 text-base font-medium transition-colors"
            >
              {tLng("admin.enter")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
