import type { VercelRequest, VercelResponse } from '@vercel/node';
import { log, warn } from 'console';
import { of, map, switchMap, from, catchError } from 'rxjs';

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
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
        return response.status(200).send('Success');
      },
      error: (err) => {
        warn(`Occurred error: ${err}`);
      },
      complete: () => {
        console.log('Completed');
      },
    });
}

export const fetchCity = async (cityName: string) => {
  const BASE_URL = 'https://api.openweathermap.org';
  const API_KEY = '1a1ba32f19cc0f27956ad60e8e278118';
  const params = {
    appid: API_KEY,
    q: cityName,
    limit: '1',
  };

  const queryString = new URLSearchParams(params).toString();

  try {
    log(`Fetching city ${cityName}...`);

    const response = await fetch(BASE_URL + '/geo/1.0/direct?' + queryString);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = (await response.json()) as DirectGeocodingResponse[];

    if (!data.length) {
      warn(`City ${cityName} not found.`);
      return;
    }

    const [{ name, lat, lon }] = data;

    log(`Successfully fetched city ${name} at ${lat}, ${lon}.`);
    return { name, lat, lon };
  } catch (error) {
    warn(error);
    throw error;
  }
};
export async function getCurrentWeatherByCountryCode({
  name,
  lat,
  lon,
}: {
  name: string;
  lat: number;
  lon: number;
}) {
  log(`Received request to fetch weather data for ${name}.`);

  const BASE_URL = 'https://api.openweathermap.org';
  const API_KEY = '1a1ba32f19cc0f27956ad60e8e278118';
  const params = {
    appid: API_KEY,
    lang: 'ru',
    units: 'metric',
    lat: String(lat),
    lon: String(lon),
  };
  const queryString = new URLSearchParams(params).toString();

  try {
    const response = await fetch(BASE_URL + '/data/2.5/weather?' + queryString);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const {
      sys: { sunrise, sunset, country },
      rain,
      snow,
      dt,
      main,
    } = (await response.json()) as CurrentWeatherResponse;

    let precipitation = 'Нет осадков';
    let advice = 'Хорошего дня\\! ☀️';

    if (rain && '3h' in rain) {
      precipitation = 'Дождь';
      advice = 'Не забудьте зон\\! 🌂';
    }

    if (snow && '3h' in snow) {
      precipitation = 'Снег';
      advice = 'Одевайтесь теплее и будьте осторожны на дорогах\\! ❄️';
    }

    log(`Successfully fetched weather data for ${country} at ${dt}.`);

    return {
      name,
      sunrise,
      sunset,
      dt,
      main,
      precipitation,
      advice,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const makeMessage = ({
  name,
  sunrise,
  sunset,
  dt,
  main,
  precipitation,
  advice,
}: {
  precipitation: string;
  name: string;
  sunrise: number;
  sunset: number;
  dt: number;
  main: Main;
  advice: string;
}) => {
  const date = new Date(dt * 1000);

  const message = `**🌞ваш ежедневный прогноз погоды:**

  📅 **Дата:** \`${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}\`
  
  **📍 Местоположение:** \`${name}\`
  
  **🌡️ Температура:** \`${main.temp}°C\`
  **🌧️ Осадки:** \`${precipitation}\`
  
  **🌅 Рассвет:** \`${new Date(sunrise * 1000).toLocaleTimeString()}\`
  **🌇 Закат:** \`${new Date(sunset * 1000).toLocaleTimeString()}\`
  
  ${advice}`;
  return message;
};

export interface CurrentWeatherResponse {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  rain: Rain;
  snow: Snow;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface Clouds {
  all: number;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export interface Rain {
  '1h'?: number;
  '3h'?: number;
}
export interface Snow {
  '1h'?: number;
  '3h'?: number;
}

export interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

export interface DirectGeocodingResponse {
  name: string;
  local_names?: { [key: string]: string };
  lat: number;
  lon: number;
  country: string;
  state: string;
}
