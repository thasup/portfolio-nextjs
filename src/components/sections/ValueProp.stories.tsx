import type { Meta, StoryObj } from "@storybook/react";
import { ValueProp } from "./ValueProp";

const meta = {
  title: "Sections/ValueProp",
  component: ValueProp,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ValueProp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  globals: {
    theme: "dark",
  },
};

export const LightTheme: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
  globals: {
    theme: "light",
  },
};

export const WithSpecularHighlight: Story = {
  parameters: {
    docs: {
      description: {
        story: "Value proposition cards with specular highlights on hover",
      },
    },
  },
};

export const WithDistortion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Value proposition cards with liquid distortion effect (performance permitting)",
      },
    },
  },
};
