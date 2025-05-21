import React from "react";

import WebImage from "@/components/WebImage";

import styles from './SkillBadge.module.scss';

interface SkillBadgeProps {
  id: string;
  logo: string;
  color: string;
  labelColor: string;
  width: number;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ id, logo, color, labelColor, width }) => {
  const srcUrl = `https://img.shields.io/badge/-${id}-${labelColor}?style=flat&logo=${logo}&logoColor=${color}&labelColor=${color}`;
  return (
    <WebImage
      className={styles.skillTag}
      src={srcUrl}
      height={20}
      width={width}
      alt={`${id} badge`}
    />
  );
};

export default SkillBadge;
