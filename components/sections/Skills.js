import React from "react";
import SkillBadge from "../SkillBadge";
import { data as languageData} from "../../data/skills/language.json";
import { data as frameworkData} from "../../data/skills/framework.json";
import { data as devopsData} from "../../data/skills/devops.json";
import { data as toolData} from "../../data/skills/tool.json";
import { data as technologyData} from "../../data/skills/technology.json";

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
            <SkillList title="Language" skills={languageData} />
            <SkillList title="Framework / Library" skills={frameworkData} />
            <SkillList title="DevOps" skills={devopsData} />
            <SkillList title="Tool / Platform" skills={toolData} />
            <SkillList title="Technology" skills={technologyData} />
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Skills;
