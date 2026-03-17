import type { Meta, StoryObj } from '@storybook/react';
import { GlassModal } from './GlassModal';
import { useState } from 'react';
import { GlassButton } from './GlassButton';

const meta: Meta<typeof GlassModal> = {
  title: 'Glass/GlassModal',
  component: GlassModal,
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
    },
    elevation: {
      control: 'select',
      options: ['e1', 'e2', 'e3', 'e4', 'e5'],
    },
    distortion: {
      control: 'boolean',
    },
    shine: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'fullscreen', // Modals need fullscreen layout
  },
};

export default meta;
type Story = StoryObj<typeof GlassModal>;

// Render function to handle state
const ModalWithState = (args: any) => {
  const [isOpen, setIsOpen] = useState(args.open || false);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-dots p-8">
      <GlassButton onClick={() => setIsOpen(true)}>Open Modal</GlassButton>
      
      <GlassModal 
        {...args} 
        open={isOpen} 
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Glass Modal</h2>
          <p className="text-muted-foreground">
            This modal uses a high-elevation glass effect with optional distortion.
            It sits on top of the content and traps focus.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <GlassButton onClick={() => setIsOpen(false)} elevation="e2">
              Cancel
            </GlassButton>
            <GlassButton onClick={() => setIsOpen(false)} elevation="e3" specular>
              Confirm
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    open: true, // Start open for autodocs/screenshot
    elevation: 'e4',
  },
};

export const LiquidDistortion: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    open: true,
    elevation: 'e4',
    distortion: true,
    distortionIntensity: 'high',
    shine: true,
  },
};
