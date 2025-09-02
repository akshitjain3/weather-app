import { useState } from "react";
import WindDirectionCompass from "../../Visuals/WindDirectionCompass";
type WindHighlightProps = {
  windDegree: number;
  windDir: string;
  windKph: number;
  gustKph: number;
};

const WindHighlight = ({
  windDegree,
  windDir,
  windKph,
  gustKph,
}: WindHighlightProps) => {
  const [animateWindDirection, setAnimateWindDirection] = useState(false);
  return (
    <div
      id="windCard"
      onMouseEnter={() => {
        setAnimateWindDirection(true);
      }}
      onMouseLeave={() => {
        setAnimateWindDirection(false);
      }}
    >
      <p className="text-xl font-bold w-full text-left text-[var(--text-color2)] pl-4">
        Wind
      </p>
      <div className="flex w-full h-full flex-grow gap-3 mt-1">
        <div className="relative flex-1">
          <div className="absolute font-semibold text-[var(--component-bg)] text-[14px] top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
            N
          </div>
          <div className="absolute font-semibold text-[var(--component-bg)] text-[14px] top-1/2 left-full transform -translate-x-2.5 -translate-y-1/2">
            E
          </div>
          <div className="absolute font-semibold text-[var(--component-bg)] text-[14px] bottom-0 left-1/2 transform translate-y-0.5 -translate-x-1/2">
            S
          </div>
          <div className="absolute font-semibold text-[var(--component-bg)] text-[14px] top-1/2 left-0 transform -translate-y-1/2">
            W
          </div>
          <WindDirectionCompass
            foregroundColor="var(--text-color2)"
            backgroundColor="rgba(var(--component-bg-rgb),0.5)"
            wind_degree={windDegree}
            animateWindDirection={animateWindDirection}
            CSSClasses="flex-1"
            animationDuration={1}
          />
        </div>

        <div className="flex-1 flex flex-col mt-2 gap-2">
          <p className="text-[12px] font-medium text-[var(--component-bg)] w-full text-left">
            {`From ${windDir} (${windDegree}°)`}
          </p>
          <div className="grid grid-cols-[1fr_2fr] gap-x-1 items-start justify-items-start">
            <p className="text-lg font-bold text-[var(--component-bg)] row-span-2">
              {windKph}
            </p>
            <p className="text-[12px] font-medium text-[var(--component-bg)]">
              Wind Speed
            </p>
            <p className="text-[12px] font-medium text-[var(--component-bg)]">
              km/h
            </p>
            <p className="text-lg font-bold text-[var(--component-bg)] row-span-2 mt-2">
              {gustKph}
            </p>
            <p className="text-[12px] font-medium text-[var(--component-bg)] mt-2">
              Wind Gust
            </p>
            <p className="text-[12px] font-medium text-[var(--component-bg)]">
              km/h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindHighlight;
