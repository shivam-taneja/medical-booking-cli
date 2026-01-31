const CONFIG = {
  BOOKING_API: process.env.BOOKING_API || 'http://localhost:3000',
  POLL_INTERVAL: 1000, // 1 second
  MAX_POLL_ATTEMPTS: 120, // 2 minutes max
};

module.exports = { CONFIG };