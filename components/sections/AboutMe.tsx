import React from "react";

import { Container, Row, Col } from "react-bootstrap";

import WebImage from "@/components/WebImage";

import styles from "./AboutMe.module.scss";

const AboutMe = () => {
  return (
    <section id="about" className={`section-container ${styles['about-me-section']}`}>
      <Container>
        <h2 className="about-me-title mb-4">About Me</h2>
        <Row>
          <Col
            md={4}
            className={`p-3 ${styles.profileImage} d-flex justify-content-center`}
          >
            <WebImage
              src="https://res.cloudinary.com/thasup/image/upload/w_600,f_auto/v1654267591/portfolio/IMG_71362_phuw5y.png"
              width={250}
              height={250}
              alt="Profile picture of Thanachon Supasatian"
            />
          </Col>
          <Col md={8} className="d-flex flex-column justify-content-center">
            <h3 className="mb-3">Thanachon Supasatian</h3>
            <div className={styles["about-me-description"]}>
              <p>
                For 3 years, I walked a different path as a mechanical engineer, working in construction management consultant company.
              </p>
              <p>
                Then, a simple weekend project—building an interactive investing dashboard in Excel—ignited a spark. Hitting the limitations of my tools, I stumbled upon something that would fundamentally reshape my perspective: <strong>code</strong>.
              </p>
              <p>
                What began as a hobby quickly transformed into an all-consuming passion. I was mesmerized by the power of web development and the limitless possibilities that coding unlocks.
              </p>
              <p>
                It&apos;s a force shaping the world around us, from the software we use at work to the apps that seamlessly manage our lives. I realized I was surrounded by a world powered by code, and I hadn&apos;t truly seen it before.
              </p>
              <p>
                That realization led me to a pivotal decision: to dedicate myself to becoming a <em>software engineer</em>.
              </p>
              <p>
                This is where my journey begins, driven by a desire to not just understand the future, but to build it.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutMe;
