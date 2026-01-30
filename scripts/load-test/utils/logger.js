const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

// @ts-ignore
function log(msg, color = 'reset') {
  // @ts-ignore
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

module.exports = { log, colors };