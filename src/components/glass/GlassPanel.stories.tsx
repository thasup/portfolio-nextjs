import type { Meta, StoryObj } from '@storybook/react';
import { GlassPanel } from './GlassPanel';

const meta: Meta<typeof GlassPanel> = {
  title: 'Glass/GlassPanel',
  component: GlassPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Static glassmorphism panel container with higher default elevation. Perfect for dashboards, sidebars, and content sections that need visual separation.'
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
    distortion: {
      control: 'boolean',
    },
    distortionIntensity: {
      control: 'select',
      options: ['low', 'medium', 'high'],
    },
    shine: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassPanel>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6 w-96">
        <h3 className="text-xl font-bold mb-4">Dashboard Panel</h3>
        <p className="text-muted-foreground mb-4">
          Static glass container for organizing content with subtle depth and blur effects.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 rounded bg-primary/10 flex items-center justify-center text-sm">Widget 1</div>
          <div className="h-20 rounded bg-primary/10 flex items-center justify-center text-sm">Widget 2</div>
        </div>
      </div>
    ),
    elevation: 'e3',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard panel with e3 elevation for dashboard widgets and content sections.'
      },
    },
  },
};

export const WithDistortion: Story = {
  args: {
    children: (
      <div className="p-6 w-96">
        <h3 className="text-xl font-bold mb-4">Liquid Glass Panel</h3>
        <p className="text-muted-foreground mb-4">
          Enhanced with organic distortion effects and shine overlay for premium visual impact.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 rounded bg-primary/10 flex items-center justify-center text-sm">Premium</div>
          <div className="h-20 rounded bg-primary/10 flex items-center justify-center text-sm">Content</div>
        </div>
      </div>
    ),
    distortion: true,
    distortionIntensity: 'medium',
    shine: true,
    elevation: 'e4',
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel with liquid distortion and shine effects for enhanced visual appeal.'
      },
    },
  },
};
