/**
 * Edge Case Testing Script
 * 
 * Tests critical edge cases and failure scenarios:
 * 1. Duplicate booking attempts (idempotency)
 * 2. Quota boundary race conditions
 * 3. Service crash simulation
 * 4. Timeout scenarios
 */

const { showMenu } = require('./utils/menu');
const { testDuplicateBooking } = require('./tests/duplicate-booking');
const { testQuotaBoundaryRace } = require('./tests/quota-race');
const { testRapidSequentialRequests } = require('./tests/rapid-requests');
const { testInvalidServices } = require('./tests/invalid-services');
const { log } = require('./utils/logger');

const args = process.argv.slice(2);

if (args.length === 0) {
  showMenu();
  process.exit(0);
}

const testNumber = args[0];

async function runTests() {
  switch (testNumber) {
    case '1':
      await testDuplicateBooking();
      break;
    case '2':
      await testQuotaBoundaryRace();
      break;
    case '3':
      await testRapidSequentialRequests();
      break;
    case '4':
      await testInvalidServices();
      break;
    case 'all':
      await testDuplicateBooking();
      await testRapidSequentialRequests();
      await testInvalidServices();
      log('\nSkipping Test 2 (Quota Race) - requires manual setup', 'yellow');
      break;
    default:
      log(`\nUnknown test: ${testNumber}`, 'red');
      showMenu();
  }

  process.exit(0);
}

runTests();