import React from 'react';
import { ThemeProvider } from 'next-themes';
import { Decorator } from '@storybook/react';

export const ThemeDecorator: Decorator = (Story, context) => {
  // Get the active theme from the toolbar global (or default to 'light')
  const theme = context.globals.theme || 'light';

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={false}
      forcedTheme={theme}
      disableTransitionOnChange
    >
      <div className={`min-h-screen bg-background text-foreground ${theme}`}>
        <Story />
      </div>
    </ThemeProvider>
  );
};
