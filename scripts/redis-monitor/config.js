module.exports = {
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  // @ts-ignore
  REDIS_PORT: parseInt(process.env.REDIS_PORT) || 6375,
  REFRESH_INTERVAL: 1000, // 1 second
};