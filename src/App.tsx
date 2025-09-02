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
      <div data-theme={theme}>
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
