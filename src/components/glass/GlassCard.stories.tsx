import type { Meta, StoryObj } from '@storybook/react';
import { GlassCard } from './GlassCard';

const meta: Meta<typeof GlassCard> = {
  title: 'Glass/GlassCard',
  component: GlassCard,
  tags: ['autodocs'],
  argTypes: {
    elevation: {
      control: 'select',
      options: ['e1', 'e2', 'e3', 'e4', 'e5'],
      description: 'Glass elevation level controlling blur and depth',
    },
    hover: {
      control: 'boolean',
      description: 'Enable hover lift animation',
    },
    interactive: {
      control: 'boolean',
      description: 'Make card interactive with motion',
    },
    specular: {
      control: 'boolean',
      description: 'Enable mouse-tracking highlight',
    },
    distortion: {
      control: 'boolean',
      description: 'Enable liquid distortion effect',
    },
    distortionIntensity: {
      control: 'select',
      options: ['low', 'medium', 'high'],
      description: 'Intensity of the liquid distortion',
    },
    shine: {
      control: 'boolean',
      description: 'Enable edge shine',
    },
    children: {
      control: 'text',
      description: 'Card content',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof GlassCard>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2">Glass Card</h3>
        <p className="text-muted-foreground">This is a standard glass card with default elevation (e2).</p>
      </div>
    ),
    elevation: 'e2',
  },
};

export const Interactive: Story = {
  args: {
    ...Default.args,
    interactive: true,
    hover: true,
  },
};

export const WithSpecular: Story = {
  args: {
    ...Default.args,
    elevation: 'e3',
    specular: true,
    children: (
      <div className="p-6">
        <h3 className="text-lg font-bold mb-2">Specular Highlight</h3>
        <p className="text-muted-foreground">Move your mouse over this card to see the highlight effect.</p>
      </div>
    ),
  },
};

export const LiquidDistortion: Story = {
  args: {
    ...Default.args,
    elevation: 'e3',
    distortion: true,
    distortionIntensity: 'medium',
    shine: true,
    children: (
      <div className="p-6 relative z-10">
        <h3 className="text-lg font-bold mb-2">Liquid Distortion</h3>
        <p className="text-muted-foreground">
          This card features the organic liquid distortion effect with edge shine.
        </p>
      </div>
    ),
  },
};

export const HighDistortion: Story = {
  args: {
    ...LiquidDistortion.args,
    distortionIntensity: 'high',
    children: (
      <div className="p-6 relative z-10">
        <h3 className="text-lg font-bold mb-2">High Intensity</h3>
        <p className="text-muted-foreground">
          Stronger refraction for dramatic effect.
        </p>
      </div>
    ),
  },
};
