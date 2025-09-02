import { weatherImagePaths } from "../types";
import Highlights from "./Highlights";
import CFToggler from "../Visuals/CFToggler";
import LoadingAnimation from "../Visuals/LoadingAnimation";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import SearchCont from "./SearchCont";
import ForecastCont from "./ForecastCont";

const WeatherRightCont = () => {
  const weatherData = useSelector(
    (state: RootState) => state.weather.weatherData
  );
  const isLoading = useSelector((state: RootState) => state.weather.isLoading);

  return (
    <div
      id="rightCont"
      className="flex-3/4 h-full bg-[var(--component-bg)] rounded-[20px] flex-grow relative flex flex-col gap-1 justify-between px-4 py-2"
    >
      <div
        id="topCont"
        className="flex-[0_0_calc(10%-8px)] rounded-lg z-11 flex px-4 justify-end items-center"
      >
        <SearchCont />
        <CFToggler />
      </div>
      {weatherData ? (
        <>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${
                weatherData
                  ? weatherData.current.condition.text in weatherImagePaths
                    ? weatherImagePaths[weatherData.current.condition.text]
                    : ""
                  : ""
              })`,
              backgroundSize: "cover",
              filter: "brightness(0.5)",
            }}
          ></div>
          <ForecastCont />
          <Highlights />
        </>
      ) : (
        <div className="flex-9/10 flex items-center justify-center text-lg font-semibold text-[var(--headings)]">
          {isLoading ? (
            <LoadingAnimation color="var(--headings)" />
          ) : (
            "No weather data available. Please search for a city."
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherRightCont;
