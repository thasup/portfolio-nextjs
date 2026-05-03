"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingFooter() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-meta">
            <span>Capital</span>OS · Personal Financial Intelligence System
            <br />
            Built by <span>First (Thanachon Supasatian)</span> · Khon Kaen,
            Thailand · May 2026
          </div>
          <ul className="footer-links">
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
              <Link href={`#architecture`}>Architecture</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
