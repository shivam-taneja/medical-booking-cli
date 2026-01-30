/**
 * Redis Quota Monitor - Main Entry Point
 * 
 * Real-time monitoring of discount quota consumption
 * Shows quota counter updates as bookings are processed
 */

const redis = require('./redis/client');
const { log } = require('./utils/logger');
const { monitorQuota } = require('./commands/monitor');
const { healthCheck } = require('./commands/health');
const { runCommand } = require('./commands/run');
const { showHelp } = require('./commands/help');

const args = process.argv.slice(2);

if (args.length === 0) {
  healthCheck().then(() => monitorQuota());
} else if (args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
  showHelp();
} else {
  runCommand(args[0], ...args.slice(1));
}

process.on('SIGINT', () => {
  log('\n\nShutting down gracefully...\n', 'yellow');
  redis.disconnect();
  process.exit(0);
});