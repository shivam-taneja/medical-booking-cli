const redis = require('../redis/client');
const CONFIG = require('../config');
const { log } = require('../utils/logger');
const { getTodayIST } = require('../utils/date');

async function monitorQuota() {
  const todayIST = getTodayIST();
  const quotaKey = `discount_quota:${todayIST}`;

  console.clear();
  console.log('─'.repeat(70));
  log('REDIS QUOTA MONITOR - Real-Time Dashboard', 'cyan');
  console.log('─'.repeat(70));
  log(`\nDate: ${todayIST} (IST)`, 'bright');
  log(`Redis Key: ${quotaKey}`, 'dim');
  log(`Refresh Rate: ${CONFIG.REFRESH_INTERVAL}ms`, 'dim');
  console.log('─'.repeat(70));

  // @ts-ignore
  let previousCount = null;
  let updateCount = 0;

  setInterval(async () => {
    try {
      // Get current quota count
      const currentCount = await redis.get(quotaKey);
      const count = currentCount ? parseInt(currentCount) : 0;

      // Get TTL
      const ttl = await redis.ttl(quotaKey);

      // Clear previous line
      process.stdout.write('\r' + ' '.repeat(70) + '\r');

      // Show current status
      const timestamp = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
      
      let statusColor = 'green';
      if (count > 80) statusColor = 'yellow';
      if (count >= 100) statusColor = 'red';

      // @ts-ignore
      const change = previousCount !== null ? count - previousCount : 0;
      const changeSymbol = change > 0 ? '↑' : change < 0 ? '↓' : '→';
      const changeStr = change !== 0 ? ` (${changeSymbol}${Math.abs(change)})` : '';

      log(`\n${timestamp}`, 'dim');
      log(`Current Quota Usage: ${count}${changeStr}`, statusColor);
      
      if (ttl > 0) {
        const hours = Math.floor(ttl / 3600);
        const minutes = Math.floor((ttl % 3600) / 60);
        log(`TTL: ${hours}h ${minutes}m`, 'dim');
      } else if (count === 0) {
        log(`No quota consumed yet today`, 'dim');
      }

      // Update counter
      if (change !== 0) {
        updateCount++;
        log(`\nUpdate #${updateCount} detected!`, 'yellow');
      }

      previousCount = count;

      // Show all quota keys
      const allKeys = await redis.keys('discount_quota:*');
      if (allKeys.length > 1) {
        log(`\nAll Quota Keys:`, 'cyan');
        for (const key of allKeys) {
          const value = await redis.get(key);
          const keyDate = key.replace('discount_quota:', '');
          const isToday = keyDate === todayIST;
          log(`   ${isToday ? '→' : ' '} ${keyDate}: ${value}`, isToday ? 'bright' : 'dim');
        }
      }

      // Show idempotency keys (optional)
      const idempotencyKeys = await redis.keys('processed_booking:*');
      if (idempotencyKeys.length > 0) {
        log(`\nProcessed Bookings (Idempotency): ${idempotencyKeys.length}`, 'dim');
      }

      console.log('─'.repeat(70));
      log('Press Ctrl+C to exit', 'dim');

    } catch (error) {
      // @ts-ignore
      log(`\nError: ${error.message}`, 'red');
    }
  }, CONFIG.REFRESH_INTERVAL);
}

module.exports = { monitorQuota };