const CONFIG = {
  BOOKING_API: process.env.BOOKING_API || 'http://localhost:3000',
  POLL_INTERVAL: 1000, // 1 second
  MAX_POLL_ATTEMPTS: 120, // 2 minutes max
};

const MEDICAL_SERVICES = {
  1: { name: 'General Consultation', price: 500 },
  2: { name: 'Blood Test', price: 300 },
  3: { name: 'X-Ray', price: 1200 },
  4: { name: 'MRI Scan', price: 5000 },
  5: { name: 'Dental Cleaning', price: 800 },
  6: { name: 'Vaccination', price: 150 },
};

module.exports = { CONFIG, MEDICAL_SERVICES };