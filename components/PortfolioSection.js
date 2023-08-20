import React from 'react'
import ShowcaseSection from "../components/ShowcaseSection";
import ProjectSection from "../components/ProjectSection";

const PortfolioSection = () => {
  return (
    <section id="experience" className="section-container section-bg">
      <div className="container">
        <h2 className="text-start">Portfolio</h2>
        <ShowcaseSection />
        <ProjectSection />
      </div>
    </section>
  )
}

export default PortfolioSection