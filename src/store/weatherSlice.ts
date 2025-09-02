import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type WeatherAPIResponseSuccessType } from "../components/types";

type WeatherState = {
  weatherData: WeatherAPIResponseSuccessType | null;
  isCelcius: boolean;
  isLoading: boolean;
  days: number;
  aqi: "yes" | "no";
  alerts: "yes" | "no";
};

const initialState: WeatherState = {
  weatherData: null,
  isCelcius: true,
  isLoading: false,
  days: 3,
  aqi: "yes",
  alerts: "no",
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    setWeatherData(
      state,
      action: PayloadAction<WeatherAPIResponseSuccessType | null>
    ) {
      state.weatherData = action.payload;
    },
    setIsCelcius(state, action: PayloadAction<boolean>) {
      state.isCelcius = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setWeatherData, setIsCelcius, setIsLoading } =
  weatherSlice.actions;
export default weatherSlice.reducer;
