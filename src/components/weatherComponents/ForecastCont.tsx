import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import { AnimatePresence, motion } from "framer-motion";
const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const ForecastCont = () => {
  const weatherData = useSelector(
    (state: RootState) => state.weather.weatherData?.forecast.forecastday
  );
  const isCelcius = useSelector((state: RootState) => state.weather.isCelcius);
  const dummyArray = [...Array(weatherData?.length)].map((_, index) =>
    index === 0 ? true : false
  );
  const [expandDetails, setExpandDetails] = useState<boolean[]>(dummyArray);
  const toggleExpand = useCallback((index: number) => {
    setExpandDetails((prev) => {
      const oldIndex = prev.findIndex((item) => item === true);
      const prevCopy = [...prev];
      prevCopy[oldIndex] = false;
      prevCopy[index] = true;
      return [...prevCopy];
    });
  }, []);
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: "100%", transition: { duration: 0.2 } }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "-100%" }}
        key={JSON.stringify(weatherData)}
        id="forecastCont"
        className="flex-[0_0_25%] rounded-lg overflow-hidden z-10 flex gap-2"
      >
        {weatherData &&
          weatherData.map((item, index) => {
            const date = new Date(item.date);
            const today = new Date();
            const isToday =
              date.toLocaleDateString() === today.toLocaleDateString();
            const avgkey = isCelcius ? "temp_c" : "temp_f";
            const avgTemp = (
              item.hour.reduce((acc: number, item) => acc + item[avgkey], 0) /
              24
            ).toFixed(1);

            const feelskey = isCelcius ? "feelslike_c" : "feelslike_f";
            const feelsLikeTemp = (
              item.hour.reduce((acc: number, item) => acc + item[feelskey], 0) /
              24
            ).toFixed(1);
            return (
              <div
                key={index}
                onClick={() => toggleExpand(index)}
                className={`forecastCard flex flex-col gap-2 p-4 ${
                  expandDetails[index] ? "forecastActive" : "forecastInactive"
                }`}
              >
                <div className="text-2xl font-semibold text-[var(--component-bg)] flex justify-between px-2">
                  <p>{date.getDate()}</p>
                  <p className="flex items-center">
                    {isToday ? "Today" : weekDays[date.getDay()]}
                  </p>
                </div>
                <div className="text-left text-[var(--component-bg)] flex grow justify- items-center gap-2 px-2">
                  {expandDetails[index] ? (
                    <div className="w-[66.666%] flex flex-col text-[16px] font-medium items-start gap-2">
                      <p className="relative !leading-[1] text-nowrap">
                        Avg. Temp - {avgTemp}
                        <span className="absolute left-full top-[5%] text-xs ml-1">
                          {isCelcius ? " °C" : " °F"}
                        </span>
                      </p>
                      <p className="relative !leading-[1] text-nowrap">
                        Feels Like - {feelsLikeTemp}
                        <span className="absolute left-full top-[5%] text-xs ml-1">
                          {isCelcius ? " °C" : " °F"}
                        </span>
                      </p>
                      <p className="!leading-[1] text-nowrap">
                        Chances of Rain - {item.day.daily_chance_of_rain}%
                      </p>
                      <p className="!leading-[1] text-nowrap">
                        Chances of Snow - {item.day.daily_chance_of_snow}%
                      </p>
                    </div>
                  ) : (
                    <div className="w-[50%] flex flex-col items-start gap-2">
                      <div className="relative text-3xl font-semibold text-[var(--text-color2)] text-left pr-1 !leading-[1]">
                        {avgTemp}
                        <span className="absolute left-full top-[5%] text-sm text-[var(--component-bg)]">
                          {isCelcius ? "°C" : "°F"}
                        </span>
                      </div>
                      <div className="relative text-3xl font-semibold text-[var(--text-color2)] text-left pr-1 !leading-[1]">
                        {feelsLikeTemp}
                        <span className="absolute left-full top-[5%] text-sm text-[var(--component-bg)]">
                          {isCelcius ? "°C" : "°F"}
                        </span>
                      </div>
                    </div>
                  )}

                  <img
                    src={item.day.condition.icon}
                    alt="weather-icon"
                    className={`flex h-full object-contain overflow-hidden ${
                      expandDetails[index] ? "w-[33.334%]" : "w-[50%]"
                    }`}
                  />
                </div>
              </div>
            );
          })}
      </motion.div>
    </AnimatePresence>
  );
};

export default ForecastCont;
