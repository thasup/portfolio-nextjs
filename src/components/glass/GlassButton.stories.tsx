import type { Meta, StoryObj } from '@storybook/react';
import { GlassButton } from './GlassButton';
import { ArrowRight, Sparkles } from 'lucide-react';

const meta: Meta<typeof GlassButton> = {
  title: 'Glass/GlassButton',
  component: GlassButton,
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: 'select',
      options: ['e1', 'e2', 'e3', 'e4', 'e5'],
    },
    specular: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    distortion: {
      control: 'boolean',
    },
    shine: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof GlassButton>;

export const Default: Story = {
  args: {
    children: 'Click Me',
    elevation: 'e2',
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <span className="flex items-center gap-2">
        Next Step <ArrowRight className="w-4 h-4" />
      </span>
    ),
    elevation: 'e2',
  },
};

export const Specular: Story = {
  args: {
    children: (
      <span className="flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Premium Action
      </span>
    ),
    elevation: 'e3',
    specular: true,
  },
};

export const Distorted: Story = {
  args: {
    children: 'Liquid Button',
    elevation: 'e2',
    distortion: true,
    shine: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};
