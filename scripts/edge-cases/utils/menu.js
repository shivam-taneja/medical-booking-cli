const { log } = require('./logger');

function showMenu() {
  console.log('\n' + '─'.repeat(70));
  log(' EDGE CASE TEST SUITE', 'cyan');
  console.log('─'.repeat(70));
  console.log('\nAvailable Tests:');
  console.log('  1. Duplicate Booking (Idempotency at HTTP layer)');
  console.log('  2. Quota Boundary Race Condition');
  console.log('  3. Rapid Sequential Requests (Same User)');
  console.log('  4. Invalid Service Names (Validation)');
  console.log('  all. Run all tests');
  console.log('\nUsage:');
  console.log('  node edge-cases.js <test-number>');
  console.log('\nExamples:');
  console.log('  node edge-cases.js 1');
  console.log('  node edge-cases.js all');
  console.log('─'.repeat(70) + '\n');
}

module.exports = { showMenu };