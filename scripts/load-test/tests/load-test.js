const config = require('../config');
const { log } = require('../utils/logger');
const { makeRequest } = require('../utils/http-client');
const { generateRandomBooking } = require('../utils/data-generator');

// @ts-ignore
async function simulateUser(userIndex, stats) {
  for (let i = 0; i < config.REQUESTS_PER_USER; i++) {
    try {
      const bookingData = generateRandomBooking(userIndex);
      const startTime = Date.now();
      
      // @ts-ignore
      const response = await makeRequest('POST', '/booking', bookingData);
      const duration = Date.now() - startTime;

      if (response.statusCode === 201 || response.statusCode === 200) {
        stats.successful++;
        stats.totalResponseTime += duration;
        
        process.stdout.write(`\rSuccess: ${stats.successful} | Failed: ${stats.failed} | Avg: ${Math.round(stats.totalResponseTime / stats.successful)}ms`);
      } else {
        stats.failed++;
        stats.errors.push({
          user: userIndex,
          status: response.statusCode,
          message: response.data.message || 'Unknown error',
        });
      }
    } catch (error) {
      stats.failed++;
      stats.errors.push({
        user: userIndex,
        // @ts-ignore
        error: error.message,
      });
    }
  }
}

async function runLoadTest() {
  console.log('\n' + '─'.repeat(70));
  log('LOAD TEST - Medical Booking System', 'cyan');
  console.log('─'.repeat(70));
  
  log(`\nConfiguration:`, 'yellow');
  console.log(`   Concurrent Users: ${config.CONCURRENT_USERS}`);
  console.log(`   Requests per User: ${config.REQUESTS_PER_USER}`);
  console.log(`   Total Requests: ${config.CONCURRENT_USERS * config.REQUESTS_PER_USER}`);
  console.log(`   Target: ${config.BOOKING_API}`);
  console.log('─'.repeat(70));

  const stats = {
    successful: 0,
    failed: 0,
    confirmed: 0,
    rejected: 0,
    timeout: 0,
    totalResponseTime: 0,
    errors: [],
    startTime: Date.now(),
  };

  log('\nStarting load test...\n', 'green');

  // Create promises for all users
  const userPromises = [];
  for (let i = 0; i < config.CONCURRENT_USERS; i++) {
    if (config.RAMP_UP_TIME > 0) {
      await new Promise(resolve => setTimeout(resolve, config.RAMP_UP_TIME));
    }
    userPromises.push(simulateUser(i, stats));
  }

  // Wait for all users to complete
  await Promise.all(userPromises);

  const totalTime = Date.now() - stats.startTime;

  // Print results
  console.log('\n\n' + '─'.repeat(70));
  log('LOAD TEST RESULTS', 'cyan');
  console.log('─'.repeat(70));

  log(`\nSuccessful Requests: ${stats.successful}`, 'green');
  log(`Failed Requests: ${stats.failed}`, stats.failed > 0 ? 'red' : 'dim');
  
  if (stats.confirmed > 0 || stats.rejected > 0) {
    log(`\nFinal Status Distribution:`, 'yellow');
    console.log(`   Confirmed: ${stats.confirmed}`);
    console.log(`   Rejected: ${stats.rejected}`);
    console.log(`   Timeout/Pending: ${stats.timeout}`);
  }

  log(`\nPerformance Metrics:`, 'yellow');
  console.log(`   Total Duration: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`   Requests per Second: ${((stats.successful + stats.failed) / (totalTime / 1000)).toFixed(2)}`);
  console.log(`   Avg Response Time: ${Math.round(stats.totalResponseTime / stats.successful)}ms`);

  if (stats.errors.length > 0) {
    log(`\nErrors (showing first 10):`, 'red');
    stats.errors.slice(0, 10).forEach((err, idx) => {
      // @ts-ignore
      console.log(`   ${idx + 1}. User ${err.user}: ${err.message || err.error}`);
    });
    if (stats.errors.length > 10) {
      log(`   ... and ${stats.errors.length - 10} more errors`, 'dim');
    }
  }

  console.log('─'.repeat(70) + '\n');

  // Success rate check
  const successRate = (stats.successful / (stats.successful + stats.failed)) * 100;
  if (successRate < 95) {
    log(`Warning: Success rate is ${successRate.toFixed(1)}% (below 95%)`, 'yellow');
  }
}

module.exports = { runLoadTest };