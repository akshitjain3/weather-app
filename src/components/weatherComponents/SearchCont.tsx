import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "../Visuals/SearchIcon";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store";
import { setIsLoading, setWeatherData } from "../../store/weatherSlice";
import useDebounce from "../../custom-hooks/useDebounce";
import {
  type ForecastDayType,
  type WeatherAPIResponseSuccessType,
  WeatherAPISchema,
  type PhotonResponse,
  type PhotonFeature,
  type ScoredPhotonFeature,
  type AutocompleteResult,
} from "../types";
import {
  lowercaseConditionText,
  transformForecastDay,
} from "../utilityFunctions";
import useOutsideClick from "../../custom-hooks/useOutsideClick";

const weatherAPIKey = import.meta.env.VITE_WEATHER_API_KEY;
const SearchCont = () => {
  const [isInputExpanded, setIsInputExpanded] = useState(true);
  const [autocompleteResults, setAutoCompleteResults] = useState<
    { name: string; lat: number; lng: number }[] | null
  >(null);
  const [inputQuery, setInputQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showAutocompleteResults, setShowAutocompleteResults] = useState(false);
  const lastSearchQuery = useRef<string>("");
  const aqi = useSelector((state: RootState) => state.weather.aqi);
  const alerts = useSelector((state: RootState) => state.weather.alerts);
  const days = useSelector((state: RootState) => state.weather.days);
  const dispatch = useDispatch<AppDispatch>();
  const searchQueryTimerRef = useRef<number | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastSearchCords = useRef<{ lat: number; lng: number } | null>(null);
  const skipAutocomplete = useRef<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick({
    elementRef: dropdownRef,
    handleOutsideClick: () => setShowAutocompleteResults(false),
  });

  function toggleSearch() {
    setIsInputExpanded((old) => !old);
  }

  function scorePhotonFeatures(
    features: PhotonFeature[]
  ): ScoredPhotonFeature[] {
    return features.map((feature) => {
      const { properties } = feature;
      let score = 0;

      // Place hierarchy (most important)
      switch (properties.type) {
        case "city":
          score += 100;
          break;
        case "town":
          score += 80;
          break;
        case "village":
          score += 60;
          break;
        case "county":
          score += 40;
          break;
        default:
          score += 10;
      }

      // Penalize POIs / infrastructure
      if (
        properties.osm_key === "railway" ||
        properties.osm_value === "station" ||
        properties.type === "house"
      ) {
        score -= 50;
      }

      // Soft India bias (NOT a filter)
      if (properties.countrycode === "IN") {
        score += 30;
      }

      return { feature, score };
    });
  }

  async function handleAutoSearchComplete() {
    if (inputQuery.length < 2 || skipAutocomplete.current) {
      setAutoCompleteResults(null);
      skipAutocomplete.current = false;
      return;
    }

    try {
      const params = new URLSearchParams();
      params.set("q", inputQuery);
      params.set("limit", "10");
      params.set("lang", "en");
      params.set("lat", "20.5937"); // India bias
      params.set("lon", "78.9629");

      params.append("layer", "city");
      params.append("layer", "locality");
      params.append("layer", "county");

      const response = await fetch(
        `https://photon.komoot.io/api?${params.toString()}`
      );

      if (!response.ok) throw new Error("Autocomplete failed");

      const data: PhotonResponse = await response.json();

      const scored: ScoredPhotonFeature[] = scorePhotonFeatures(data.features);

      const topResults: PhotonFeature[] = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((s) => s.feature);

      const autocompleteResults: AutocompleteResult[] = topResults.map((f) => ({
        name: f.properties.state
          ? `${f.properties.name}, ${f.properties.state}`
          : f.properties.name,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }));

      setAutoCompleteResults(autocompleteResults);
      setShowAutocompleteResults(autocompleteResults.length > 0);
    } catch (e) {
      console.error("Error fetching autocomplete data");
    }
  }

  const handleAutoSearchCompleteDebounced = useDebounce(
    handleAutoSearchComplete,
    600
  );

  //handle clicking on a suggestion
  const handleSelectSearchResult = ({
    name,
    lat,
    lng,
  }: {
    name: string;
    lat: number;
    lng: number;
  }) => {
    setSelectedResult({ lat, lng });
    setInputQuery(name);
    setAutoCompleteResults(null);
    setShowAutocompleteResults(false);
    skipAutocomplete.current = true;
  };

  async function handleOnSearchClick() {
    //if input box is collapsed, expand and return
    if (!isInputExpanded) {
      toggleSearch();
      return;
    }
    const now = Date.now();
    const cooldown = 5;
    const time = cooldown * 60 * 1000;
    //if first time search than fetch data
    //if cooldown completed than fetch
    //if current input is not the previous searchQuery fetch
    if (
      searchQueryTimerRef.current === null ||
      inputQuery !== lastSearchQuery.current ||
      (selectedResult && lastSearchCords.current !== selectedResult) ||
      now > searchQueryTimerRef.current + time
    ) {
      searchQueryTimerRef.current = Date.now();
      if (selectedResult) {
        await fetchWeatherData(true);
        lastSearchCords.current = selectedResult;
        setSelectedResult(null);
      } else {
        await fetchWeatherData(false);
        lastSearchQuery.current = inputQuery;
      }
      toggleSearch();
    }
  }

  async function fetchWeatherData(fetchByCoords: boolean) {
    try {
      dispatch(setIsLoading(true));
      let queryString = "";
      if (fetchByCoords)
        queryString = `${selectedResult?.lat},${selectedResult?.lng}`;
      else queryString = inputQuery;

      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${weatherAPIKey}&q=${queryString}&days=${days}&aqi=${
          aqi ? "yes" : "no"
        }&alerts=${alerts ? "yes" : "no"}`
      );
      if (!response.ok)
        throw new Error(
          `Request rejected with HTTP status ${response.status} - ${response.statusText}`
        );
      let data = await response.json();
      if ("error" in data) throw new Error(data.error.message);
      data = {
        ...data,
        current: {
          ...data.current,
          condition: lowercaseConditionText(data.current.condition),
        },
        forecast: {
          ...data.forecast,
          forecastday: data.forecast.forecastday.map(
            (forecastDay: ForecastDayType) =>
              transformForecastDay(forecastDay) as ForecastDayType
          ),
        },
      };
      data = WeatherAPISchema.safeParse(data);
      if (data.success)
        dispatch(setWeatherData(data.data as WeatherAPIResponseSuccessType));
    } catch (e) {
      e instanceof Error
        ? console.log(e.message)
        : console.log("There was an error fetching the weather data.");
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  useEffect(() => {
    if (isInputExpanded) setInputQuery("");
  }, [isInputExpanded]);

  useEffect(() => {
    if (inputQuery.trim()) {
      handleAutoSearchCompleteDebounced();
    }
  }, [inputQuery]);

  return (
    <div
      id="searchCont"
      className="flex w-109 h-13 gap-4 justify-end p-2 items-center"
    >
      <AnimatePresence>
        {isInputExpanded && (
          <div className="w-93.5 relative">
            <motion.input
              ref={inputRef}
              initial={{ translateX: "100%", opacity: 0 }}
              animate={{ translateX: "0%", opacity: 1 }}
              exit={{ translateX: "100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              type="text"
              value={inputQuery}
              placeholder="Enter City name for Weather details"
              onChange={(event) => {
                setInputQuery(event.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") handleOnSearchClick();
              }}
              className="bg-white text-lg font-semibold rounded-md h-13 origin-right w-full border-2 border-[var(--headings)] text-[var(--headings)] pl-4 focus:outline-none"
            />
            {autocompleteResults && showAutocompleteResults && (
              <div
                ref={dropdownRef}
                className="absolute mt-1 rounded-b-md overflow-hidden top-full left-0 right-0 flex flex-col text-left text-lg text-[var(--headings)] rounded-md border-2 border-[var(--headings)] border-t-0 last"
              >
                {autocompleteResults.map((searchResult) => {
                  return (
                    <p
                      key={`${searchResult.lat}-${searchResult.lng}`}
                      onClick={() => handleSelectSearchResult(searchResult)}
                      className="bg-white/95 font-semibold px-4 py-2 bg-gr border-b-1 border-[var(--headings)] last:border-0 hover:brightness-90 cursor-pointer"
                    >
                      {searchResult.name}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
      <motion.button
        className="flex-grow-0 z-10"
        onClick={() => handleOnSearchClick()}
      >
        <SearchIcon size={32} CSSClasses="text-[var(--headings)]" />
      </motion.button>
    </div>
  );
};
export default SearchCont;
