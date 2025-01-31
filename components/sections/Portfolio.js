import React from "react";
import ShowcaseSection from "../ShowcaseSection";
import ProjectSection from "../ProjectSection";

const Portfolio = () => {
  return (
    <section id="portfolio" className="section-container section-bg">
      <div className="container">
        <h2 className="text-start">Portfolio</h2>

        <ShowcaseSection />

        <div className="mt-5">
          <div className="col-12 d-flex flex-column align-items-center justify-content-center filters-section">
            <ul className="portfolio-filters primary-filters" id="primary">
              <li data-filter="*" className="filter-active">
                all
              </li>
              <li data-filter=".filter-app">web app</li>
              <li data-filter=".filter-web">web</li>
              <li data-filter=".filter-game">game</li>
            </ul>

            <a className="filters-more">
              <i className="fas fa-chevron-down"></i>
            </a>

            <ul className="portfolio-filters secondary-filters" id="secondary">
              <li data-filter="*" className="filter-active">
                all
              </li>
              <li data-filter=".filter-react">react</li>
              <li data-filter=".filter-node">node</li>
              <li data-filter=".filter-next">next</li>
              <li data-filter=".filter-bootstrap">bootstrap</li>
              <li data-filter=".filter-mongodb">mongodb</li>
              <li data-filter=".filter-docker">docker</li>
              <li data-filter=".filter-scss">scss</li>
              <li data-filter=".filter-typescript">typescript</li>
              <li data-filter=".filter-api">api</li>
            </ul>
          </div>

          <div className="row portfolio-container">
            <ProjectSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
