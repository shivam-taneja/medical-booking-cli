const { CONFIG } = require('../config');
const { makeRequest } = require('./api');
const { log, logSuccess, logError, logInfo, logProcessing, logWarning } = require('./logger');

// @ts-ignore
async function pollBookingStatus(bookingId) {
  let attempts = 0;
  let lastHistoryCount = 0;

  logProcessing(`Monitoring Booking ${bookingId}...`);
  console.log('');

  while (attempts < CONFIG.MAX_POLL_ATTEMPTS) {
    try {
      const booking = await makeRequest('GET', `/booking/${bookingId}`);
      const currentStatus = booking.status;

      if (booking.history && booking.history.length > lastHistoryCount) {
        const newEntries = booking.history.slice(lastHistoryCount);

        // @ts-ignore
        newEntries.forEach(entry => {
          const stateMatch = entry.match(/\[([A-Z_]+)\] (.+)$/);

          if (stateMatch) {
            const state = stateMatch[1];
            const message = stateMatch[2];

            switch (state) {
              case 'VALIDATING_ELIGIBILITY':
                logProcessing(`${message}`);
                break;

              case 'CHECKING_QUOTA':
                logProcessing(`${message}`);
                break;

              case 'APPLYING_DISCOUNT':
                logProcessing(`${message}`);
                break;

              case 'COMPENSATING':
                logWarning(`COMPENSATION: ${message}`);
                break;

              case 'NO_DISCOUNT':
                logInfo(`${message}`);
                break;

              case 'SYSTEM_ERROR':
                logError(`SYSTEM ERROR: ${message}`);

              default:
                // Fallback for messages without state (like initial "Booking Created")
                if (message.includes('Booking Created')) {
                  logInfo(`${message}`);
                } else {
                  log(`${message}`, 'dim');
                }
            }
          } else {
            const messageOnly = entry.match(/\] (.+)$/);
            const msg = messageOnly ? messageOnly[1] : entry;

            if (msg.includes('Booking Created')) {
              logInfo(`${msg}`);
            } else {
              log(`${msg}`, 'dim');
            }
          }
        });

        lastHistoryCount = booking.history.length;
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