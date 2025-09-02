import WeatherLeftCont from "./weatherComponents/WeatherLeftCont";
import WeatherRightCont from "./weatherComponents/WeatherRightCont";
const WeatherComponent = () => {
  return (
    <div className="relative col-span-2 bg-[var(--component-bg)] rounded-[20px] h-180 w-full m-auto overflow-hidden mt-4">
      <div
        id="tempDetailsMainCont"
        className="flex w-full h-full items-center overflow-hidden bg-[var(--headings)] relative [&_*]:leading-tight"
      >
        <WeatherLeftCont />
        <WeatherRightCont />
      </div>
    </div>
  );
};
export default WeatherComponent;
