import React, { useEffect, useRef } from "react";
import Typed from "typed.js";

import { scrollTo } from "../../utils/helpers";

const HeroPanel = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "Front-End Developer",
        "Self-taught Programmer",
        "Mechanical Engineer",
        "Lifelong Learner",
      ],
      loop: true,
      startDelay: 0,
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 2000,
    });

    // Destropying
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
      className="d-flex flex-column align-items-center justify-content-center"
    >
      <div className="hero-title-container">
        <h1 className="hero-title text-center">Hi! I am Thanachon</h1>
        <p className="hero-subtitle text-center">
          <span ref={el}></span>
        </p>
        <a className="btn-started" onClick={handleScrollTo}>
          <i className="fas fa-chevron-down"></i>
        </a>
      </div>
    </div>
  );
};

export default HeroPanel;
