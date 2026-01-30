// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// @ts-ignore
function log(message, color = 'white') {
  // @ts-ignore
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// @ts-ignore
function logSuccess(message) {
  log(`S: \n${message}\n`, 'green');
}

// @ts-ignore
function logError(message) {
  log(`E: \n${message}\n`, 'red');
}

// @ts-ignore
function logInfo(message) {
  log(`I: \n${message}\n`, 'cyan');
}

// @ts-ignore
function logWarning(message) {
  log(`W: \n${message}\n`, 'yellow');
}

// @ts-ignore
function logProcessing(message) {
  log(`P: \n${message}\n`, 'blue');
}

module.exports = { log, logSuccess, logError, logInfo, logWarning, logProcessing };