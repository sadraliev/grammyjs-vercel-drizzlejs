import { Bot, webhookCallback } from 'grammy';

export const isDev = () => process.env.NODE_ENV === 'development';

export const initializeBot = (bot: Bot) => {
  if (isDev()) {
    bot.start();
  } else {
    return webhookCallback(bot, 'http');
  }
};
