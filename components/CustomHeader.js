import React from "react";

import StaticImage from "./StaticImage";

const CustomHeader = () => {
  return (
    <header
      id="navbar"
      className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top"
    >
      <div className="container-fluid">
        <a className="navbar-brand d-flex flex-row align-items-center">
          <StaticImage
            src={"/favicon.ico"}
            alt={"website_logo"}
            width={30}
            height={30}
            className="logo-nav"
            layout={"fixed"}
          />
          <span className="ms-2">Thanachon Portfolio</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link sections-name" id="about-link">
                About Me
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link sections-name" id="skills-link">
                Skills
              </a>
            </li>
            <li className="nav-item nav-dropdown">
              <a className="nav-link sections-name" id="experience-link">
                Experience
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link sections-name" id="portfolio-link">
                Portfolio
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link sections-name" id="resume-link">
                Resume
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link sections-name" id="contact-link">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default CustomHeader;
