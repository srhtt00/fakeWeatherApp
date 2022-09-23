const Sequelize = require("sequelize");
const keys = require("../keys");
const sequelize = new Sequelize(keys.pgUser, keys.pgDatabase, keys.pgPassword, {
  dialect: "postgres",
  host: keys.pgHost,
});
module.exports = sequelize;
