'use client'

import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import { scrollTo } from "@/utils/helpers";

import styles from './HeroPanel.module.scss';

const HeroPanel: React.FC = () => {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!el.current) return;

    const typed = new Typed(el.current, {
      strings: [
        "Software Engineer",
        "Lifelong Learner",
        "AI Enthusiast",
        "Mechanical Engineer",
        "Self-taught Programmer",
      ],
      loop: true,
      startDelay: 0,
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 2000,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  const handleScrollTo = () => {
    scrollTo('about');
  }

  return (
    <div
      id="hero"
      className={styles.heroPanel}
    >
      <div className={styles.titleContainer}>
        <p className={styles.title}>
          <span ref={el}></span>
        </p>
        <a className={styles.scrollButton} onClick={handleScrollTo}>
          <i className="fas fa-chevron-down"></i>
        </a>
      </div>
    </div>
  );
};

export default HeroPanel;
