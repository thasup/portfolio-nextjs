import React from "react";

import StaticImage from "@/components/StaticImage";

const Experience = () => {
  return (
    <section id="experience" className="section-container section-bg">
      <div className="container">
        <h2>Experience</h2>

        <div>
          <div className="row">
            {/* Degree and Experience Section */}
            <div className="col-lg-6 mb-5" id="degree">

              {/* Degree Sub Section */}
              <h3 className="exp-title">Degree</h3>
              <div className="exp-item mt-4">
                <h5 className="exp-year">2014 - 2017</h5>
                <h4>Bachelor’s Degree in Mechanical Engineering</h4>
                <h5 className="exp-institute">
                  King Mongkut&apos;s Institute of Technology Ladkrabang
                </h5>
                <p>Bangkok, Thailand</p>
              </div>

              {/* Professional Experience Sub Section */}
              <h3 className="exp-title mt-5">Professional Experience</h3>
              <div className="exp-item mt-4">
                <h5 className="exp-year">2025 - Present</h5>
                <StaticImage
                  src={"/img/teams_by_maqe_logo.jpeg"}
                  alt={"TeamStack"}
                  width={40}
                  height={40}
                  layout={"fixed"}
                />
                <h4>Senior Frontend Engineer</h4>
                <h5 className="exp-institute">TeamStack</h5>
                <p>Remote</p>
                {/* <ul className="mb-0">
                  <li>Continue role and responsibilities as listed below.</li>
                </ul> */}
              </div>

              <div className="exp-item">
                <h5 className="exp-year">2022 - 2025</h5>
                <StaticImage
                  src={"/img/maqe_logo.jpeg"}
                  alt={"MAQE"}
                  width={40}
                  height={40}
                  layout={"fixed"}
                />
                <h4>Front-End Engineer</h4>
                <h5 className="exp-institute">MAQE Bangkok Co., Ltd.</h5>
                <p>Bangkok, Thailand</p>
                <ul className="mb-0">
                  <li>Implement the features and user interfaces of the product</li>
                  <li>
                    Architect efficient and reusable front-end systems that drive complex web
                    applications
                  </li>
                  <li>
                    Collaborate with team including Designers, QAs, Project Managers, and Software
                    Engineers to deliver compelling user-facing products
                  </li>
                  <li>
                    Identify and resolve potential issues during the development process including
                    performance and scalability issues
                  </li>
                </ul>
              </div>

              {/* <div className="exp-item">
                <h5 className="exp-year">2018 - 2021</h5>
                <h4>Mechanical, Electrical, and Plumbing Engineer</h4>
                <h5 className="exp-institute">TOPARCH Ltd.</h5>
                <p>Bangkok, Thailand</p>
                <ul className="mb-0">
                  <li>
                    Managing and coordinating several constructors as the main constructor to build
                    the 200 unit condominiums
                  </li>
                  <li>
                    Managing construction of a hospital in Maesot, a housing estate in Ladkrabang,
                    renovation of fitness, offices in Zen Tower and Central Silom as a consultant
                  </li>
                  <li>
                    Drawing an architecture planning of community mall, housing estate, resort in
                    AutoCAD and creating 3D house models in Sketchup
                  </li>
                  <li>Estimating quantity and cost of building construction or renovation</li>
                  <li>
                    Inspecting and checking the condition of condominium unit and townhouse before
                    delivery to the customer
                  </li>
                </ul>
              </div> */}
            </div>

            {/* Certification Section */}
            <div className="col-lg-6" id="certificate">
              <h3 className="edu-title">Certificate</h3>

              <div className="edu-item" id="cert4">
                <h5 className="edu-year">2025</h5>
                <h4>AWS Certified Cloud Practitioner</h4>
                <StaticImage
                  src={"/img/aws-logo.png"}
                  alt={"AWS"}
                  width={67}
                  height={40}
                  layout={"fixed"}
                />
                <p>
                  Earners of this certification have a fundamental understanding of IT services and their uses in the AWS Cloud. 
                  They demonstrated cloud fluency and foundational AWS knowledge. 
                  Badge owners are able to identify essential AWS services necessary to set up AWS-focused projects.
                </p>
                <a
                  className="btn btn-sm btn-primary"
                  target="__blank"
                  rel="noopener noreferrer"
                  role="button"
                  href="https://www.credly.com/badges/59968dd7-a269-4c22-9a06-bd0f2532556e/public_url"
                >
                  See credential
                </a>
              </div>

              <div className="edu-item" id="cert3">
                <h5 className="edu-year">2023</h5>
                <h4>TOEIC® Listening and Reading Test</h4>
                <StaticImage
                  src={"/img/ets-logo.png"}
                  alt={"ETS"}
                  width={58}
                  height={40}
                  layout={"fixed"}
                />
                <h5>Score : 915</h5>
                <p>Listening part score : 470, Reading part score : 445</p>
                <a className="btn btn-sm btn-primary" target="_blank" rel="noopener noreferrer"
                  href="https://www.dropbox.com/scl/fi/mhnp7rw0v7zk1l2ycpzzl/TOEIC-2023.jpeg?rlkey=2hxjyhes1oxfttbofr9zafey2&st=m0nuyon8&dl=0">
                  See credential
                </a>
              </div>

              <div className="edu-item" id="cert2">
                <h5 className="edu-year">2021</h5>
                <h4>Front End Web Developer Nanodegree Program</h4>
                <StaticImage
                  src={"/img/Udacity.png"}
                  alt={"Udacity"}
                  width={180}
                  height={30}
                  layout={"fixed"}
                />
                <p>
                  The goal of the Front End Web Developer Nanodegree program is
                  to equip learners with the unique skills they need to build
                  and develop a variety of websites and applications.
                </p>
                <ul>
                  <li>
                    be able to construct responsive websites using CSS, Flexbox
                    and CSS Grid
                  </li>
                  <li>
                    develop interactive websites and UI (User Interface)
                    applications using JavaScript and HTML
                  </li>
                  <li>
                    connect a web application to backend server data using
                    Node.js
                  </li>
                  <li>
                    build competency automating application build and deployment
                    using Webpack
                  </li>
                  <li>
                    improving offline performance of websites using Service
                    Worker
                  </li>
                </ul>
                <a
                  className="btn btn-sm btn-primary"
                  target="__blank"
                  rel="noopener noreferrer"
                  role="button"
                  href="https://www.dropbox.com/s/7mk3u6qpcear4x8/My_Udacity_Certification%20%28front%20end%20web%20developer%29.pdf?dl=0"
                >
                  See credential
                </a>
              </div>

              <div className="edu-item" id="cert1">
                <h5 className="edu-year">2021</h5>
                <h4>The Complete 2022 Web Development Bootcamp</h4>
                <StaticImage
                  src={"/img/Udemy.png"}
                  alt={"Udemy"}
                  width={110}
                  height={40}
                  layout={"fixed"}
                />
                <ul>
                  <li>Be able to build ANY website you want.</li>
                  <li>
                    Craft a portfolio of websites to apply for junior developer
                    jobs.
                  </li>
                  <li>
                    Build fully-fledged websites and web apps for your startup
                    or business.
                  </li>
                  <li>Master backend development with Node</li>
                  <li>Master frontend development with React</li>
                  <li>
                    Learn the latest frameworks and technologies, including
                    Javascript ES6, Bootstrap 4, MongoDB.
                  </li>
                  <li>Learn professional developer best practices.</li>
                </ul>
                <a
                  className="btn btn-sm btn-primary"
                  target="__blank"
                  rel="noopener noreferrer"
                  role="button"
                  href="https://www.dropbox.com/s/qifxvzzhrougo41/My_Udemy_Certification%20%28web%20developer%20bootcamp%29.pdf?dl=0"
                >
                  See credential
                </a>
              </div>

              <a className="see-more-btn"
                target="__blank"
                rel="noopener noreferrer"
                href="https://airtable.com/appoPztPp3kjnaI4Q/shrDV6n8ugfuxK6pK">
                See more
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
