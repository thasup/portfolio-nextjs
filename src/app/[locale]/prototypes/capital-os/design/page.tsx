"use client";

import { useEffect } from "react";
import "../landing.css";

import { LandingNav } from "@/components/prototypes/capital-os/landing/LandingNav";
import { LandingBrand } from "@/components/prototypes/capital-os/landing/LandingBrand";
import { LandingFooter } from "@/components/prototypes/capital-os/landing/LandingFooter";

export default function CapitalOSDesignPage() {
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursor-ring");

    if (!cursor || !ring) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
    };

    const handleHover = () => {
      ring.style.width = "48px";
      ring.style.height = "48px";
      ring.style.borderColor = "var(--emerald-bright)";
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
    };

    const handleHoverOut = () => {
      ring.style.width = "32px";
      ring.style.height = "32px";
      ring.style.borderColor = "rgba(0,201,122,0.4)";
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    };

    window.addEventListener("mousemove", moveCursor);

    const interactiveElements = document.querySelectorAll(
      "a, button, .agent-card",
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHover);
      el.addEventListener("mouseleave", handleHoverOut);
    });

    const reveals = document.querySelectorAll(".reveal");
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const elementVisible = 100;
      reveals.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("scroll", revealOnScroll);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHover);
        el.removeEventListener("mouseleave", handleHoverOut);
      });
    };
  }, []);

  return (
    <div className="capitalos-landing">
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursor-ring"></div>

      <LandingNav />
      {/* Add some top padding so the nav doesn't overlap the content immediately */}
      <div style={{ paddingTop: "80px" }}></div>
      <LandingBrand />
      <LandingFooter />
    </div>
  );
}
