import { getUVCategory } from "../../utilityFunctions";
import UVMeter from "../../Visuals/UVMeter";

type UVHighlightProps = {
  uv: number;
};

const UVHighlight = ({ uv }: UVHighlightProps) => {
  const uvOffset = (uv * 270) / 11 - 135;
  const uvCategory = getUVCategory(uv);
  return (
    <>
      <p className="text-xl font-bold w-full text-left text-[var(--text-color2)] pl-4">
        UV Index
      </p>
      <div className="flex-grow py-2">
        <UVMeter uvOffset={uvOffset} />
      </div>
      <p className="text-xl font-bold text-[var(--component-bg)] w-full">
        {uvCategory} - {uv}
      </p>
    </>
  );
};

export default UVHighlight;
