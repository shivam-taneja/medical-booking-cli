const redis = require("../redis/client");
const { getTodayIST } = require("../utils/date");
const { log } = require("../utils/logger");
const { healthCheck } = require("./health");
const { showHelp } = require("./help");

// @ts-ignore
async function runCommand(command, ...args) {
  try {
    await healthCheck();
    
    const todayIST = getTodayIST();
    const quotaKey = `discount_quota:${todayIST}`;

    switch (command) {
      case 'get':
        const value = await redis.get(quotaKey);
        log(`\nCurrent quota for ${todayIST}: ${value || 0}\n`, 'cyan');
        break;

      case 'reset':
        await redis.del(quotaKey);
        log(`\nQuota reset for ${todayIST}\n`, 'green');
        break;

      case 'set':
        const newValue = parseInt(args[0]) || 0;
        await redis.set(quotaKey, newValue);
        log(`\nQuota set to ${newValue} for ${todayIST}\n`, 'green');
        break;

      case 'keys':
        const allKeys = await redis.keys('discount_quota:*');
        log(`\nAll Quota Keys:`, 'cyan');
        for (const key of allKeys) {
          const val = await redis.get(key);
          console.log(`   ${key}: ${val}`);
        }
        console.log();
        break;

      case 'clean':
        const keysToDelete = await redis.keys('discount_quota:*');
        if (keysToDelete.length > 0) {
          await redis.del(...keysToDelete);
          log(`\nDeleted ${keysToDelete.length} quota keys\n`, 'green');
        } else {
          log(`\nNo quota keys to delete\n`, 'dim');
        }
        break;

      default:
        log(`\nUnknown command: ${command}`, 'red');
        showHelp();
    }

    process.exit(0);
  } catch (error) {
    log(`\nError: ${error}\n`, 'red');
    process.exit(1);
  }
}

module.exports = { runCommand };
