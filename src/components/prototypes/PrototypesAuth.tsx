"use client";

import { createClient } from "@/utils/supabase/client";
import { LogIn } from "lucide-react";

interface PrototypesAuthProps {
  locale: string;
  title: string;
  description: string;
  buttonText: string;
}

export function PrototypesAuth({
  locale,
  title,
  description,
  buttonText,
}: PrototypesAuthProps) {
  const getURL = () => {
    let url =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXT_PUBLIC_VERCEL_URL ??
      "http://localhost:3000";

    url = url.startsWith("http") ? url : `https://${url}`;
    url = url.endsWith("/") ? url.slice(0, -1) : url;

    if (typeof window !== "undefined") {
      url = window.location.origin;
    }

    return url;
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${getURL()}/auth/callback?next=/${locale}/prototypes`,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-line-soft)] bg-[var(--color-paper)] p-12 text-center shadow-sm">
      <div className="mb-6 rounded-full bg-[var(--color-praxis-accent)]/10 p-4">
        <LogIn className="h-8 w-8 text-[var(--color-praxis-accent)]" />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-[var(--color-ink)]">
        {title}
      </h2>
      <p className="mb-8 max-w-md text-[var(--color-ink-3)]">{description}</p>
      <button
        onClick={signInWithGoogle}
        className="flex items-center justify-center gap-3 rounded-xl bg-[var(--color-ink)] px-8 py-3 text-sm font-medium text-[var(--color-paper)] transition-all hover:bg-[var(--color-ink-2)] hover:shadow-lg active:scale-[0.98]"
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
            fill="#EA4335"
          />
        </svg>
        {buttonText}
      </button>
    </div>
  );
}
