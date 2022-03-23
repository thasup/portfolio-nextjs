import React from "react";

const Resume = () => {
  return (
    <section
      id="resume"
      className="section-container section-shadow paralax bg-image"
    >
      <div className="paralax-overlay"></div>
      <div className="container-md position-relative">
        <div className="d-flex flex-row flex-wrap align-items-center justify-content-center">
          <h3 className="text-center text-uppercase mx-3">
            Click to download resume here
          </h3>
          <a
            className="btn btn-light btn-lg text-uppercase my-3"
            target="blank"
            href="https://www.dropbox.com/s/05p4h3qpqedcr84/resume%20standard%2001.pdf?dl=0"
          >
            Download
          </a>
        </div>
      </div>
    </section>
  );
};

export default Resume;
