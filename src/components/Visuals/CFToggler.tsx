import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../store";
import { setIsCelcius } from "../../store/weatherSlice";
const CFToggler = () => {
  const isCelcius = useSelector((s: RootState) => s.weather.isCelcius);
  const dispatch = useDispatch();
  return (
    <div
      id="toggleCelciusFahrenheit"
      className="w-24 h-13 rounded-full overflow-hidden flex gap-2 p-2 items-center ml-30"
    >
      <input
        type="radio"
        name="tempUnit"
        id="celcius"
        className="hidden flex-1"
        checked={isCelcius}
        onChange={() => dispatch(setIsCelcius(true))}
      />
      <label
        htmlFor="celcius"
        className={`${
          isCelcius
            ? "bg-[var(--headings)] text-[var(--component-bg)]"
            : "bg-[var(--component-bg)] text-[var(--headings)] border-[var(--headings)] border-1 hover:bg-black hover:scale-104 hover:border-0"
        } flex-1 h-full font-bold cursor-pointer rounded-full flex items-center justify-center`}
      >
        °C
      </label>
      <input
        type="radio"
        name="tempUnit"
        id="fahrenheit"
        className="hidden flex-1"
        checked={!isCelcius}
        onChange={() => dispatch(setIsCelcius(false))}
      />
      <label
        htmlFor="fahrenheit"
        className={`${
          isCelcius
            ? "bg-[var(--component-bg)] text-[var(--headings)] border-[var(--headings)] border-1 hover:bg-black hover:scale-104 hover:border-0"
            : "bg-[var(--headings)] text-[var(--component-bg)]"
        } flex-1 h-full font-bold cursor-pointer rounded-full flex items-center justify-center`}
      >
        °F
      </label>
    </div>
  );
};

export default CFToggler;
