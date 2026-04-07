# Storybook Documentation

## Overview

This project uses Storybook v8.6.18 with Vite builder for component development and documentation. All Glass components, layout components, and sections have interactive stories with theme and locale switching support.

## Prerequisites

- **Node.js v24+** (required for Storybook 8.x and Vite 8)
- Ensure NVM is configured: `nvm use` (reads from `.nvmrc`)

## Getting Started

### Development Mode

```bash
# Switch to correct Node version
nvm use

# Start Storybook dev server
npm run storybook
```

Storybook will be available at [http://localhost:6006](http://localhost:6006)

### Build Static Storybook

```bash
# Build static Storybook site
npm run build-storybook
```

Output is generated in `storybook-static/` directory.

## Project Structure

```
.storybook/
├── main.ts          # Storybook configuration
└── preview.tsx      # Global decorators, parameters, and styles

src/
├── .storybook-decorators/
│   ├── ThemeDecorator.tsx       # Theme switching (next-themes)
│   ├── NextIntlDecorator.tsx    # i18n context (next-intl)
│   ├── NextRouterDecorator.tsx  # Router mocking
│   └── GlassDecorator.tsx       # SVG filters for glass effects
├── components/
│   ├── glass/
│   │   ├── GlassCard.stories.tsx
│   │   ├── GlassPanel.stories.tsx
│   │   ├── GlassButton.stories.tsx
│   │   └── GlassModal.stories.tsx
│   ├── layout/
│   │   ├── Navbar.stories.tsx
│   │   └── Footer.stories.tsx
│   └── sections/
│       ├── ValueProp.stories.tsx
│       └── Contact.stories.tsx
```

## Configuration

### Framework & Builder

- **Framework**: `@storybook/react-vite`
- **Builder**: Vite 8 with Rolldown
- **React Plugin**: `@vitejs/plugin-react` for JSX/TSX support

### Addons

- `@storybook/addon-essentials` - Controls, Actions, Viewport, Backgrounds, Toolbars, Measure, Outline
- `@storybook/addon-a11y` - Accessibility testing
- `@storybook/addon-interactions` - Interaction testing support

### Global Decorators

All stories are wrapped with the following decorators (applied in `preview.tsx`):

1. **ThemeDecorator** - Provides `next-themes` ThemeProvider with toolbar theme switching
2. **NextIntlDecorator** - Provides i18n context with English messages
3. **NextRouterDecorator** - Mocks Next.js navigation hooks
4. **GlassDecorator** - Injects SVG filters for liquid glass distortion effects

### Global Toolbar Controls

- **Theme Selector**: Switch between `light`, `dark`, and `system` themes
- **Locale Selector**: Switch between `en` and `th` locales

## Writing Stories

### Basic Story Structure

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta = {
  title: 'Category/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered', // or 'fullscreen', 'padded'
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // component props
  },
};
```

### Glass Component Stories

Glass components support interactive controls for:
- `elevation` - Glass elevation level (e1-e5)
- `specular` - Specular highlight effect
- `distortion` - Liquid glass distortion
- `distortionIntensity` - Distortion strength (subtle, medium, strong)
- `shine` - Shine effect overlay

Example:

```tsx
export const WithDistortion: Story = {
  args: {
    distortion: true,
    distortionIntensity: 'medium',
    shine: true,
  },
};
```

### Theme Testing

Test components in different themes:

```tsx
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  globals: {
    theme: 'dark',
  },
};
```

### Layout Components

For fullscreen components like Navbar and Footer:

```tsx
const meta = {
  title: 'Layout/MyLayout',
  component: MyLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyLayout>;
```

## Features

### Interactive Controls

All stories have auto-generated controls for component props. Use the Controls panel to:
- Toggle boolean props
- Adjust numeric values
- Select from enum options
- Test different prop combinations

### Accessibility Testing

The a11y addon automatically checks for accessibility violations:
- Color contrast
- ARIA attributes
- Keyboard navigation
- Screen reader compatibility

View results in the Accessibility panel.

### Responsive Testing

Use the Viewport toolbar to test components at different screen sizes:
- Mobile (320px, 375px, 414px)
- Tablet (768px, 1024px)
- Desktop (1280px, 1920px)

### Documentation

Auto-generated documentation is available for all components with the `autodocs` tag. View it in the Docs tab.

## Troubleshooting

### Node Version Issues

If you see errors about unsupported Node version:

```bash
nvm use v24
npm install
```

### Build Errors

If the build fails, try:

```bash
# Clean install
rm -rf node_modules package-lock.json
nvm use v24
npm install

# Rebuild Storybook
npm run build-storybook
```

### JSX Parsing Errors

Ensure `@vitejs/plugin-react` is installed and configured in `.storybook/main.ts`:

```ts
async viteFinal(config) {
  const { mergeConfig } = await import('vite');
  const react = await import('@vitejs/plugin-react');
  
  return mergeConfig(config, {
    plugins: [react.default()],
    // ...
  });
}
```

## Best Practices

1. **Always use TypeScript** - Define proper types for stories
2. **Use autodocs tag** - Enable automatic documentation generation
3. **Test themes** - Create stories for both light and dark themes
4. **Test accessibility** - Check the a11y panel for violations
5. **Use decorators** - Wrap stories with necessary context providers
6. **Test responsive** - Verify components at different viewports
7. **Interactive props** - Use controls to make props interactive
8. **Performance** - Glass effects respect performance tier and reduced motion

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Component Story Format (CSF)](https://storybook.js.org/docs/react/api/csf)
- [Storybook Addons](https://storybook.js.org/docs/react/configure/storybook-addons)
- [Accessibility Testing](https://storybook.js.org/docs/react/writing-tests/accessibility-testing)
