const { log } = require('../utils/logger');
const { makeRequest } = require('../utils/http-client');

async function runQuotaTest(quotaLimit = 100) {
  console.log('\n' + '─'.repeat(70));
  log('QUOTA EXHAUSTION TEST', 'cyan');
  console.log('─'.repeat(70));
  
  log(`\nTest Setup:`, 'yellow');
  console.log(`   Daily Quota Limit: ${quotaLimit}`);
  console.log(`   Test Requests: ${quotaLimit + 20} (over limit)`);
  console.log(`   All requests qualify for discount (high-value orders)`);
  console.log('─'.repeat(70));

  log('\nSubmitting requests...\n', 'green');

  const stats = {
    confirmed: 0,
    rejected: 0,
    quotaRejected: 0,
    pending: 0,
  };

  const promises = [];
  
  // Submit quota + 20 requests
  for (let i = 0; i < quotaLimit + 20; i++) {
    const bookingData = {
      userId: `quota_test_${i}`,
      gender: 'Male',
      dob: '1990-01-15',
      serviceNames: ['X-Ray', 'MRI Scan'], // High-value to trigger discount
    };

    // @ts-ignore
    const promise = makeRequest('POST', '/booking', bookingData)
      .then(async (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          // Poll for result
          const bookingId = res.data.bookingId;
          
          for (let attempt = 0; attempt < 60; attempt++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            try {
              const statusRes = await makeRequest('GET', `/booking/${bookingId}`);
              const status = statusRes.data.status;
              
              if (status === 'CONFIRMED') {
                stats.confirmed++;
                process.stdout.write(`\rConfirmed: ${stats.confirmed} | Rejected: ${stats.rejected} (Quota: ${stats.quotaRejected})`);
                break;
              } else if (status === 'REJECTED') {
                stats.rejected++;
                if (statusRes.data.failReason && statusRes.data.failReason.includes('quota')) {
                  stats.quotaRejected++;
                }
                process.stdout.write(`\rConfirmed: ${stats.confirmed} | Rejected: ${stats.rejected} (Quota: ${stats.quotaRejected})`);
                break;
              }
            } catch (e) {
              // Ignore
            }
          }
        }
      })
      .catch(() => {
        stats.rejected++;
      });

    promises.push(promise);
    
    // Small delay to avoid overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  await Promise.all(promises);

  // Results
  console.log('\n\n' + '─'.repeat(70));
  log('QUOTA TEST RESULTS', 'cyan');
  console.log('─'.repeat(70));

  log(`\nConfirmed (Within Quota): ${stats.confirmed}`, 'green');
  log(`Rejected (Quota Exhausted): ${stats.quotaRejected}`, 'yellow');
  log(`Other Rejections: ${stats.rejected - stats.quotaRejected}`, stats.rejected > stats.quotaRejected ? 'red' : 'dim');

  console.log('\n' + '─'.repeat(70));
  
  if (stats.confirmed <= quotaLimit && stats.quotaRejected > 0) {
    log('Quota enforcement working correctly!', 'green');
  } else if (stats.confirmed > quotaLimit) {
    log('Warning: More bookings confirmed than quota limit!', 'red');
  }
  
  console.log('\n');
}

module.exports = { runQuotaTest };