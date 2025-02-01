import React from "react";
import SkillBadge from "../SkillBadge";
import languageData from "../../data/skills/language.json";
import frameworkData from "../../data/skills/framework.json";
import devopsData from "../../data/skills/devops.json";
import toolData from "../../data/skills/tool.json";
import technologyData from "../../data/skills/technology.json";

const Skills = () => {
  const SkillList = ({ title, skills }) => (
    <li>
      <strong>{title}:</strong>
      <div className="skill-icon">
        {skills.map((skill) => (
          <SkillBadge
            key={skill.logo}
            id={skill.id}
            logo={skill.logo}
            color={skill.color}
            labelColor={skill.labelColor}
            width={skill.width}
          />
        ))}
      </div>
    </li>
  );

  return (
    <section id="skills" className="section-container section-bg">
      <div className="container">
        <h2>Skills</h2>

        <div className="mt-5">
          <ul className="skill-list">
            <SkillList title="Language" skills={languageData.data} />
            <SkillList title="Framework / Library" skills={frameworkData.data} />
            <SkillList title="DevOps" skills={devopsData.data} />
            <SkillList title="Tool / Platform" skills={toolData.data} />
            <SkillList title="Technology" skills={technologyData.data} />
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Skills;
