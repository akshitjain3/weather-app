import WindHighlight from "./HighlightCards/WindHighlight";
import UVHighlight from "./HighlightCards/UVHighlight";
import VisibilityHighlight from "./HighlightCards/VisibilityHighlight";
import AstroHighlight from "./HighlightCards/AstroHighlight";
import HumidityHighlight from "./HighlightCards/HumidityHighlight";
import AQIHighlight from "./HighlightCards/AQIHighlight";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import { AnimatePresence, easeIn, motion } from "framer-motion";

const parentVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
  exit: { opacity: 0, y: "-100%" },
};

const childVariants = {
  initial: { x: "200%", y: "200%", opacity: 0 },
  exit: { opacity: 0 },
  animate: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: easeIn },
  },
};

const Highlights = () => {
  const weatherData = useSelector(
    (state: RootState) => state.weather.weatherData
  );
  return (
    <AnimatePresence>
      {weatherData ? (
        <motion.div
          variants={parentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          key={JSON.stringify(weatherData)}
          id="todaysHighlights"
          className="flex-[0_0_65%] rounded-lg z-10 py-2 grid grid-cols-3 grid-rows-2 gap-2"
        >
          <motion.div
            variants={childVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="rounded-2xl flex flex-col p-3 items-center bg-[rgba(var(--headings-rgb),0.8)] cursor-pointer"
          >
            <UVHighlight uv={weatherData.current.uv} />
          </motion.div>
          <motion.div
            variants={childVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="rounded-2xl flex flex-col p-3 items-center bg-[rgba(var(--headings-rgb),0.8)] cursor-pointer"
          >
            <VisibilityHighlight visibility={weatherData.current.vis_km} />
          </motion.div>
          <motion.div
            variants={childVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="rounded-2xl flex flex-col py-3 px-2 items-start bg-[rgba(var(--headings-rgb),0.8)] cursor-pointer"
          >
            <WindHighlight
              windDegree={weatherData.current.wind_degree}
              windKph={weatherData.current.wind_kph}
              windDir={weatherData.current.wind_dir}
              gustKph={weatherData.current.gust_kph}
            />
          </motion.div>
          <motion.div
            variants={childVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="rounded-2xl flex flex-col p-3 items-center bg-[rgba(var(--headings-rgb),0.8)] cursor-pointer"
          >
            <AstroHighlight
              sunrise={weatherData.forecast.forecastday[0].astro.sunrise}
              sunset={weatherData.forecast.forecastday[0].astro.sunset}
            />
          </motion.div>
          <motion.div
            variants={childVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="rounded-2xl flex flex-col p-3 items-center bg-[rgba(var(--headings-rgb),0.8)] cursor-pointer"
          >
            <HumidityHighlight humidity={weatherData.current.humidity} />
          </motion.div>
          <motion.div
            variants={childVariants}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="rounded-2xl flex flex-col p-3 items-center bg-[rgba(var(--headings-rgb),0.8)] relative cursor-pointer"
          >
            <AQIHighlight pm2_5={weatherData.current.air_quality.pm2_5 || 0} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Highlights;
