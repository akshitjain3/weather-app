import BackgroundImage from "/assets/images/aqi_background5.png";
import React from "react";

type CircularBarProps = {
  fillRatio: number;
  centerText?: string;
  backgroundFill?: string;
  textColor?: string;
};

const CircularBar = ({
  fillRatio,
  centerText = "",
  backgroundFill = "rgba(0,0,0,0.3)",
  textColor = "#000",
}: CircularBarProps) => {
  const strokeDashOffset = 410 * (1 - fillRatio);
  const rotation = fillRatio * 311;
  return (
    <svg
      width="140"
      height="140"
      viewBox="5 -12 171 178"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="imgAQIDetails"
          height="180"
          width="180"
          patternUnits="userSpaceOnUse"
        >
          <image href={BackgroundImage} x="0" y="0" width="180" height="180" />
        </pattern>
      </defs>
      <path
        d="M 90.5 80 m -48 -60 a 76 76 0 1 1 -29 60"
        transform="rotate(245, 90.5 80)"
        fill="none"
        stroke={backgroundFill}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 90.5 80 m -48 -60 a 76 76 0 1 1 -29 60"
        transform="rotate(245, 90.5 80)"
        fill="none"
        stroke="url(#imgAQIDetails)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="410"
        strokeLinejoin="round"
        strokeDashoffset={strokeDashOffset}
      />
      <text
        x="90.5"
        y="80"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize="32"
        fontWeight="bold"
      >
        {centerText}
      </text>
      <g>
        <circle
          cx="59.1"
          cy="148.5"
          r="10"
          fill="#E39110"
          transform={`rotate(${rotation}, 90.5, 80)`}
        />
        <circle
          cx="59.1"
          cy="148.5"
          r="11.5"
          stroke="white"
          strokeWidth="3"
          transform={`rotate(${rotation}, 90.5, 80)`}
        />
      </g>
    </svg>
  );
};

export default React.memo(CircularBar);
