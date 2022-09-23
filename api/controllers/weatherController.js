const City = require("../models/city");
const axios = require("axios");
const keys = require("../keys");
const API_KEY = keys.openWeatherSecret;
const redisCLI = require("../utils/redisCLI");

exports.getCity = async (req, res, next) => {
  const city = req.params.city;
  const cached = await redisCLI.get(`city#${city.toLowerCase()}`);

  if (cached) {
    cityJSON = {};
    cityJSON["name"] = city.toLowerCase();
    cityJSON["temperature"] = cached;
    cityJSON["isCached"] = "true";
    cityJSON["db"] = "false";
    cityJSON["weatherapi"] = "false";

    res.send(cityJSON);
  } else {
    req.body.city = city;
    next();
  }
};
exports.cachedCity = async (req, res, next) => {
  const city = req.body.city;
  const values = await City.findOne({ where: { name: city.toLowerCase() } });
  if (values) {
    cityJSON = {};
    cityJSON["name"] = values.name.toLowerCase();
    cityJSON["temperature"] = values.temperature;
    cityJSON["isCached"] = "false";
    cityJSON["db"] = "true";
    cityJSON["weatherapi"] = "false";

    await redisCLI.setEx(
      `city#${cityJSON["name"]}`,
      3600,
      cityJSON["temperature"]
    );
    res.send(cityJSON);
  } else {
    try {
      const cityWeatherData = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()}&appid=${API_KEY}`
      );
      const cityName = city.toLowerCase();
      const cityWeather = (
        parseInt(cityWeatherData.data.main.temp) - 273.15
      ).toFixed(1);
      cityJSON = {};
      cityJSON["name"] = cityName.toLowerCase();
      cityJSON["temperature"] = cityWeather;
      cityJSON["isCached"] = "false";
      cityJSON["db"] = "false";
      cityJSON["weatherapi"] = "true";

      try {
        await redisCLI.setEx(
          `city#${cityJSON["name"]}`,
          3600,
          cityJSON["temperature"]
        );
        res.send(cityJSON);
      } catch (error) {
        res.status(500).send({ message: "Something went wrong." });
      }
    } catch (error) {
      res
        .status(200)
        .send({ message: "Please use English letters or English names" });
    }
  }
};

exports.addCity = async (req, res, next) => {
  const city = req.body.city;
  try {
    const cityWeatherData = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.toLowerCase()}&appid=${API_KEY}`
    );
    const cityName = city.toLowerCase();
    const cityWeather = (
      parseInt(cityWeatherData.data.main.temp) - 273.15
    ).toFixed(1);
    cityJSON = {};
    cityJSON["name"] = cityName;
    cityJSON["temperature"] = cityWeather;
    const newCity = City.build(cityJSON);
    try {
      await newCity.save();
      res.send(cityJSON);
    } catch (error) {
      res.status(200).send({ message: "Something went wrong." });
    }
  } catch (error) {
    console.log("error");
  }
};
