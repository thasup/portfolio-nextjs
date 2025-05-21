import React from "react";
import SkillBadge from "@/components/SkillBadge";
import languageData from "@/data/skills/language.json";
import frameworkData from "@/data/skills/framework.json";
import devopsData from "@/data/skills/devops.json";
import toolData from "@/data/skills/tool.json";
import technologyData from "@/data/skills/technology.json";
import styles from './Skills.module.scss';

interface SkillListProps {
  title: string;
  skills: Array<{
    logo: string;
    id: string;
    color: string;
    labelColor: string;
    width: number;
  }>;
}

const Skills = () => {
  const SkillList: React.FC<SkillListProps> = ({ title, skills }) => (
    <li>
      <strong>{title}:</strong>
      <div className={styles.skillItem}>
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
    <section id="skills" className={styles.skillsSection}>
      <div className={styles.container}>
        <h2>Skills</h2>

        <div>
          <ul className={styles.skillsGrid}>
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
