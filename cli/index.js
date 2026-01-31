/**
 * Interactive CLI for Medical Booking System Demo
 * 
 * This tool demonstrates the end-to-end user flow:
 * 1. User provides booking details
 * 2. System creates booking (PENDING)
 * 3. CLI polls status in real-time
 * 4. Shows final result (CONFIRMED/REJECTED)
 */

const { log, logSuccess, logError, logWarning, logProcessing, logInfo } = require('./utils/logger');
const { makeRequest } = require('./utils/api');
const { askQuestion, collectUserInput } = require('./utils/input');
const { pollBookingStatus } = require('./utils/polling');

function printHeader() {
  log('MEDICAL BOOKING SYSTEM - INTERACTIVE CLI', 'cyan');
}

async function runDemo() {
  try {
    printHeader();

    const bookingData = await collectUserInput();

    const confirm = await askQuestion('Submit booking request? (yes/no): ');
    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      logWarning('Booking cancelled.');
      return;
    }

    console.log('\n' + '─'.repeat(60));
    logProcessing('Submitting booking request...');

    // @ts-ignore
    const response = await makeRequest('POST', '/booking', bookingData);

    logSuccess(`Booking created: ${response.bookingId}`);
    logInfo(`Status: ${response.status}`);
    console.log('─'.repeat(60) + '\n');

    await pollBookingStatus(response.bookingId);

    const another = await askQuestion('\nCreate another booking? (yes/no): ');
    if (another.toLowerCase() === 'yes' || another.toLowerCase() === 'y') {
      runDemo();
    } else {
      log('\nThank you for using the Medical Booking System!\n', 'cyan');
    }

  } catch (error) {
    // @ts-ignore
    logError(`Error: ${error.message}\n`);

    const retry = await askQuestion('Try again? (yes/no): ');
    if (retry.toLowerCase() === 'yes' || retry.toLowerCase() === 'y') {
      runDemo();
    } else {
      process.exit(1);
    }
  }
}

// @ts-ignore
async function runTestScenario(scenarioName) {
  printHeader();
  log(`Running Test Scenario: ${scenarioName}`, 'yellow');
  console.log('─'.repeat(60) + '\n');

  let bookingData;

  switch (scenarioName) {
    case 'positive':
      const today = new Date().toISOString().split('T')[0];
      bookingData = {
        userName: 'user_123',
        gender: 'Female',
        dob: today.replace(/^\d{4}/, '1995'),
        serviceNames: ['Blood Test', 'Vaccination'],
      };
      logInfo('Test Case: Female user on birthday with quota available');
      break;

    case 'banned':
      bookingData = {
        userName: 'fail_test_user',
        gender: 'Male',
        dob: '1990-05-15',
        serviceNames: ['MRI Scan'],
      };
      logInfo('Test Case: Banned user rejection');
      break;

    case 'quota':
      bookingData = {
        userName: 'user_456',
        gender: 'Male',
        dob: '1988-03-20',
        serviceNames: ['X-Ray', 'MRI Scan'],
      };
      logInfo('Test Case: High-value order (may hit quota limit)');
      break;

    default:
      logError('Unknown scenario. Use: positive, banned, or quota');
      return;
  }

  console.log('\nBooking Data:');
  console.log(JSON.stringify(bookingData, null, 2));
  console.log('\n' + '─'.repeat(60));

  try {
    logProcessing('Submitting booking...');
    // @ts-ignore
    const response = await makeRequest('POST', '/booking', bookingData);
    logSuccess(`Booking created: ${response.bookingId}`);
    console.log('─'.repeat(60) + '\n');

    await pollBookingStatus(response.bookingId);
  } catch (error) {
    // @ts-ignore
    logError(`Test failed: ${error.message}`);
  }
}

const args = process.argv.slice(2);

if (args.length > 0 && args[0] === 'test') {
  const scenario = args[1] || 'positive';
  runTestScenario(scenario);
} else {
  runDemo();
}