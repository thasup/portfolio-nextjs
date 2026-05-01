import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, FlaskConical, Lock } from "lucide-react";
import { getUser } from "@/lib/nexus/session/getUser";
import { PrototypesAuth } from "@/components/prototypes/PrototypesAuth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "prototypes" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function PrototypesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "prototypes" });

  const session = await getUser();
  const canSeeSensitive =
    (session?.user?.can_see_prototypes ?? false) ||
    session?.user?.role === "ADMIN";

  const prototypes = [
    {
      id: "market-os",
      title: t("items.market-os.title"),
      description: t("items.market-os.description"),
      href: `/${locale}/prototypes/market-os`,
      tags: ["Next.js", "Prisma", "Supabase", "AI"],
      isSensitive: true,
    },
    {
      id: "praxis",
      title: t("items.praxis.title"),
      description: t("items.praxis.description"),
      href: `/${locale}/prototypes/praxis`,
      tags: ["AI-Learning", "Personalization", "LLM"],
      isSensitive: true,
    },
  ];

  const visiblePrototypes = prototypes.filter(
    (p) => !p.isSensitive || canSeeSensitive,
  );

  const hasSensitiveHidden = prototypes.some(
    (p) => p.isSensitive && !canSeeSensitive,
  );

  return (
    <main className="min-h-screen bg-[var(--color-paper)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full bg-[var(--color-praxis-accent)]/10 px-4 py-2">
            <FlaskConical className="mr-2 h-5 w-5 text-[var(--color-praxis-accent)]" />
            <span className="text-sm font-medium text-[var(--color-praxis-accent)]">
              {t("label")}
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[var(--color-ink-3)]">
            {t("subtitle")}
          </p>
        </div>

        {/* Prototypes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visiblePrototypes.map((prototype) => (
            <Link
              key={prototype.id}
              href={prototype.href}
              id={`prototype-card-${prototype.id}`}
              className="group relative rounded-xl border border-[var(--color-line-soft)] bg-[var(--color-paper)] p-6 transition-all duration-200 hover:border-[var(--color-praxis-accent)] hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-praxis-accent)]">
                  {prototype.title}
                </h2>
                <ArrowRight className="h-5 w-5 text-[var(--color-ink-3)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-praxis-accent)]" />
              </div>
              <p className="mb-4 text-sm text-[var(--color-ink-3)]">
                {prototype.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {prototype.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--color-paper-2)] px-3 py-1 text-xs text-[var(--color-ink-2)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {prototype.isSensitive && (
                <div className="absolute right-4 top-4 rounded-full bg-[var(--color-praxis-accent)]/10 p-1 text-[var(--color-praxis-accent)]">
                  <Lock className="h-3 w-3" />
                </div>
              )}
            </Link>
          ))}
        </div>

        {/* Auth State for Sensitive Prototypes */}
        {hasSensitiveHidden && (
          <div className="mt-12">
            {!session ? (
              <PrototypesAuth
                locale={locale}
                title={t("auth.restrictedTitle")}
                description={t("auth.restrictedDescription")}
                buttonText={t("auth.signIn")}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--color-line-soft)] bg-[var(--color-paper)] p-12 text-center">
                <Lock className="mx-auto mb-4 h-12 w-12 text-[var(--color-ink-3)]" />
                <h3 className="mb-2 text-lg font-medium text-[var(--color-ink)]">
                  {t("auth.accessDeniedTitle")}
                </h3>
                <p className="text-[var(--color-ink-3)]">
                  {t("auth.accessDeniedDescription", { email: session.email })}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State / Coming Soon */}
        {visiblePrototypes.length === 0 && !hasSensitiveHidden && (
          <div className="rounded-xl border border-dashed border-[var(--color-line-soft)] bg-[var(--color-paper)] p-12 text-center">
            <FlaskConical className="mx-auto mb-4 h-12 w-12 text-[var(--color-ink-3)]" />
            <h3 className="mb-2 text-lg font-medium text-[var(--color-ink)]">
              {t("empty.title")}
            </h3>
            <p className="text-[var(--color-ink-3)]">
              {t("empty.description")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
