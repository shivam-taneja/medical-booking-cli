const { log } = require('../utils/logger');

function helpCommand() {
  console.log('\n' + '─'.repeat(80));
  log('DATABASE MONITOR - Usage', 'cyan');
  console.log('─'.repeat(80));
  console.log('\nCommands:');
  console.log('  pnpm monitor:db              Start real-time monitoring');
  console.log('  pnpm monitor:db stats        Show booking statistics');
  console.log('  pnpm monitor:db clear <min>  Delete bookings older than N minutes');
  console.log('\nExamples:');
  console.log('  pnpm monitor:db              # Start monitoring');
  console.log('  pnpm monitor:db stats        # Show stats');
  console.log('  pnpm monitor:db clear 60     # Delete bookings older than 1 hour');
  console.log('─'.repeat(80) + '\n');
}

module.exports = helpCommand;