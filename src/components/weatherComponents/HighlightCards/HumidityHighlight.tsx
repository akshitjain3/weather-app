import React from "react";
import { getHumidityData } from "../../utilityFunctions";
type HumidityHighlightProps = {
  humidity: number;
};

const HumidityHighlight = ({ humidity }: HumidityHighlightProps) => {
  const { humidityLevel, humidityBgColor } = getHumidityData(humidity);
  return (
    <>
      <p className="text-xl font-bold w-full text-left text-[var(--text-color2)] pl-4">
        Humidity
      </p>
      <div className="flex items-center justify-center gap-2 w-1/2 h-full">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="h-8/10 w-3 rounded-full bg-[rgba(var(--component-bg-rgb),0.5)] flex items-end"
          >
            <div
              className={`w-full ${humidityBgColor} rounded-full`}
              style={{
                height: `${humidity}%`,
              }}
            ></div>
          </div>
        ))}
      </div>
      <p className="text-xl font-bold text-[var(--component-bg)]">
        {humidityLevel} - {humidity}%
      </p>
    </>
  );
};

export default React.memo(HumidityHighlight);
