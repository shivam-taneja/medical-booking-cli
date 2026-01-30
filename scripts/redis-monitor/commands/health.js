const CONFIG = require("../config");
const redis = require("../redis/client");
const { log } = require("../utils/logger");

async function healthCheck() {
  try {
    await redis.ping();
    log('Connected to Redis successfully!\n', 'green');
    return true;
  } catch (error) {
    log(`Failed to connect to Redis: ${error}`, 'red');
    log(`\nConfiguration:`, 'yellow');
    console.log(`   Host: ${CONFIG.REDIS_HOST}`);
    console.log(`   Port: ${CONFIG.REDIS_PORT}`);
    console.log('\nPlease check your Redis connection settings.\n');
    process.exit(1);
  }
}

module.exports = { healthCheck };