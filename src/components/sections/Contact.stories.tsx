import type { Meta, StoryObj } from "@storybook/react";
import { Contact } from "./Contact";

const meta = {
  title: "Sections/Contact",
  component: Contact,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Contact>;

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

export const InteractiveForm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Contact form with validation, showing how errors appear when fields are invalid",
      },
    },
  },
};
