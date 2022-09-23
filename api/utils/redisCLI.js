const redis = require("redis");
const keys = require("../keys");
const redisClient = redis.createClient({
  url: keys.redisURL,
  retry_strategy: () => 1000,
});

module.exports = redisClient;
