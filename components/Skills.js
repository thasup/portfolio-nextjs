import React from "react";
import SkillBadge from "./SkillBadge";
import languageData from "../data/skills/language.json";
import frameworkData from "../data/skills/framework.json";

const Skills = () => {
  const languageSkills = () => {
    return (
      languageData.data.map((skill) => {
        return (
          <SkillBadge
            key={skill.logo}
            id={skill.id}
            logo={skill.logo}
            color={skill.color}
            labelColor={skill.labelColor}
            width={skill.width}
          />
        )
      })
    )
  }

  const frameworkSkills = () => {
    return (
      frameworkData.data.map((skill) => {
        return (
          <SkillBadge
            key={skill.logo}
            id={skill.id}
            logo={skill.logo}
            color={skill.color}
            labelColor={skill.labelColor}
            width={skill.width}
          />
        )
      })
    )
  }

  return (
    <section id="skills" className="section-container section-bg">
      <div className="container">
        <h2>Skills</h2>

        <div className="mt-5">
          <ul className="skill-list">
            <li>
              <strong>Language:</strong>
              <div className="skill-icon">
                {languageSkills()}
              </div>
            </li>
            <li>
              <strong>Framework/Library:</strong>
              <div className="skill-icon">
                {frameworkSkills()}
              </div>
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
