import React from "react";

const HeroPanel = () => {
  return (
    <div
      id="hero"
      className="d-flex flex-column align-items-center justify-content-center"
    >
      <h1 className="hero-title text-center">Hi! I am Thanachon</h1>
      <p className="hero-subtitle text-center">
        <span
          className="typed"
          data-typed-items="Full-stack Developer, Front-End Developer, Self-taught Programmer, Mechanical Engineer"
        ></span>
      </p>
      <a className="btn-started">
        <i className="fas fa-chevron-down"></i>
      </a>
    </div>
  );
};

export default HeroPanel;
