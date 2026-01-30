/**
 * Database Monitor - Main Entry Point
 * 
 * Real-time monitoring of booking status changes in PostgreSQL
 * Shows bookings as they transition: PENDING → CONFIRMED/REJECTED
 */

const { healthCheck, client } = require('./db/client');
const monitorCommand = require('./commands/monitor');
const statsCommand = require('./commands/stats');
const clearCommand = require('./commands/clear');
const helpCommand = require('./commands/help');
const { log } = require('./utils/logger');

// Parse command line arguments
const args = process.argv.slice(2);

// Main execution
(async () => {
  if (args.length === 0) {
    // Start monitoring
    await healthCheck();
    await monitorCommand();
  } else if (args[0] === 'stats') {
    await statsCommand();
  } else if (args[0] === 'clear') {
    const minutes = parseInt(args[1]) || 60;
    await clearCommand(minutes);
  } else if (args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    helpCommand();
  } else {
    log(`\nUnknown command: ${args[0]}`, 'red');
    helpCommand();
  }
})();

process.on('SIGINT', async () => {
  log('\n\nShutting down gracefully...\n', 'yellow');
  await client.end();
  process.exit(0);
});