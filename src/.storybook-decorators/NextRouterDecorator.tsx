import React from 'react';
import { Decorator } from '@storybook/react';

// We don't actually need to mock the provider if we use @storybook/nextjs
// which mocks next/navigation automatically. 
// However, if we need specific context values, we can use parameters.nextjs.navigation
// This decorator might be redundant if the framework handles it well, 
// but it's good to have a placeholder if we need custom logic later.

export const NextRouterDecorator: Decorator = (Story) => {
  return <Story />;
};
