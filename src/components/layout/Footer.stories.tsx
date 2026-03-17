import type { Meta, StoryObj } from '@storybook/react';
import { Footer } from './Footer';

const meta = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  globals: {
    theme: 'dark',
  },
};

export const LightTheme: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  globals: {
    theme: 'light',
  },
};

export const WithCustomBackground: Story = {
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Story />
      </div>
    ),
  ],
};
