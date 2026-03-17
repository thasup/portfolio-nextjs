import type { Meta, StoryObj } from '@storybook/react';
import { GlassPanel } from './GlassPanel';

const meta: Meta<typeof GlassPanel> = {
  title: 'Glass/GlassPanel',
  component: GlassPanel,
  tags: ['autodocs'],
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
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof GlassPanel>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-xl font-bold mb-4">Glass Panel</h3>
        <p className="text-muted-foreground mb-4">
          Panels are static containers with higher default elevation (e3) and padding.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-20 rounded bg-black/10"></div>
          <div className="h-20 rounded bg-black/10"></div>
        </div>
      </div>
    ),
    elevation: 'e3',
  },
};

export const WithDistortion: Story = {
  args: {
    ...Default.args,
    distortion: true,
    distortionIntensity: 'medium',
    shine: true,
  },
};
