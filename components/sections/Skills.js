import React from "react";
import SkillBadge from "@/components/SkillBadge";
import languageData from "@/data/skills/language.json";
import frameworkData from "@/data/skills/framework.json";
import testingData from "@/data/skills/testing.json";
import devopsData from "@/data/skills/devops.json";
import databaseData from "@/data/skills/database.json";
import osData from "@/data/skills/os.json";
import toolData from "@/data/skills/tool.json";
import technologyData from "@/data/skills/technology.json";
import learningData from "@/data/skills/currently_learning.json";

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

        <div>
          <ul className="skill-list">
            <SkillList title="Language" skills={languageData.data} />
            <SkillList title="Domain Knowledge" skills={technologyData.data} />
            <SkillList title="Framework / Library" skills={frameworkData.data} />
            <SkillList title="Testing" skills={testingData.data} />
            <SkillList title="DevOps" skills={devopsData.data} />
            <SkillList title="Database" skills={databaseData.data} />
            <SkillList title="OS" skills={osData.data} />
            <SkillList title="Tool & Platform" skills={toolData.data} />
            <SkillList title="Currently Learning" skills={learningData.data} />
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Skills;
