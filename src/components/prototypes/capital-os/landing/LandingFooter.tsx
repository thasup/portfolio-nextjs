"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export function LandingFooter() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  return (
    <>
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
                <a href={`#problem`}>Problem</a>
              </li>
              <li>
                <a href={`#agents`}>Intelligence</a>
              </li>
              <li>
                <a href={`#roadmap`}>Roadmap</a>
              </li>
              <li>
                <a href={`#brand`}>Design System</a>
              </li>
              <li>
                <a href={`#architecture`}>Architecture</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
