import "./App.css";
import WeatherComponent from "./components/WeatherComponent";
import { Provider } from "react-redux";
import store from "./store";
import LightDarkThemeElement from "./components/ThemeToggle";
import useLocalStorage from "./custom-hooks/useLocalStorage";
function App() {
  const [theme, setTheme] = useLocalStorage({ key: "theme", value: "light" });

  return (
    <Provider store={store}>
      <div data-theme={theme} className={`w-full p-8 bg-[var(--page-bg)]`}>
        <LightDarkThemeElement
          theme={theme}
          toggleThemeChange={() =>
            setTheme((oldValue: string) =>
              oldValue === "light" ? "dark" : "light"
            )
          }
        />
        <WeatherComponent />
      </div>
    </Provider>
  );
}

export default App;
