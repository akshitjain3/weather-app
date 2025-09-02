import SunSVG from "/assets/sun.svg";
import MoonSVG from "/assets/moon.svg";

interface LightDarkThemeElementProps {
  toggleThemeChange: () => void;
  theme: string;
}

export default function LightDarkThemeElement({
  toggleThemeChange,
  theme,
}: LightDarkThemeElementProps) {
  return (
    <div className="w-44 h-8 rounded-full top-2 right-4 overflow-hidden absolute flex bg-[var(--component-bg)] z-1000">
      <div
        className={`w-[50%] h-full grow flex items-center justify-evenly duration-300 ease transition-colors bg-white text-black ${
          theme === "light" ? "pointer-events-none" : "cursor-pointer"
        }`}
        onClick={toggleThemeChange}
      >
        <img src={SunSVG} alt="lighticon" className="aspect-1/1 h-5.5 ml-2" />
        <p
          className={`text-sm text-gray-500 ${
            theme === "light" ? "" : "hover:text-black"
          }`}
        >
          Light
        </p>
      </div>
      <div
        className={`w-[50%] h-full grow flex items-center justify-evenly duration-300 ease transition-colors bg-[#2d2d2d] text-white ${
          theme === "dark" ? "pointer-events-none" : "cursor-pointer"
        }`}
        onClick={toggleThemeChange}
      >
        <p
          className={`text-sm text-gray-300 ${
            theme === "dark" ? "" : "hover:text-white"
          }`}
        >
          Dark
        </p>
        <img
          src={MoonSVG}
          alt="darkicon"
          className="aspect-1/1 h-5.5 mr-[5px]"
        />
      </div>

      <div
        className={`absolute inset-0 px-3 py-1 pointer-events-none flex duration-500 transition-transform ${
          theme === "light"
            ? "translate-x-[0%]"
            : "translate-x-[calc(100%-50px)]"
        }`}
      >
        <div
          id="toggle-knob"
          className={`aspect-1/1 h-6 bg-black rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.3)] pointer-events-none`}
        ></div>
      </div>
    </div>
  );
}
