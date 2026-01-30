const { log } = require('../utils/logger');
const { makeRequest, wait } = require('../utils/http');

async function testRapidSequentialRequests() {
  console.log('\n' + '─'.repeat(70));
  log('TEST 3: RAPID SEQUENTIAL REQUESTS (Same User)', 'cyan');
  console.log('─'.repeat(70));
  
  log('\nScenario:', 'yellow');
  console.log('   User clicks "Submit" button multiple times rapidly');
  console.log('   Expected: System should handle gracefully');
  console.log('   No duplicate bookings for same user+services');
  console.log('─'.repeat(70));

  const bookingData = {
    userId: 'rapid_test_user',
    gender: 'Male',
    dob: '1988-12-01',
    serviceNames: ['General Consultation', 'Blood Test'],
  };

  log('\nSubmitting 5 requests with 100ms delay...', 'green');

  const bookingIds = [];

  for (let i = 0; i < 5; i++) {
    try {
      // @ts-ignore
      const res = await makeRequest('POST', '/booking', bookingData);
      if (res.data.bookingId) {
        bookingIds.push(res.data.bookingId);
        log(`   Request ${i + 1}: Created ${res.data.bookingId}`, 'dim');
      }
    } catch (e) {
      log(`   Request ${i + 1}: Failed`, 'red');
    }
    await wait(100);
  }

  log(`\nCreated ${bookingIds.length} bookings`, 'cyan');

  if (bookingIds.length === 5) {
    log('\nISSUE: All 5 requests created separate bookings', 'red');
    log('   Recommendation: Add user-level idempotency check', 'yellow');
    log('   E.g., Check if user has PENDING booking for same services', 'dim');
  } else if (bookingIds.length === 1) {
    log('\nGOOD: Only 1 booking created despite multiple clicks', 'green');
  }

  console.log('\n');
}

module.exports = { testRapidSequentialRequests };