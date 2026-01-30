const { log } = require('../utils/logger');
const { makeRequest } = require('../utils/http');

async function testInvalidServices() {
  console.log('\n' + '─'.repeat(70));
  log('TEST 4: INVALID SERVICE NAMES', 'cyan');
  console.log('─'.repeat(70));
  
  log('\nScenario:', 'yellow');
  console.log('   Submit booking with non-existent service names');
  console.log('   Expected: Validation error before booking is created');
  console.log('─'.repeat(70));

  const testCases = [
    {
      name: 'Invalid Service',
      data: {
        userId: 'test_user',
        gender: 'Male',
        dob: '1990-01-01',
        serviceNames: ['Brain Surgery', 'Magic Healing'],
      },
    },
    {
      name: 'Empty Services',
      data: {
        userId: 'test_user',
        gender: 'Male',
        dob: '1990-01-01',
        serviceNames: [],
      },
    },
    {
      name: 'Mixed Valid/Invalid',
      data: {
        userId: 'test_user',
        gender: 'Male',
        dob: '1990-01-01',
        serviceNames: ['Blood Test', 'Unicorn Therapy'],
      },
    },
  ];

  for (const testCase of testCases) {
    log(`\nTesting: ${testCase.name}`, 'yellow');
    
    try {
      // @ts-ignore
      const res = await makeRequest('POST', '/booking', testCase.data);
      
      if (res.statusCode === 400) {
        log(`   Correctly rejected with validation error`, 'green');
        log(`   Message: ${res.data.message}`, 'dim');
      } else {
        log(`   Unexpected: Booking created (${res.data.bookingId})`, 'red');
      }
    } catch (e) {
      log(`   Network error: ${e}`, 'yellow');
    }
  }

  console.log('\n');
}

module.exports = { testInvalidServices };