import type { Meta, StoryObj } from "@storybook/react";
import { GlassModal } from "./GlassModal";
import { useState } from "react";
import { GlassButton } from "./GlassButton";

const meta: Meta<typeof GlassModal> = {
  title: "Glass/GlassModal",
  component: GlassModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Glassmorphism modal dialog with backdrop overlay. Features high elevation, focus trapping, and optional liquid distortion effects. Includes smooth entry/exit animations.",
      },
    },
  },
  argTypes: {
    open: {
      control: "boolean",
    },
    elevation: {
      control: "select",
      options: ["e1", "e2", "e3", "e4", "e5"],
    },
    distortion: {
      control: "boolean",
    },
    shine: {
      control: "boolean",
    },
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

      <GlassModal {...args} open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Confirm Action</h2>
          <p className="text-muted-foreground">
            Are you sure you want to proceed with this action? This modal
            demonstrates glassmorphism with high elevation and smooth
            animations.
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <GlassButton onClick={() => setIsOpen(false)} elevation="e2">
              Cancel
            </GlassButton>
            <GlassButton
              onClick={() => setIsOpen(false)}
              elevation="e3"
              specular
            >
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
    open: false,
    elevation: "e4",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Standard glass modal with high elevation (e4) and backdrop overlay. Click "Open Modal" button to display.',
      },
    },
  },
};

export const LiquidDistortion: Story = {
  render: (args) => <ModalWithState {...args} />,
  args: {
    open: false,
    elevation: "e4",
    distortion: true,
    distortionIntensity: "medium",
    shine: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Modal with liquid glass distortion effects for premium visual appeal. Click "Open Modal" to view.',
      },
    },
  },
};
