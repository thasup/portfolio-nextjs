import type { Preview } from "@storybook/react";
import "../src/styles/globals.css";
import { ThemeDecorator } from "../src/.storybook-decorators/ThemeDecorator";
import { NextIntlDecorator } from "../src/.storybook-decorators/NextIntlDecorator";
import { NextRouterDecorator } from "../src/.storybook-decorators/NextRouterDecorator";
import { GlassDecorator } from "../src/.storybook-decorators/GlassDecorator";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
    // Mock next/navigation
    nextjsRouter: {
      push: () => {},
      replace: () => {},
      prefetch: () => {},
      back: () => {},
      forward: () => {},
      refresh: () => {},
    }
  },
  
  decorators: [
    ThemeDecorator,
    NextIntlDecorator,
    NextRouterDecorator,
    GlassDecorator,
  ],

  globalTypes: {
    theme: {
      description: 'Global Theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Internationalization locale',
      defaultValue: 'en',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', right: '🇺🇸', title: 'English' },
          { value: 'th', right: '🇹🇭', title: 'Thai' },
        ],
      },
    },
  },
};

export default preview;
