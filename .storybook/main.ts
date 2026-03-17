import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../public"],
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    const react = await import('@vitejs/plugin-react');
    const path = await import('path');
    
    return mergeConfig(config, {
      plugins: [react.default()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '../src'),
        },
      },
      css: {
        postcss: {
          plugins: [
            require('@tailwindcss/postcss'),
          ],
        },
      },
    });
  },
};
export default config;