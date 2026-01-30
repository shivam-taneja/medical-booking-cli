const { log } = require('../utils/logger');
const { makeRequest, wait } = require('../utils/http');

async function testDuplicateBooking() {
  console.log('\n' + '─'.repeat(70));
  log('TEST 1: DUPLICATE BOOKING (Idempotency)', 'cyan');
  console.log('─'.repeat(70));
  
  log('\nScenario:', 'yellow');
  console.log('   Submit the same booking request multiple times rapidly');
  console.log('   Expected: Only ONE booking should be created');
  console.log('   System should detect duplicates and ignore them');
  console.log('─'.repeat(70));

  const bookingData = {
    userId: 'duplicate_test_user',
    gender: 'Female',
    dob: '1995-05-15',
    serviceNames: ['Blood Test', 'X-Ray'],
  };

  log('\nSubmitting 5 identical requests simultaneously...', 'green');
  
  const promises = Array(5).fill(null).map((_, i) => 
    // @ts-ignore
    makeRequest('POST', '/booking', bookingData)
      .then(res => ({ attempt: i + 1, ...res }))
  );

  const results = await Promise.all(promises);

  const bookingIds = new Set();
  const successCount = results.filter(r => r.statusCode === 200 || r.statusCode === 201).length;
  
  results.forEach(r => {
    if (r.data.bookingId) {
      bookingIds.add(r.data.bookingId);
    }
  });

  log('\nResults:', 'cyan');
  console.log(`   Total Requests: 5`);
  console.log(`   Successful: ${successCount}`);
  console.log(`   Unique Booking IDs: ${bookingIds.size}`);

  if (bookingIds.size === 5) {
    log('\nFAIL: Created 5 bookings (no idempotency protection at HTTP layer)', 'red');
    log('   Issue: Booking service accepts duplicate POST requests', 'dim');
    log('   Each request creates a new PENDING booking in DB', 'dim');
  } else if (bookingIds.size === 1) {
    log('\nPASS: Only 1 booking created (idempotency works)', 'green');
  } else {
    log(`\nPARTIAL: Created ${bookingIds.size} bookings (expected 1 or 5)`, 'yellow');
  }

  console.log('─'.repeat(70));
  
  log('\nTracking booking outcomes...', 'dim');
  await wait(3000);
  
  for (const bookingId of bookingIds) {
    try {
      const status = await makeRequest('GET', `/booking/${bookingId}`);
      console.log(`   ${bookingId}: ${status.data.status}`);
    } catch (e) {
    }
  }

  console.log('\n');
}

module.exports = { testDuplicateBooking };