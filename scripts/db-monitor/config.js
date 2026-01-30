module.exports = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  // @ts-ignore
  DB_PORT: parseInt(process.env.DB_PORT) || 5435,
  DB_USER: process.env.DB_USERNAME || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'dev_password',
  DB_NAME: process.env.DB_NAME || 'dev_db',
  REFRESH_INTERVAL: 2000, // 2 seconds
};