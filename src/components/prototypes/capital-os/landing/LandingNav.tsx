"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingNav() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
      <nav>
        <Link href={`/${locale}/prototypes/capital-os`} className="nav-logo">
          <Image
            src="/capital_os/icons/capital_os-icon.png"
            alt="CapitalOS"
            width={32}
            height={32}
            className="nav-logo-mark"
          />
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
