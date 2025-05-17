import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import WebImage from "@/components/WebImage";

const AboutMe = () => {
  return (
    <section id="about" className="section-container section-bg">
      <Container>
        <h2 className="text-start">About Me</h2>

        <Row>
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
                It took me 25 years until one day when I tried to create an interactive investing dashboard on Excel as a hobby on a weekend while I work as a mechanical engineer.
              </p>
              <p>
                I discover one thing while I&apos;m struck with Excel limitations and that thing has <em>profoundly changed my course of life</em> and the way I perceive how the future world will going to look like.
              </p>
              <p>It&apos;s <strong>coding.</strong></p>
              <p>
                A month passed while I was addicted to learning about web development and how programming works until I realized how powerful and amazing coding can be <em>which only limit by your competence and imagination.</em>
              </p>
              <p>
                How it can power our present world, or even further more; change our daily life. (or even my Excel dashboard)
              </p>
              <p>
                Look around us, whether it a software that we working on in the office, a website that we casually browse in the afternoon, an application that we&apos;re making a taxi call to take us home, or a streaming app that we used to watch on our smart tv.
              </p>
              <p>
                How absurd of me to not notice all of these before quickly that <em>everything behind those screens has been powered by code!</em>
                It took me more than 20 years to realize what a world I lived in.
              </p>
              <p>That&apos;s when I decided. <em>I will teach myself to become a programmer.</em></p>
              <p>That&apos;s where my story as a programmer begins.</p>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutMe;
