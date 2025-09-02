import React from "react";
import CircularBar from "../../Visuals/CircularBar";
import { getAQIValues } from "../../utilityFunctions";
type AQIHighlightProps = {
  pm2_5: number;
};

const AQIHighlight = ({ pm2_5 }: AQIHighlightProps) => {
  const { aqi, category } = getAQIValues(pm2_5);
  const ratio = aqi ? aqi / 500 : 0;
  return (
    <>
      <p className="text-lg font-bold w-full text-left text-[var(--text-color2)] pl-4">
        AQI
      </p>
      <CircularBar
        fillRatio={ratio}
        centerText={`${aqi}`}
        backgroundFill="rgba(var(--component-bg-rgb),0.5)"
        textColor="var(--component-bg)"
      />
      <p className="text-xl font-bold text-[var(--component-bg)]">
        {category ?? "N/A"}
      </p>
    </>
  );
};

export default React.memo(AQIHighlight);
