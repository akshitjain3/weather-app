import { getVisibilityData } from "../../utilityFunctions";
type VisibilityHighlightProps = {
  visibility: number;
};

const VisibilityHighlight = ({ visibility }: VisibilityHighlightProps) => {
  const [visibilityCategory, visibilityIndex] = getVisibilityData(visibility);
  return (
    <>
      <p className="text-xl font-bold w-full text-left text-[var(--text-color2)] pl-4">
        Visibility
      </p>
      <div className="flex flex-col flex-grow items-center justify-center gap-2 py-2 w-full">
        {Array(5)
          .fill("")
          .map((_, index) => {
            const widthPercentage = 20 + index * 10;
            return (
              <div
                key={4 - index}
                style={{ width: `${widthPercentage}%` }}
                className={`h-2 rounded-full  ${
                  4 - index >= visibilityIndex
                    ? "bg-green-500"
                    : "bg-[rgba(var(--component-bg-rgb),0.5)]"
                }`}
              ></div>
            );
          })}
      </div>
      <p className="text-xl font-bold text-[var(--component-bg)]">
        {visibilityCategory} - {visibility} km
      </p>
    </>
  );
};

export default VisibilityHighlight;
