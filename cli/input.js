const readline = require('readline');
const { MEDICAL_SERVICES } = require('./config');
const { log } = require('./logger');

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

function printServices() {
  log('\nAvailable Medical Services:', 'bright');
  console.log('─'.repeat(60));
  Object.entries(MEDICAL_SERVICES).forEach(([key, service]) => {
    console.log(`  ${key}. ${service.name.padEnd(25)} ₹${service.price}`);
  });
  console.log('─'.repeat(60) + '\n');
}

async function collectUserInput() {
  log('\nEnter Booking Details:', 'bright');
  console.log('─'.repeat(60));

  const userId = await askQuestion('  User ID: ');
  const gender = await askQuestion('  Gender (Male/Female/Other): ');
  const dob = await askQuestion('  Date of Birth (YYYY-MM-DD): ');

  printServices();

  const servicesInput = await askQuestion('  Select services (comma-separated numbers, e.g., 1,3): ');
  // @ts-ignore
  const selectedNumbers = servicesInput.split(',').map(s => s.trim());

  const serviceNames = [];
  let totalPrice = 0;

  console.log('\n  Selected Services:');
  for (const num of selectedNumbers) {
    // @ts-ignore
    const service = MEDICAL_SERVICES[num];
    if (service) {
      serviceNames.push(service.name);
      totalPrice += service.price;
      log(`    • ${service.name} - ₹${service.price}`, 'dim');
    }
  }

  console.log('─'.repeat(60));
  log(`  Base Price: ₹${totalPrice}`, 'bright');
  console.log('─'.repeat(60) + '\n');

  return {
    userId,
    gender,
    dob,
    serviceNames,
  };
}

module.exports = { askQuestion, collectUserInput };