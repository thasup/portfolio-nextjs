import React from "react";
import Image from "next/image";

const Education = () => {
  return (
    <section id="education" className="section-container section-bg">
      <div className="container">
        <h2>Education</h2>

        <div className="mt-5">
          <div className="row">
            <div className="col-lg-6 mb-5" id="degree">
              <h3 className="edu-title">Degree</h3>
              <div className="edu-item mt-4">
                <h5 className="edu-year">2014 - 2017</h5>
                <h4>Bachelor’s Degree in Mechanical Engineering</h4>
                <h5 className="edu-institute">
                  King Mongkut&apos;s Institute of Technology Ladkrabang
                </h5>
                <p>Bangkok, Thailand</p>
              </div>
            </div>

            <div className="col-lg-6" id="certificate">
              <h3 className="edu-title">Certificate</h3>

              <div className="edu-item mt-4 mb-5" id="cert1">
                <h5 className="edu-year">2022</h5>
                <h4>TOEIC® Listening and Reading Test</h4>
                <h5>Score : 890</h5>
                <h5 className="edu-institute">ETS</h5>
                <p>Listening part score : 480, Reading part score : 410</p>
                <a
                  className="btn btn-sm btn-primary"
                  target="blank"
                  href="https://www.dropbox.com/s/9a1ylcljptv75vq/TOEIC%201-2-2022.pdf?dl=0"
                >
                  See credential
                </a>
              </div>

              <div className="edu-item my-5" id="cert2">
                <h5 className="edu-year">2021</h5>
                <h4>Front End Web Developer Nanodegree Program</h4>
                <Image
                  src="/img/Udacity.png"
                  alt="Udacity"
                  width="180"
                  height="30"
                  layout="fixed"
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
                  target="blank"
                  href="https://www.dropbox.com/s/7mk3u6qpcear4x8/My_Udacity_Certification%20%28front%20end%20web%20developer%29.pdf?dl=0"
                >
                  See credential
                </a>
              </div>

              <div className="edu-item my-5" id="cert3">
                <h5 className="edu-year">2021</h5>
                <h4>The Complete 2022 Web Development Bootcamp</h4>
                <Image
                  src="/img/Udemy.png"
                  alt="Udemy"
                  width="100"
                  height="40"
                  layout="fixed"
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
                  target="blank"
                  href="https://www.dropbox.com/s/qifxvzzhrougo41/My_Udemy_Certification%20%28web%20developer%20bootcamp%29.pdf?dl=0"
                >
                  See credential
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
