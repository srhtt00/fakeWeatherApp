const expect = require("chai").expect;
const redisCLI = require("../utils/redisCLI");
const pgCLI = require("../utils/postgresCLI");
const weatherController = require("../controllers/weatherController");
const City = require("../models/city");

describe("Weather Controller Tests", () => {
  before(() => {
    pgCLI
      .sync()
      .then(() => {
        console.log("connected db");
      })
      .catch((err) => console.log(err));
    redisCLI
      .connect()
      .then(() => {
        console.log("connected cache");
      })
      .catch((err) => console.log(err));
  });
  afterEach(async () => {
    await redisCLI.del(`city#${"ankara".toLowerCase()}`);

    await City.destroy({
      where: {
        name: "ankara",
      },
    });
    await redisCLI.del(`city#${"denek".toLowerCase()}`);

    await City.destroy({
      where: {
        name: "denek",
      },
    });
  });
  beforeEach(async () => {
    await redisCLI.del(`city#${"ankara".toLowerCase()}`);

    await City.destroy({
      where: {
        name: "ankara",
      },
    });
    await redisCLI.del(`city#${"denek".toLowerCase()}`);

    await City.destroy({
      where: {
        name: "denek",
      },
    });
  });
  it("Get from cached", async () => {
    await redisCLI.set(`city#${"denek".toLowerCase()}`, 25);
    const req = {
      params: {
        city: "denek",
      },
    };
    weatherController
      .getCity(req, {}, () => {})
      .then((result) => {
        expect(parseInt(result.temperature)).to.equal(25);
        expect(result.isCached).to.equal("true");
      });
    redisCLI.del(`city#${"denek".toLowerCase()}`);
  });
  it("Get from database", async () => {
    cityJSON = {};
    cityJSON["name"] = "denek";
    cityJSON["temperature"] = 25;
    const newCity = City.build(cityJSON);
    await newCity.save();
    const req = {
      params: {
        city: "denek",
      },
    };
    weatherController
      .getCity(req, {}, () => {})
      .then((result) => {
        expect(result.db).to.equal("true");
      });
  });
  it("Get from openWeather", async () => {
    const req = {
      params: {
        city: "ankara",
      },
    };
    weatherController
      .getCity(req, {}, () => {})
      .then((result) => {
        expect(result.weatherapi).to.equal("true");
      });
  });
  it("Add City ", async () => {
    const req = {
      body: {
        city: "ankara",
      },
    };
    weatherController
      .getCity(req, {}, () => {})
      .then(async (result) => {
        expect(result.saved).to.equal("true");
      });
  });
});
