import React from "react";

const Contact = () => {
  return (
    <section id="contact" className="section-container section-bg">
      <div className="container">
        <h2>Contact</h2>

        <div className="row align-items-start">
          <div className="col-md-6">
            <div className="contact-info d-flex flex-row pt-3">
              <i className="fas fa-map-marker-alt"></i>
              <div className="d-flex flex-column ms-3">
                <h4>Location:</h4>
                <p>Bangkok, Thailand</p>
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
              <a
                href="https://thanachon.me"
                className="website"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fas fa-globe-americas"></i>
              </a>
              <a
                href="https://github.com/thasup"
                className="github"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-github"></i>
              </a>
              <a
                href="https://www.linkedin.com/in/thanachon-supasatian-278292159/"
                className="linkedin"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="col-md-6">
            <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
              <input type="hidden" name="form-name" value="contact" />
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Your Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Your Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="johndoe@example.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="subject" className="form-label">
                  Subject
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="subject"
                  name="subject"
                  placeholder="Subject"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Your message..."
                  required
                ></textarea>
              </div>

              <div className="text-center mt-4">
                <button type="submit" className="btn btn-success px-4 py-2">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
