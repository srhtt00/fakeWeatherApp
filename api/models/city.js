const pgCLI = require("../utils/postgresCLI");
const Sequelize = require("sequelize");
const sequelize = require("../utils/postgresCLI");
const City = sequelize.define("city", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  temperature: { type: Sequelize.STRING, allowNull: false },
});
module.exports = City;
