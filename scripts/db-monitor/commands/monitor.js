const config = require('../config');
const BookingMonitor = require('../services/bookingMonitor');
const { log } = require('../utils/logger');

async function monitorCommand() {
  const monitor = new BookingMonitor();

  async function refresh() {
    try {
      const bookings = await monitor.getRecentBookings();
      const stuckBookings = await monitor.getStuckBookings();
      
      monitor.displayHeader(config.REFRESH_INTERVAL);
      
      const statusCount = monitor.countStatuses(bookings);
      monitor.displayStatusSummary(statusCount);
      
      const changes = monitor.detectChanges(bookings);
      monitor.displayChanges(changes);
      
      monitor.displayBookingsTable(bookings);
      monitor.displayStuckBookings(stuckBookings);
      
    } catch (error) {
      log(`\nrror querying database: ${error}`, 'red');
    }
  }

  setInterval(refresh, config.REFRESH_INTERVAL);
}

module.exports = monitorCommand;