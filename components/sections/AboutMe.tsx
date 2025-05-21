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
              <p>That realization led me to a pivotal decision: to dedicate myself to becoming a <em>software engineer</em>.</p>
              <p>This is where my journey begins, driven by a desire to not just understand the future, but to build it.</p>
            </Row>
            {/* <Row>
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
            </Row> */}
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutMe;
