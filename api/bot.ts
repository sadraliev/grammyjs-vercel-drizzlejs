import { initializeBot } from '../app/bot.config';
import { Bot } from 'grammy';
import { insertMessage } from '../app/repositories/drizzle';
import { error } from 'console';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is unset');

const bot = new Bot(token);
bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));
bot.on('message', async (ctx, next) => {
  try {
    const user_id = ctx.from.id;
    const first_name = ctx.from.first_name;
    console.log('message from', user_id, first_name);

    await insertMessage({ user_id, first_name });
    await next();
  } catch (err) {
    error(err);
  }
});

bot.command('dota', (ctx) => {
  const getHeroPhrase = () => {
    const phrases = [
      'Не рой другому яму, пусть сам роет',
      'не убегайте, мы ваши друзья',
      'Свежее мясо',
      'Пивка для рывка!',
      'Мушкет и жену не отдам никому',
      'Все не так плохо как вы думаете... все намного хуже',
      'Нам нужен мииир... Желательно весь!',
      'Магия принадлежит мне!',
    ];

    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex];
  };

  ctx.reply(getHeroPhrase());
});

export default initializeBot(bot);
