"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingNav() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <nav>
        <Link href={`/${locale}/prototypes/capital-os`} className="nav-logo">
          <svg
            className="nav-logo-mark"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="32" height="32" rx="7" fill="rgba(0,201,122,0.12)" />
            <path
              d="M22 10.5C20.3 9.2 18.2 8.4 16 8.4C10.7 8.4 6.4 12.7 6.4 18C6.4 23.3 10.7 27.6 16 27.6C18.2 27.6 20.3 26.8 22 25.5"
              stroke="#00c97a"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="22" cy="10.5" r="2" fill="#00c97a" />
            <circle cx="22" cy="25.5" r="2" fill="#00c97a" />
            <path
              d="M16 13L16 18L20 18"
              stroke="rgba(0,201,122,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="16" cy="18" r="1.5" fill="#00c97a" />
          </svg>
          <span className="nav-wordmark">
            Capital<span>OS</span>
          </span>
        </Link>
        <ul className="nav-links">
          <li>
            <Link href={`#problem`}>Problem</Link>
          </li>
          <li>
            <Link href={`#agents`}>Intelligence</Link>
          </li>
          <li>
            <Link href={`#roadmap`}>Roadmap</Link>
          </li>
          <li>
            <Link href={`/${locale}/prototypes/capital-os/design`}>
              Design System
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/prototypes/capital-os/app`}
              className="nav-cta"
            >
              View Prototype
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
