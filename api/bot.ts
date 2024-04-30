import { initializeBot } from '../app/bot.config';
import { Bot, Context } from 'grammy';
import { error, log, warn } from 'console';
import {
  fetchCity,
  getCurrentWeatherByCountryCode,
  makeMessage,
} from './send-weather-forecast';

import type { ParseModeFlavor } from '@grammyjs/parse-mode';
import { hydrateReply, parseMode } from '@grammyjs/parse-mode';
import { catchError, from, map, of, switchMap } from 'rxjs';

const token = process.env.BOT_TOKEN;
if (!token) throw new Error('BOT_TOKEN is unset');

const bot = new Bot<ParseModeFlavor<Context>>(token);
bot.use(hydrateReply);

bot.api.config.use(parseMode('MarkdownV2'));

bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'));

bot.command('w', async (_, next) => {
  try {
    const source$ = of('Bishkek');

    source$
      .pipe(
        switchMap((country) =>
          from(fetchCity(country)).pipe(
            catchError((error) => {
              warn(`Failed while fetching city: ${error}`);
              throw new Error(`Something went wrong`);
            })
          )
        ),

        switchMap((coordinate) => {
          if (!coordinate) {
            throw new Error('City not found');
          }
          return from(getCurrentWeatherByCountryCode(coordinate)).pipe(
            catchError((error) => {
              warn(
                `Failed while fetching current weather by ${coordinate.name}: ${error}`
              );
              throw new Error(`Something went wrong`);
            })
          );
        }),

        map(makeMessage),
        switchMap((message) => {
          const token = process.env.BOT_TOKEN;
          const chatId = process.env.CHAT_ID;
          const baseUrl = `https://api.telegram.org/bot${token}/sendMessage`;

          return from(
            fetch(baseUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'MarkdownV2',
              }),
            })
          ).pipe(
            switchMap((response) => response.json()),
            catchError((error) => {
              warn('error: ', error);
              return of(error);
            })
          );
        }),
        catchError((error) => {
          return of(error.message);
        })
      )
      .subscribe({
        next: async () => {
          log('Successfully sent message to Telegram.');
          await next();
        },
        error: (err) => {
          warn(`Occurred error: ${err}`);
        },
        complete: () => {
          console.log('Completed');
        },
      });
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
