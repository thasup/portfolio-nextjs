import type { Meta, StoryObj } from '@storybook/react';
import { GlassButton } from './GlassButton';
import { ArrowRight, Sparkles } from 'lucide-react';

const meta: Meta<typeof GlassButton> = {
  title: 'Glass/GlassButton',
  component: GlassButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Interactive glassmorphism button with elevation levels, specular highlights, and liquid distortion effects. Supports hover animations and disabled states.'
      },
    },
  },
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
    children: 'Get Started',
    elevation: 'e2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard glass button with default elevation (e2). Features subtle backdrop blur and hover animations.'
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <span className="flex items-center gap-2">
        Continue <ArrowRight className="w-4 h-4" />
      </span>
    ),
    elevation: 'e2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Glass button with icon. Perfect for navigation actions and call-to-actions.'
      },
    },
  },
};

export const Specular: Story = {
  args: {
    children: (
      <span className="flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Upgrade to Pro
      </span>
    ),
    elevation: 'e3',
    specular: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Glass button with specular highlight effect that follows cursor movement. Creates a premium, interactive feel for important actions.'
      },
    },
  },
};

export const Distorted: Story = {
  args: {
    children: 'Liquid Effect',
    elevation: 'e2',
    distortion: true,
    distortionIntensity: 'medium',
    shine: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Glass button with liquid distortion and shine effects. Uses SVG filters for a unique fluid appearance. Performance-dependent.'
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    children: 'Unavailable',
    disabled: true,
    elevation: 'e2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state with reduced opacity and no hover effects.'
      },
    },
  },
};
