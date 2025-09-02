import React from "react";
type AstroHighlightProps = {
  sunrise: string;
  sunset: string;
};

const AstroHighlight = ({ sunrise, sunset }: AstroHighlightProps) => {
  return (
    <>
      <p className="text-xl font-bold w-full text-left text-[var(--text-color2)] pl-4">
        Sunrise & Sunset
      </p>
      <div className="flex flex-col items-center gap-4 flex-grow justify-center">
        <div className="flex items-center gap-2">
          <img
            src="assets/images/sunrise.png"
            alt="Sunrise Icon"
            className="h-6 w-6"
          />
          <p className="text-2xl font-bold text-[var(--component-bg)]">
            {sunrise}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="assets/images/sunset.png"
            alt="Sunset Icon"
            className="h-6 w-6"
          />
          <p className="text-2xl font-bold text-[var(--component-bg)]">
            {sunset}
          </p>
        </div>
      </div>
    </>
  );
};

export default React.memo(AstroHighlight);
