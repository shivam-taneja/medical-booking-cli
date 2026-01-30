module.exports = {
  BOOKING_API: process.env.BOOKING_API || 'http://localhost:3000',
  // @ts-ignore
  CONCURRENT_USERS: parseInt(process.env.CONCURRENT_USERS) || 50,
  // @ts-ignore
  REQUESTS_PER_USER: parseInt(process.env.REQUESTS_PER_USER) || 1,
  // @ts-ignore
  RAMP_UP_TIME: parseInt(process.env.RAMP_UP_TIME) || 0, // ms between user starts
};