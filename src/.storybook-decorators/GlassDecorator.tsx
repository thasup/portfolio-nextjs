import React from "react";
import { Decorator } from "@storybook/react";
import { GlassSVGFilters } from "../components/glass/GlassSVGFilters";

export const GlassDecorator: Decorator = (Story) => {
  return (
    <>
      <GlassSVGFilters />
      <Story />
    </>
  );
};
