const { CONFIG } = require('../config');
const { makeRequest } = require('./api');
const { log, logSuccess, logError, logInfo, logProcessing, logWarning } = require('./logger');

// @ts-ignore
async function pollBookingStatus(bookingId) {
  let attempts = 0;
  let lastStatus = 'PENDING';

  logProcessing(`Monitoring Booking ${bookingId}...`);
  console.log('');

  while (attempts < CONFIG.MAX_POLL_ATTEMPTS) {
    try {
      const booking = await makeRequest('GET', `/booking/${bookingId}`);
      const currentStatus = booking.status;

      if (currentStatus !== lastStatus) {
        logInfo(`Status Update: ${lastStatus} → ${currentStatus}`);
        lastStatus = currentStatus;
      }

      if (currentStatus === 'CONFIRMED') {
        console.log('\n' + '═'.repeat(60));
        logSuccess('BOOKING CONFIRMED!');
        console.log('═'.repeat(60));
        log(`\n  Booking ID: ${booking.id}`, 'bright');
        log(`  Base Price: ₹${booking.basePrice}`, 'dim');
        log(`  Final Price: ₹${booking.finalPrice}`, 'green');
        log(`  Discount: ₹${booking.basePrice - booking.finalPrice} (${Math.round((1 - booking.finalPrice / booking.basePrice) * 100)}%)`, 'green');
        console.log('\n  History:');
        // @ts-ignore
        booking.history.forEach(h => log(`    ${h}`, 'dim'));
        console.log('═'.repeat(60) + '\n');
        return booking;
      }

      if (currentStatus === 'REJECTED') {
        console.log('\n' + '═'.repeat(60));
        logError('BOOKING REJECTED');
        console.log('═'.repeat(60));
        log(`\n  Booking ID: ${booking.id}`, 'bright');
        log(`  Reason: ${booking.failReason}`, 'red');
        console.log('\n  History:');
        // @ts-ignore
        booking.history.forEach(h => log(`    ${h}`, 'dim'));
        console.log('═'.repeat(60) + '\n');
        return booking;
      }

      process.stdout.write(`\rWaiting... (${attempts + 1}s) `);

      await new Promise(resolve => setTimeout(resolve, CONFIG.POLL_INTERVAL));
      attempts++;

    } catch (error) {
      // @ts-ignore
      logError(`Polling failed: ${error.message}`);
      throw error;
    }
  }

  logWarning('\nPolling timeout. Booking may still be processing.');
  logInfo('Check status manually: GET /booking/' + bookingId);
}

module.exports = { pollBookingStatus };