import React from "react";

import WebImage from "@/components/WebImage";

import styles from './Skills.module.scss';

const SkillBadge = ({ id, logo, color, labelColor, width }) => {
  const srcUrl = `https://img.shields.io/badge/-${id}-${labelColor}?style=flat&logo=${logo}&logoColor=${color}&labelColor=${color}`;
  return (
    <WebImage
      className="{styles.skillTag}"
      src={srcUrl}
      height={20}
      width={width}
      alt={`${id} badge`}
      layout="fixed"
    />
  );
};

export default SkillBadge;
