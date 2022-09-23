const express = require("express");
const router = express.Router();

const cityController = require("../controllers/weatherController");

router.post("/add", cityController.addCity);

router.get("/:city", cityController.getCity);

router.use("/:city", cityController.cachedCity);

module.exports = router;
