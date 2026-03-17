import type { Meta, StoryObj } from '@storybook/react';
import { GlassCard } from './GlassCard';
import { Sparkles } from 'lucide-react';

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
    docs: {
      description: {
        component: 'Versatile glassmorphism card component with multiple elevation levels, hover states, and interactive effects. Supports specular highlights, liquid distortion, and shine overlays for premium visual experiences.'
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlassCard>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6 max-w-sm">
        <h3 className="text-lg font-semibold mb-2">Welcome</h3>
        <p className="text-muted-foreground">Experience glassmorphism design with subtle backdrop blur and elegant transparency effects.</p>
      </div>
    ),
    elevation: 'e2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard glass card with default elevation (e2) and subtle backdrop blur.'
      },
    },
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
    children: (
      <div className="p-6 max-w-sm">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Premium Feature
        </h3>
        <p className="text-muted-foreground">Move your cursor to reveal specular lighting that follows your movement.</p>
      </div>
    ),
    specular: true,
    interactive: true,
    elevation: 'e3',
  },
  parameters: {
    docs: {
      description: {
        story: 'Card with specular highlight effect that tracks cursor position. Creates a premium, interactive experience.'
      },
    },
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
