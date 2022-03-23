import React from "react";
import { Button, Col, Row } from "react-bootstrap";

const Showcase = ({
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
          <h3>{title}</h3>

          <span className="badge rounded-pill bg-primary ms-2">{scale}</span>
        </div>

        <h5 className="mb-3">{headline}</h5>
        {description}

        <div className="tech-tag">
          {tagsArray.map((tag, index) => (
            <Button key={index} variant="outline-primary" className="btn-xsm">
              {tag}
            </Button>
          ))}
        </div>

        <div className="mt-3 showcase-link">
          <Button
            variant="primary"
            className="me-2"
            href={demoLink}
            target="blank"
          >
            <i className="fas fa-globe-americas"></i> LIVE DEMO
          </Button>

          <Button variant="primary" href={githubLink} target="blank">
            <i className="fab fa-github"></i> GITHUB
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default Showcase;
