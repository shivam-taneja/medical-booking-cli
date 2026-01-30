const { log } = require('../utils/logger');
const { makeRequest, wait } = require('../utils/http');

async function testQuotaBoundaryRace() {
  console.log('\n' + '─'.repeat(70));
  log('TEST 2: QUOTA BOUNDARY RACE CONDITION', 'cyan');
  console.log('─'.repeat(70));
  
  log('\nScenario:', 'yellow');
  console.log('   Submit multiple requests when quota is at limit - 1');
  console.log('   Expected: Only ONE request should get the last quota slot');
  console.log('   System should handle race condition correctly');
  console.log('─'.repeat(70));

  log('\nManual Setup Required:', 'yellow');
  console.log('   1. Run: node redis-monitor.js set 99');
  console.log('   2. Then run this test');
  console.log('   3. Observe that only 1 booking gets confirmed');
  console.log('\n   Press Enter when ready...');

  await new Promise(resolve => {
    // @ts-ignore
    process.stdin.once('data', () => resolve());
  });

  log('\nSubmitting 10 concurrent high-value bookings...', 'green');

  const promises = Array(10).fill(null).map((_, i) => 
    // @ts-ignore
    makeRequest('POST', '/booking', {
      userId: `race_test_${i}`,
      gender: 'Male',
      dob: '1990-01-01',
      serviceNames: ['X-Ray', 'MRI Scan'],
    })
  );

  const results = await Promise.all(promises);
  const bookingIds = results
    .filter(r => r.data.bookingId)
    .map(r => r.data.bookingId);

  log(`\nSubmitted ${bookingIds.length} bookings`, 'cyan');
  log('Waiting for processing (10s)...', 'dim');
  
  await wait(10000);

  const statuses = { confirmed: 0, rejected: 0, pending: 0 };
  
  for (const bookingId of bookingIds) {
    try {
      const res = await makeRequest('GET', `/booking/${bookingId}`);
      const status = res.data.status;
      
      if (status === 'CONFIRMED') statuses.confirmed++;
      else if (status === 'REJECTED') statuses.rejected++;
      else statuses.pending++;
    } catch (e) {
    }
  }

  log('\nFinal Results:', 'cyan');
  console.log(`   Confirmed: ${statuses.confirmed}`);
  console.log(`   Rejected (Quota): ${statuses.rejected}`);
  console.log(`   Still Pending: ${statuses.pending}`);

  if (statuses.confirmed === 1 && statuses.rejected === 9) {
    log('\nPASS: Only 1 booking confirmed at quota boundary', 'green');
  } else if (statuses.confirmed > 1) {
    log(`\nFAIL: ${statuses.confirmed} bookings confirmed (quota leak)`, 'red');
  } else {
    log(`\nUNEXPECTED: Check Redis for quota value`, 'yellow');
  }

  console.log('\n');
}

module.exports = { testQuotaBoundaryRace };