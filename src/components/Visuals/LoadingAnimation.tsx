import React from "react";

type LoadingAnimationProps = {
  size?: number;
  color?: string;
  CSSClasses?: string;
};

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  size = 48,
  color = "#3b82f6",
  CSSClasses = "",
}) => {
  const spinnerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
  };

  return (
    <div
      className={`relative ${CSSClasses}`}
      style={{ width: size, height: size }}
    >
      <div
        className="absolute top-0 left-0 w-full h-full rounded-full animate-ping opacity-75"
        style={spinnerStyle}
      />
      <div
        className="absolute top-0 left-0 w-full h-full rounded-full"
        style={spinnerStyle}
      />
    </div>
  );
};

export default LoadingAnimation;
