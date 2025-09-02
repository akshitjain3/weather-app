import z4 from "zod/v4";
export const weatherImagePaths = {
  sunny: "/assets/images/sunny.jpg",
  clear: "/assets/images/clear.jpg",
  "partly cloudy": "/assets/images/partly-cloudy.jpg",
  cloudy: "/assets/images/partly-cloudy.jpg",
  overcast: "/assets/images/overcast.jpg",
  mist: "/assets/images/misty.jpg",
  fog: "/assets/images/misty.jpg",
  "freezing fog": "/assets/images/misty.jpg",
  "patchy rain nearby": "/assets/images/patchy-rain.jpeg",
  "patchy light drizzle": "/assets/images/patchy-rain.jpeg",
  "light drizzle": "/assets/images/patchy-rain.jpeg",
  "patchy light rain": "/assets/images/patchy-rain.jpeg",
  "light rain": "/assets/images/patchy-rain.jpeg",
  "light rain shower": "/assets/images/patchy-rain.jpeg",
  "patchy sleet nearby": "/assets/images/sleet.jpg",
  "light sleet": "/assets/images/sleet.jpg",
  "light sleet showers": "/assets/images/sleet.jpg",
  "patchy freezing drizzle nearby": "/assets/images/freezing-drizzle.jpg",
  "freezing drizzle": "/assets/images/freezing-drizzle.jpg",
  "light freezing rain": "/assets/images/freezing-drizzle.jpg",
  "thundery outbreaks in nearby": "/assets/images/stormy.jpg",
  blizzard: "/assets/images/stormy.jpg",
  "patchy light rain in area with thunder": "/assets/images/stormy.jpg",
  "moderate or heavy rain in area with thunder": "/assets/images/stormy.jpg",
  "blowing snow": "/assets/images/snowy.jpg",
  "moderate snow": "/assets/images/snowy.jpg",
  "patchy heavy snow": "/assets/images/snowy.jpg",
  "heavy snow": "/assets/images/snowy.jpg",
  "moderate or heavy snow showers": "/assets/images/snowy.jpg",
  "heavy freezing drizzle": "/assets/images/heavy-freezing-drizzle.jpg",
  "moderate or heavy freezing rain":
    "/assets/images/heavy-freezing-drizzle.jpg",
  "moderate or heavy sleet": "/assets/images/heavy-freezing-drizzle.jpg",
  "ice pellets": "/assets/images/heavy-freezing-drizzle.jpg",
  "moderate or heavy sleet showers":
    "/assets/images/heavy-freezing-drizzle.jpg",
  "moderate rain at times": "/assets/images/rainy.jpg",
  "moderate rain": "/assets/images/rainy.jpg",
  "heavy rain at times": "/assets/images/rainy.jpg",
  "heavy rain": "/assets/images/rainy.jpg",
  "moderate or heavy rain shower": "/assets/images/rainy.jpg",
  "torrential rain shower": "/assets/images/rainy.jpg",
  "patchy light snow": "/assets/images/light-snow.jpeg",
  "light snow": "/assets/images/light-snow.jpeg",
  "patchy moderate snow": "/assets/images/light-snow.jpeg",
  "light snow showers": "/assets/images/light-snow.jpeg",
  "patchy snow nearby": "/assets/images/light-snow.jpeg",
  "moderate or heavy showers of ice pellets": "/assets/images/snow-pellets.png",
  "patchy light snow in area with thunder": "/assets/images/thunder-snow.jpg",
  "moderate or heavy snow in area with thunder":
    "/assets/images/thunder-snow.jpg",
};

export type WeatherAPIResponseSuccessType = {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    last_updated: string;
    temp_c: number;
    temp_f: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    condition: {
      text: keyof typeof weatherImagePaths;
      icon: string;
    };
    humidity: number;
    air_quality: {
      pm2_5: number;
    };
    uv: number;
    cloud: number;
    gust_kph: number;
    wind_kph: number;
    wind_dir: string;
    wind_degree: number;
  };

  forecast: {
    forecastday: {
      date: string;
      astro: {
        sunrise: string;
        sunset: string;
      };
      hour: {
        temp_c: number;
        temp_f: number;
        feelslike_c: number;
        feelslike_f: number;
      }[];
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        avg_humidity: number;
        uv: number;
        totalsnow_cm: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: keyof typeof weatherImagePaths;
          icon: string;
        };
        air_quality: {
          pm2_5: number;
        };
      };
    }[];
  };
  alerts?: {
    alert: {
      headline: string;
      event: string;
      desc: string;
      instruction: string;
      severity: string;
      urgency: string;
      effective: string;
      expires: string;
    }[];
  };
};

export const WeatherAPISchema = z4.object({
  location: z4.object({
    name: z4.string(),
    region: z4.string(),
    country: z4.string(),
    lat: z4.number(),
    lon: z4.number(),
    localtime: z4.string(),
  }),
  current: z4.object({
    last_updated: z4.string(),
    temp_c: z4.number(),
    temp_f: z4.number(),
    feelslike_c: z4.number(),
    feelslike_f: z4.number(),
    vis_km: z4.number(),
    condition: z4.object({
      text: z4.string(),
      icon: z4.string(),
    }),
    humidity: z4.number(),
    air_quality: z4.object({
      pm2_5: z4.number(),
    }),
    uv: z4.number(),
    cloud: z4.number(),
    gust_kph: z4.number(),
    wind_kph: z4.number(),
    wind_dir: z4.string(),
    wind_degree: z4.number(),
  }),
  forecast: z4.object({
    forecastday: z4.array(
      z4.object({
        date: z4.string(),
        astro: z4.object({
          sunrise: z4.string(),
          sunset: z4.string(),
        }),
        hour: z4.array(
          z4.object({
            temp_c: z4.number(),
            temp_f: z4.number(),
            feelslike_c: z4.number(),
            feelslike_f: z4.number(),
          })
        ),
        day: z4.object({
          maxtemp_c: z4.number(),
          maxtemp_f: z4.number(),
          mintemp_c: z4.number(),
          mintemp_f: z4.number(),
          avgtemp_c: z4.number(),
          avgtemp_f: z4.number(),
          avghumidity: z4.number(),
          uv: z4.number(),
          totalsnow_cm: z4.number(),
          daily_will_it_rain: z4.number(),
          daily_chance_of_rain: z4.number(),
          daily_will_it_snow: z4.number(),
          daily_chance_of_snow: z4.number(),
          condition: z4.object({
            text: z4.string(),
            icon: z4.string(),
          }),
        }),
      })
    ),
  }),
  alerts: z4
    .object({
      alert: z4.array(
        z4.object({
          headline: z4.string(),
          event: z4.string(),
          desc: z4.string(),
          instruction: z4.string(),
          severity: z4.string(),
          urgency: z4.string(),
          effective: z4.string(),
          expires: z4.string(),
        })
      ),
    })
    .optional(),
});

export type WeatherComponentProps = {
  days?: number;
  aqi?: boolean;
  alerts?: boolean;
};

export type ForecastDayType =
  WeatherAPIResponseSuccessType["forecast"]["forecastday"][0];
