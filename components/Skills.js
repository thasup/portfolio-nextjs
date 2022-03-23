import React from "react";

const Skills = () => {
  return (
    <section id="skills" className="section-container section-bg">
      <div className="container">
        <h2>Skills</h2>

        <div className="mt-5">
          <ul className="skill-list">
            <li>
              <strong>Language:</strong>
              <p>JavaScript, TypeScript, HTML, CSS, SCSS</p>
            </li>
            <li>
              <strong>Framework/Library:</strong>
              <p>
                ReactJS, NextJS, NodeJS, jQuery, Bootstrap, Material UI, Ant
                Design, Jest
              </p>
            </li>
            <li>
              <strong>Database:</strong>
              <p>MongoDB</p>
            </li>
            <li>
              <strong>Infrastructure:</strong>
              <p>Docker, Kubernetes, GitHub Action, GCP, DigitalOcean</p>
            </li>
            <li>
              <strong>Tool:</strong>
              <p>Git, Postman, Git Bash, Gulp, Webpack</p>
            </li>
            <li>
              <strong>Technology:</strong>
              <p>RESTful API, Microservices</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Skills;
