const colors = require('./colors');

// @ts-ignore
function log(msg, color = 'reset') {
  // @ts-ignore
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

module.exports = { log };