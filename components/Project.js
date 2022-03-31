import React from "react";
import { Button, Col } from "react-bootstrap";

const Project = ({
  image,
  title,
  description,
  tagsArray,
  demoLink,
  githubLink,
}) => {
  tagsArray = [
    "Microservices",
    "ReactJS",
    "NextJS",
    "Docker",
    "Kubernetes",
    "TypeScript",
    "MongoDB",
    "Github Action",
  ];
  return (
    <Col
      lg={4}
      md={6}
      className="portfolio-item filter-app filter-node filter-bootstrap filter-scss filter-api"
    >
      <div className="portfolio-wrap">
        {image}
        <div className="portfolio-info d-flex flex-column align-items-center">
          <a href={demoLink} target="blank" title="Website">
            {title}
          </a>
          {description}
          <div className="tech-tag">
            {tagsArray.map((tag, index) => (
              <Button key={index} variant="outline-light" className="btn-xsm">
                {tag}
              </Button>
            ))}
          </div>

          <div className="portfolio-links d-flex flex-row">
            <a href={demoLink} target="blank" title="Website" className="me-3">
              <i className="fas fa-globe-americas"></i>
            </a>

            <a href={githubLink} target="blank" title="Github">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default Project;
