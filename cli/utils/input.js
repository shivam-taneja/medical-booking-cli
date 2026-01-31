const readline = require('readline');
const { log } = require('./logger');
const { makeRequest } = require('./api');

// @ts-ignore
// @ts-ignore
async function fetchAvailableServices(gender) {
  try {
    return await makeRequest('GET', `/booking/services?gender=${gender}`);
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', `\nError: Could not fetch services. Is the backend running?`);
    console.log(`Details: ${error}`);
    process.exit(1);
  }
}

// @ts-ignore
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// @ts-ignore
function printServices(services) {
  log('\nAvailable Medical Services:', 'bright');
  console.log('─'.repeat(60));

  if (services.length === 0) {
    console.log('  No services available for this gender.');
  }

  // @ts-ignore
  services.forEach((service, index) => {
    const displayId = index + 1; 
    console.log(`  ${displayId}. ${service.name.padEnd(25)} ₹${service.price}`);
  });

  console.log('─'.repeat(60) + '\n');
}

async function collectUserInput() {
  log('\nEnter Booking Details:', 'bright');
  console.log('─'.repeat(60));

  const userName = await askQuestion('  User Name: ');
  const gender = await askQuestion('  Gender (Male/Female/Other): ');
  const dob = await askQuestion('  Date of Birth (YYYY-MM-DD): ');

  console.log('\n  Fetching gender-specific services...');
  
  const availableServices = await fetchAvailableServices(gender);

  printServices(availableServices);

  const servicesInput = await askQuestion('  Select services (comma-separated numbers, e.g., 1,3): ');
  // @ts-ignore
  const selectedNumbers = servicesInput.split(',').map(s => s.trim());

  const serviceNames = [];
  let totalPrice = 0;

  console.log('\n  Selected Services:');
  for (const num of selectedNumbers) {
    const index = parseInt(num) - 1; // Convert "1" to index 0
    const service = availableServices[index];

    if (service) {
      serviceNames.push(service.name);
      totalPrice += service.price;
      log(`    • ${service.name} - ₹${service.price}`, 'dim');
    } else {
      console.log(`    x Invalid selection: ${num}`);
    }
  }

  console.log('─'.repeat(60));
  log(`  Base Price: ₹${totalPrice}`, 'bright');
  console.log('─'.repeat(60) + '\n');

  return {
    userName,
    gender,
    dob,
    serviceNames,
  };
}

module.exports = { askQuestion, collectUserInput };