import React from "react";
import { Button, Col, Row } from "react-bootstrap";

const ShowcaseItem = ({
  image,
  title,
  scale,
  headline,
  description,
  tagsArray,
  demoLink,
  githubLink,
}) => {
  return (
    <Row className="showcase py-5">
      <Col md={6} className="showcase-img">
        {image}
      </Col>
      <Col md={6} className="showcase-info d-flex flex-column">
        <div className="d-flex flex-row align-items-center">
          <h3 className="mb-0">{title}</h3>

          <span className="badge rounded-pill bg-primary ms-2">{scale}</span>
        </div>

        <h5 className="mb-0 text-italic">{headline}</h5>
        <div className="desc-container d-flex flex-column">{description}</div>

        <div className="tech-tag">
          {tagsArray.map((tag, index) => (
            <Button key={index} variant="outline-primary" className="btn-xsm">
              {tag}
            </Button>
          ))}
        </div>

        <div className="mt-3 showcase-link">
          {demoLink && (
            <Button
              variant="primary"
              className="me-2"
              href={demoLink}
              target="__blank"
              rel="noopener noreferrer"
            >
              <i className="fas fa-globe-americas"></i> LIVE DEMO
            </Button>
          )}

          <Button
            variant="primary"
            href={githubLink}
            target="__blank"
            rel="noopener noreferrer"
            disabled={!githubLink}
          >
            <i className="fab fa-github"></i> GITHUB
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default ShowcaseItem;
