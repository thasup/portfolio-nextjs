import React from "react";
import { Button, Col } from "react-bootstrap";

const ProjectItem: React.FC<{
  image: string;
  title: string;
  description: string;
  tags: string[];
  demoLink?: string;
  githubLink?: string;
}> = ({
  image,
  title,
  description,
  tags,
  demoLink,
  githubLink,
}) => {
  return (
    <Col
      lg={4}
      md={6}
      className="portfolio-item filter-app filter-node filter-bootstrap filter-scss filter-api"
    >
      <div className="portfolio-wrap">
        {image}
        <div className="portfolio-info d-flex flex-column align-items-center">
          <a href={demoLink} target="__blank" rel="noopener noreferrer" title="Website">
            {title}
          </a>
          <p>{description}</p>
          <div className="tech-tag">
            {tags?.map((tag, index) => (
              <Button key={index} variant="outline-light" className="btn-xsm">
                {tag}
              </Button>
            ))}
          </div>

          <div className="portfolio-links d-flex flex-row">
            <a href={demoLink} target="__blank" rel="noopener noreferrer" title="Website" className="me-3">
              <i className="fas fa-globe-americas"></i>
            </a>

            <a href={githubLink} target="__blank" rel="noopener noreferrer" title="Github">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProjectItem;
