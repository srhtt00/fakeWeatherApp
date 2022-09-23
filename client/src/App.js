import { useState } from "react";
import axios from "axios";

export default function App() {
  const [city, setCity] = useState("");
  const [degree, setDegree] = useState("");
  const [cached, setCached] = useState(false);
  const [db, setDb] = useState(false);
  const [inputField, setInputField] = useState("");
  const [error, setError] = useState("");
  const [weatherAPI, setWeatherAPI] = useState(false);
  const clickHandler = async (e) => {
    e.preventDefault();

    const response = await axios.get(`api/weather/${inputField}`);
    console.log(response.data.message);
    if (response.data.message) {
      console.log("here");
      setCity("");
      setDegree("");
      setCached(false);
      setDb(false);
      setError(response.data.message);
    } else {
      const cityName = response.data.name;
      const cityTemperature = response.data.temperature;
      const cityCached = response.data.isCached;
      const cityDb = response.data.db;
      const openWeatherAPI = response.data.weatherapi;
      setCity(cityName);
      setDegree(cityTemperature);
      setCached(cityCached === "true");
      setDb(cityDb === "true");
      setWeatherAPI(openWeatherAPI === "true");
      setError("");
    }
  };
  return (
    <div className="flex w-full h-screen bg-yellow-200 justify-center items-center">
      <div className="flex flex-col border-2 w-1/3 h-1/2 items-center rounded-md overflow-hidden justify-around">
        <h1 className="text-sm sm:text-3xl font-bold">Weather App</h1>

        <input
          placeholder="Enter a city name"
          className="w-10/12 border rounded-sm p-1 text-center"
          onChange={(e) => setInputField(e.target.value)}
        ></input>
        <div
          onClick={clickHandler}
          className="w-10/12 border text-sm sm:text-md rounded-sm text-black p-2 bg-white hover:text-gray-500 shadow-sm text-center"
        >
          {" "}
          Click to see the result
        </div>
        <div className="flex flex-col w-full justify-between  ">
          {error !== "" ? (
            <div className="w-10/12 text-md sm:text-md font-bold text-center self-center  ">
              {error}
            </div>
          ) : (
            <div className="w-10/12 text-md sm:text-md font-bold text-center self-center  ">
              {city !== "" ? `${city}: ${degree}°C` : null}
            </div>
          )}
          <div className="flex flex-row w-full justify-around m-2">
            {" "}
            <div className=" text-md sm:text-md font-bold text-center ">
              Cache: {cached ? " ✅" : " ❌"}
            </div>
            <div className=" text-md sm:text-md font-bold text-center ">
              Database: {db ? " ✅" : " ❌"}
            </div>
            <div className=" text-md sm:text-md font-bold text-center ">
              OpenWeather: {weatherAPI ? " ✅" : " ❌"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
