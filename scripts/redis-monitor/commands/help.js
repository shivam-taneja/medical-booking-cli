const { log } = require('../utils/logger');

function showHelp() {
  console.log('\n' + '─'.repeat(70));
  log('REDIS QUOTA MONITOR - Usage', 'cyan');
  console.log('─'.repeat(70));
  console.log('\nCommands:');
  console.log('  pnpm monitor:redis              Start real-time monitoring');
  console.log('  pnpm monitor:redis get          Get current quota count');
  console.log('  pnpm monitor:redis reset        Reset today\'s quota to 0');
  console.log('  pnpm monitor:redis set <num>    Set quota to specific number');
  console.log('  pnpm monitor:redis keys         List all quota keys');
  console.log('  pnpm monitor:redis clean        Delete all quota keys');
  console.log('\nExamples:');
  console.log('  pnpm monitor:redis set 95       # Set quota to 95');
  console.log('  pnpm monitor:redis reset        # Reset quota to 0');
  console.log('─'.repeat(70) + '\n');
}

module.exports = { showHelp };