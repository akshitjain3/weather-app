import { type ForecastDayType } from "./types";
export function getHumidityData(humidity: number) {
  if (humidity < 30) {
    return { humidityLevel: "Low", humidityBgColor: "bg-sky-400" };
  } else if (humidity < 50) {
    return { humidityLevel: "Comfortable", humidityBgColor: "bg-green-400" };
  } else if (humidity < 70) {
    return { humidityLevel: "Moderate", humidityBgColor: "bg-yellow-400" };
  } else {
    return { humidityLevel: "High", humidityBgColor: "bg-red-500" };
  }
}

export function capitalizeFirstLetter(str: string) {
  let words = str.split(" ");
  words = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return words.join(" ");
}

export function getAQIValues(pm25: number) {
  const breakpoints = [
    { Clow: 0, Chigh: 30, Ilow: 0, Ihigh: 50, category: "Good" },
    { Clow: 31, Chigh: 60, Ilow: 51, Ihigh: 100, category: "Satisfactory" },
    {
      Clow: 61,
      Chigh: 90,
      Ilow: 101,
      Ihigh: 200,
      category: "Moderately Polluted",
    },
    { Clow: 91, Chigh: 120, Ilow: 201, Ihigh: 300, category: "Poor" },
    { Clow: 121, Chigh: 250, Ilow: 301, Ihigh: 400, category: "Very Poor" },
    { Clow: 251, Chigh: 500, Ilow: 401, Ihigh: 500, category: "Severe" },
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.Clow && pm25 <= bp.Chigh) {
      const aqi = Math.round(
        ((bp.Ihigh - bp.Ilow) / (bp.Chigh - bp.Clow)) * (pm25 - bp.Clow) +
          bp.Ilow
      );
      return {
        aqi: aqi,
        category: bp.category,
      };
    }
  }

  return {
    aqi: null,
    category: "Out of Range",
  };
}

export function getVisibilityData(visibilityInKm: number): [string, number] {
  if (visibilityInKm < 1) return ["Very Poor", 4];
  if (visibilityInKm <= 4) return ["Poor", 3];
  if (visibilityInKm <= 10) return ["Moderate", 2];
  if (visibilityInKm <= 20) return ["Good", 1];
  return ["Excellent", 0];
}

export function getWindTowardsCoordinates(wind_degree: number, moveBy: number) {
  let compassFrom = wind_degree;
  let compassTo = (compassFrom + 180) % 360;
  let SVGDeg = compassTo - 90;
  let radians = (SVGDeg * Math.PI) / 180;
  return {
    x: moveBy * Math.cos(radians),
    y: moveBy * Math.sin(radians),
  };
}

export function getUVCategory(uvIndex: number): string {
  if (uvIndex <= 2) return "Low";
  else if (uvIndex <= 5) return "Moderate";
  else if (uvIndex <= 7) return "High";
  else if (uvIndex <= 10) return "Very High";
  else return "Extreme";
}

export function lowercaseConditionText(condition: { text: string }) {
  return { ...condition, text: condition.text.toLowerCase() };
}

export function transformForecastDay(day: ForecastDayType) {
  return {
    ...day,
    day: {
      ...day.day,
      condition: lowercaseConditionText(day.day.condition),
    },
  };
}
