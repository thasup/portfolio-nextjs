import React from "react";
import { Form } from "react-bootstrap";

const Contact = () => {
  return (
    <section id="contact" className="section-container section-bg">
      <div className="container">
        <h2>Contact</h2>
        <div className="row align-items-start mt-5">
          <div className="col-md-6">
            <div className="contact-info d-flex flex-row pt-3">
              <i className="fas fa-map-marker-alt"></i>
              <div className="d-flex flex-column ms-3">
                <h4>Location:</h4>
                <p>Bangkok</p>
              </div>
            </div>
            <div className="contact-info d-flex flex-row pt-3">
              <i className="far fa-envelope"></i>
              <div className="d-flex flex-column ms-3">
                <h4>Email:</h4>
                <p>thanachonfirst@hotmail.com</p>
              </div>
            </div>
            <div className="social-links pt-3">
              <a href="https://thanachon.me" className="website" target="blank">
                <i className="fas fa-globe-americas"></i>
              </a>
              <a
                href="https://github.com/thasup"
                className="github"
                target="blank"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/thanachon-supasatian-278292159/"
                className="linkedin"
                target="blank"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="col-md-6">
            <Form method="post" role="form" data-netlify="true">
              <Form.Group>
                <Form.Label for="name">Your Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  id="name"
                  placeholder="John Doe"
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label for="email">Your Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  id="email"
                  placeholder="johndoe@email.com"
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label for="subject">Subject</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  id="subject"
                  placeholder="Subject"
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label for="message">Message</Form.Label>
                <Form.Control
                  type="textarea"
                  name="message"
                  rows="5"
                  placeholder="Message"
                  required
                ></Form.Control>
              </Form.Group>

              <div className="text-center mt-3">
                <button type="submit" className="btn btn-success">
                  Send Message
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
