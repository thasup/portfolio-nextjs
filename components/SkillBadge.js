import React from "react";

const normalizeLogo = (id, logo) => {
  const map = {
    "Github_Actions": "githubactions",
    "AWS": "amazonaws",
    "Jira": "jira",
    "LangChain": "openai"
  };
  return map[id] || logo;
};

const hexToRgb = (hex) => {
  const clean = hex.replace('#','');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const getReadableLogoColor = (bgHex) => {
  // YIQ contrast
  try {
    const { r, g, b } = hexToRgb(bgHex);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 150 ? "000000" : "ffffff";
  } catch {
    return "ffffff";
  }
};

const SkillBadge = ({ id, logo, color, labelColor }) => {
  const encodedId = encodeURIComponent(id);
  const bg = (labelColor || "555").replace('#','');
  const logoSlug = normalizeLogo(id, logo);
  const logoColor = (color && color.length <= 6 ? color : getReadableLogoColor(bg)).replace('#','');
  const srcUrl = `https://img.shields.io/badge/-${encodedId}-${bg}?style=flat&logo=${logoSlug}&logoColor=${logoColor}`;
  return (
    <img
      src={srcUrl}
      alt={`${id} badge`}
      height={20}
      style={{ height: 20, width: "auto" }}
      loading="lazy"
      decoding="async"
    />
  );
};

export default SkillBadge;