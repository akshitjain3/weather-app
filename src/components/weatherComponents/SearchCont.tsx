import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "../Visuals/SearchIcon";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store";
import { setIsLoading, setWeatherData } from "../../store/weatherSlice";
import useDebounce from "../../custom-hooks/useDebounce";
import { Loader } from "@googlemaps/js-api-loader";
import {
  type ForecastDayType,
  type WeatherAPIResponseSuccessType,
  WeatherAPISchema,
} from "../types";
import {
  lowercaseConditionText,
  transformForecastDay,
} from "../utilityFunctions";
import useOutsideClick from "../../custom-hooks/useOutsideClick";

interface GoogleMapsClasses {
  Place: any;
  AutocompleteSuggestion: any;
  AutocompleteSessionToken: any;
}

declare global {
  interface Window {
    googleMapsClasses: GoogleMapsClasses;
  }
}
const weatherAPIKey = import.meta.env.VITE_WEATHER_API_KEY;
const GoogleAPIKey = import.meta.env.VITE_GOOGLE_APIKEY;
const SearchCont = () => {
  const [isInputExpanded, setIsInputExpanded] = useState(true);
  const [autocompleteResults, setAutoCompleteResults] = useState<
    { name: string; place_id: string }[] | null
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
  const sessionToken = useRef<any | null>(null);
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

  //called when there is a change in input query after debouncing
  async function handleAutoSearchComplete() {
    //skip autocomplete feature is the session token is not present/ input is less than 2 characters/ an option from dropdown is selected
    if (
      !sessionToken.current ||
      inputQuery.length < 2 ||
      skipAutocomplete.current
    ) {
      //if the input was reset and there are some previous suggestions than clear it
      setAutoCompleteResults(null);
      //reset skip when a suggestion is selected flag
      skipAutocomplete.current = false;
      return;
    }

    //fetching suggestions
    try {
      const request = {
        input: inputQuery,
        sessionToken: sessionToken.current,
        includedPrimaryTypes: ["locality", "administrative_area_level_1"],
        language: "en",
        region: "IN",
      };

      const { suggestions: autocompleteSuggestions } =
        await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
          request
        );

      if (autocompleteSuggestions && autocompleteSuggestions.length > 0) {
        setAutoCompleteResults(
          autocompleteSuggestions.slice(0, 5).map((suggestion) => ({
            place_id: suggestion.placePrediction?.placeId || "",
            name: suggestion.placePrediction?.text.text || "",
          }))
        );
        setShowAutocompleteResults(true);
      }
    } catch (e) {
      if (e instanceof Error) console.log("Error fetching autocomplete data.");
    }
  }

  const handleAutoSearchCompleteDebounced = useDebounce(
    handleAutoSearchComplete,
    600
  );

  //handle clicking on a suggestion
  const handleSelectSearchResult = ({
    place_id,
    name,
  }: {
    place_id: string;
    name: string;
  }) => {
    try {
      //getting the co-ords of the selected suggestion and storing it in state
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ placeId: place_id }, (results) => {
        if (results && results.length > 0) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          setSelectedResult({ lat, lng });
        }
      });
      //Clearing suggestions after selection of a dropdown item
      setAutoCompleteResults(null);
      setShowAutocompleteResults(false);
      skipAutocomplete.current = true;
      setInputQuery(name);
    } catch (error) {
      console.error("Error fetching lat/lng details:", error);
    }
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

  useEffect(() => {
    const initializeGoogleMaps = async () => {
      try {
        const loader = new Loader({
          apiKey: GoogleAPIKey,
          version: "weekly",
        });

        const { Place, AutocompleteSuggestion, AutocompleteSessionToken } =
          await loader.importLibrary("places");

        sessionToken.current = new AutocompleteSessionToken();

        window.googleMapsClasses = {
          Place,
          AutocompleteSuggestion,
          AutocompleteSessionToken,
        };
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initializeGoogleMaps();
  }, []);

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
                      key={searchResult.place_id}
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
