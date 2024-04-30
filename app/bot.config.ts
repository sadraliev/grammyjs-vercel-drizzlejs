import { ParseModeFlavor } from '@grammyjs/parse-mode';
import { Bot, Context, webhookCallback } from 'grammy';

export const isDev = () => process.env.NODE_ENV === 'development';

export const initializeBot = (bot: Bot<ParseModeFlavor<Context>>) => {
  if (isDev()) {
    bot.start();
  } else {
    return webhookCallback(bot, 'http');
  }
};
