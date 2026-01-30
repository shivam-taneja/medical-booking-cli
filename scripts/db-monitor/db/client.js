const { Client } = require('pg');
const config = require('../config');
const { log } = require('../utils/logger');

const client = new Client({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
});

async function healthCheck() {
  try {
    await client.connect();
    await client.query('SELECT 1');
    log('Connected to PostgreSQL successfully!\n', 'green');
    return true;
  } catch (error) {
    // @ts-ignore
    log(`Failed to connect to PostgreSQL: ${error.message}`, 'red');
    process.exit(1);
  }
}

module.exports = {
  client,
  healthCheck,
};