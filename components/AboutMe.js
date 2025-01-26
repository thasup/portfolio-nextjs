import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import WebImage from "./WebImage";

const AboutMe = () => {
  return (
    <section id="about" className="section-container section-bg">
      <Container>
        <h2 className="text-start">About Me</h2>

        <Row className="mt-5">
          <Col
            md={4}
            className="p-3 profile-image d-flex justify-content-center"
          >
            <WebImage
              src={
                "https://res.cloudinary.com/thasup/image/upload/w_600,f_auto/v1654267591/portfolio/IMG_71362_phuw5y.png"
              }
              width={250}
              height={250}
              layout={"fixed"}
              alt="profile picture"
            />
          </Col>
          <Col md={8} className="align-self-center">
            <Row>
              <h3>Thanachon Supasatian</h3>
              <p>
                A self-taught programmer and former mechanical engineer who
                strongly believes man can do anything as long as he/she has the
                willpower and passion to do it.
              </p>
              <p>
                Believing in your potential that you can do it and you also can
                become a better person help overcome difficult challenges that
                life might throw at you. Having good friends can also help it.
                Working as a team is a powerful tool that humans build our
                civilization for a thousand years.
              </p>
              <p>
                With a good mindset, great teamwork. Anything can be done, any
                problem can be solved. Nothing is going to hold you from your
                success.
              </p>
              <p>
                Learning how to code is by far the best decision of my life. It
                is marvelous and powerful. It opens the way I can put my
                creativity and technical skills to make things come true.
              </p>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutMe;
