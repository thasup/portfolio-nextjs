import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './Navbar';

const meta = {
  title: 'Layout/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithScrolledBackground: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Navbar with glass panel background (simulating scrolled state)',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ paddingTop: '100px' }}>
        <Story />
        <div style={{ height: '200vh', padding: '2rem' }}>
          <p>Scroll down to see the navbar background change</p>
        </div>
      </div>
    ),
  ],
};

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
