import React from "react";

import StaticImage from "../StaticImage";
import { scrollTo } from "../../utils/helpers";

const CustomHeader = () => {
  const navItems = [
    { id: 'about-link', text: 'About Me', sectionId: 'about' },
    { id: 'skills-link', text: 'Skills', sectionId: 'skills' },
    { id: 'experience-link', text: 'Experience', sectionId: 'experience' },
    { id: 'portfolio-link', text: 'Portfolio', sectionId: 'portfolio' },
    { id: 'resume-link', text: 'Resume', sectionId: 'resume' },
    { id: 'contact-link', text: 'Contact', sectionId: 'contact' },
  ];

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
            {navItems.map((item) => (
              <li key={item.id} className="nav-item">
                <a className="nav-link sections-name" id={item.id} onClick={() => scrollTo(item.sectionId)}>
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default CustomHeader;
