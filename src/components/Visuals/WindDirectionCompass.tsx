import { getWindTowardsCoordinates } from "../utilityFunctions";

type WindDirectionCompassProps = {
  animateWindDirection?: boolean;
  backgroundColor: string;
  foregroundColor: string;
  wind_degree: number;
  CSSClasses?: string;
  animationDuration?: number;
};

const WindDirectionCompass = ({
  animateWindDirection = false,
  backgroundColor,
  foregroundColor,
  wind_degree,
  CSSClasses = "",
  animationDuration = 2,
}: WindDirectionCompassProps) => {
  const windTowardsCoordinates = getWindTowardsCoordinates(wind_degree, 15);
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${CSSClasses}`}
    >
      {/* Background Arcs */}
      {[...Array(4)].map((_, index) => {
        const rotation = index * 90 + 10;
        return (
          <path
            key={index}
            d="M90 10 A 80 80, 0, 0, 1, 165.18 62.64"
            fill="none"
            stroke={backgroundColor}
            strokeWidth="8"
            strokeLinecap="round"
            transform={`rotate(${rotation} 90 90)`}
          />
        );
      })}

      {/* Wind Arc */}
      <path
        id="windDirectionArc"
        d="M53.0601109411973 160.96086665425776A 80 80, 0, 0, 1, 13.702643940141868 114.0564639603419"
        fill="none"
        stroke={foregroundColor}
        strokeWidth="8"
        strokeLinecap="round"
        transform={`rotate(${130 + wind_degree} 90 90)`}
      />

      {/* Wind Arrow - Fixed and Centered */}
      <g transform="translate(90 90)">
        <path
          d="M -3.675 -49.6258 
                              C -3.0859 -52.2235 0.5908 -52.2902 1.2738 -49.7157 
                              L 21.0053 28.4284 
                              C 22.7162 34.8774 17.8736 41.2042 11.2016 41.2368 
                              L -12.4936 41.3525 
                              C -19.05395 41.3845 -23.93627 35.3014 -22.48529 28.9034 
                              L -4.675 -49.6258Z"
          fill={foregroundColor}
          transform={`rotate(${180 + wind_degree} 0 0)`}
        >
          {animateWindDirection && (
            <animateMotion
              dur={`${animationDuration}s`}
              repeatCount="indefinite"
              path={`M0 0 L${windTowardsCoordinates.x} ${windTowardsCoordinates.y}`}
            />
          )}
        </path>
      </g>
    </svg>
  );
};

export default WindDirectionCompass;
