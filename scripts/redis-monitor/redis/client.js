const Redis = require('ioredis');
const CONFIG = require('../config');

// @ts-ignore
const redis = new Redis({
  host: CONFIG.REDIS_HOST,
  port: CONFIG.REDIS_PORT,
});

module.exports = redis;