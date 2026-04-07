import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { Decorator } from '@storybook/react';
import enMessages from '../../messages/en.json';

export const NextIntlDecorator: Decorator = (Story, context) => {
  const locale = context.globals.locale || 'en';
  
  // In a real app we might load different messages based on locale,
  // but for Storybook 'en' is usually sufficient for structure testing.
  // If we really need 'th', we would need to import that JSON too.
  const messages = enMessages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Story />
    </NextIntlClientProvider>
  );
};
