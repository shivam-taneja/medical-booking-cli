const { client } = require('../db/client');
const queries = require('../db/queries');
const { log } = require('../utils/logger');

async function clearCommand(olderThanMinutes = 60) {
  try {
    await client.connect();

    const result = await client.query(queries.deleteOldBookings(olderThanMinutes));

    log(`\nDeleted ${result.rowCount} bookings older than ${olderThanMinutes} minutes\n`, 'green');
    
    await client.end();
    process.exit(0);
  } catch (error) {
    log(`\nError: ${error}\n`, 'red');
    process.exit(1);
  }
}

module.exports = clearCommand;