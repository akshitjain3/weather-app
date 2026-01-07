import { capitalizeFirstLetter } from "../utilityFunctions";
import { MdLocationPin } from "react-icons/md";
import BellIcon from "../Visuals/BellIcon";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
const WeatherLeftCont = () => {
  const weatherData = useSelector(
    (state: RootState) => state.weather.weatherData
  );
  const isCelcius = useSelector((state: RootState) => state.weather.isCelcius);

  return (
    <div
      id="leftCont"
      className="flex-1/4 h-full flex-grow p-6 py-10 flex flex-col items-start justify-between"
    >
      {weatherData && (
        <>
          <div className="flex flex-col items-start">
            <p className="text-2xl font-semibold text-[var(--component-bg)]">
              Current Weather
            </p>
            <p className="text-sm font-medium text-[var(--component-bg)]">
              {weatherData.current.last_updated
                ? `Last updated: ${new Date(
                    weatherData.current.last_updated
                  ).toLocaleString("en-US", {
                    hour12: true,
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "No data available"}
            </p>
            <div className="flex items-center gap-8 mt-1">
              <p className="text-7xl font-medium text-[var(--text-color2)] relative">
                {isCelcius
                  ? `${weatherData?.current.temp_c}`
                  : `${weatherData?.current.temp_f}`}
                <span className="absolute top-0 translate-y-1/2 left-full text-lg font-bold">
                  {isCelcius ? "°C" : "°F"}
                </span>
              </p>
              <img
                src={weatherData.current.condition.icon}
                alt="Weather Icon"
                className="h-full aspect-square"
              />
            </div>
            <p className="text-2xl font-bold text-[var(--component-bg)] mb-4">
              {capitalizeFirstLetter(weatherData.current.condition.text)}
            </p>
            <p className="text-xl font-semibold text-[var(--component-bg)] my-1">
              {new Date(weatherData.current.last_updated).toLocaleString(
                "en-US",
                { weekday: "long" }
              )}
              ,
            </p>
            <div className="grid grid-cols-[1fr_32px] justify-start items-center gap-x-2">
              <div className="flex flex-col">
                <p className="text-2xl font-semibold text-[var(--component-bg)] text-left">
                  {weatherData.location.name}
                </p>

                <p className="text-lg font-medium text-[var(--component-bg)] text-left">
                  {weatherData.location.region}, {weatherData.location.country}
                </p>
              </div>

              <MdLocationPin
                className="text-[var(--text-color2)] row-span-2 aspect-square w-8"
                size={32}
              />
            </div>
            <p className="text-2xl font-semibold text-[var(--text-color2)] text-left relative mt-3">
              Feels like:{" "}
              {isCelcius
                ? weatherData.current.feelslike_c
                : weatherData.current.feelslike_f}
              <span className="absolute top-0 left-full text-xs">
                {isCelcius ? "°C" : "°F"}
              </span>
            </p>
          </div>
          <div className="flex items-center w-full gap-4 mt-4 bg-[var(--component-bg)] text-[var(--headings)] py-2 px-4 rounded-sm">
            <p className="text-xl font-semibold">Alerts</p>
            <BellIcon
              size={24}
              fillColor="var(--headings)"
              notifications={weatherData.alerts?.alert.length || 0}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherLeftCont;
