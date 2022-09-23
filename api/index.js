const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const redisCLI = require("./utils/redisCLI");
const pgCLI = require("./utils/postgresCLI");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const weatherRoute = require("./routes/weatherRoute");

app.use("/weather", weatherRoute);

app.listen(8080, () => {
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
