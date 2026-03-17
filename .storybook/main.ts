import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    const tailwindcss = await import('@tailwindcss/postcss');
    
    return mergeConfig(config, {
      plugins: [react.default()],
      resolve: {
        alias: {
          '@': resolve(__dirname, '../src'),
        },
      },
      css: {
        postcss: {
          plugins: [
            tailwindcss.default(),
          ],
        },
      },
    });
  },
};
export default config;