const { client } = require('../db/client');
const queries = require('../db/queries');
const { log } = require('../utils/logger');
const { formatAge } = require('../utils/formatters');

class BookingMonitor {
  constructor() {
    this.previousBookings = new Map();
    this.updateCount = 0;
  }

  async getRecentBookings() {
    const result = await client.query(queries.getRecentBookings);
    return result.rows;
  }

  async getStuckBookings() {
    const result = await client.query(queries.getStuckBookings);
    return result.rows;
  }

  // @ts-ignore
  detectChanges(currentBookings) {
    // @ts-ignore
    const changes = [];
    
    // @ts-ignore
    currentBookings.forEach(row => {
      const previous = this.previousBookings.get(row.id);
      
      if (previous && previous.status !== row.status) {
        changes.push({
          id: row.id.substring(0, 8),
          from: previous.status,
          to: row.status,
          userId: row.userId,
          finalPrice: row.finalPrice,
          reason: row.failReason,
        });
      }
      
      this.previousBookings.set(row.id, row);
    });

    // @ts-ignore
    return changes;
  }

  // @ts-ignore
  countStatuses(bookings) {
    const statusCount = { PENDING: 0, CONFIRMED: 0, REJECTED: 0 };
    // @ts-ignore
    bookings.forEach(row => {
      // @ts-ignore
      statusCount[row.status]++;
    });
    return statusCount;
  }

  // @ts-ignore
  displayHeader(refreshInterval) {
    console.clear();
    console.log('─'.repeat(80));
    log('DATABASE MONITOR - Real-Time Booking Dashboard', 'cyan');
    console.log('─'.repeat(80));
    
    const now = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      hour12: false 
    });
    log(`Last Update: ${now}`, 'dim');
    log(`Refresh Rate: ${refreshInterval}ms`, 'dim');
    console.log('─'.repeat(80));
  }

  // @ts-ignore
  displayStatusSummary(statusCount) {
    log(`\nStatus Summary (Last 20 bookings):`, 'bright');
    console.log(`    PENDING: ${statusCount.PENDING}`);
    console.log(`    CONFIRMED: ${statusCount.CONFIRMED}`);
    console.log(`    REJECTED: ${statusCount.REJECTED}`);
    console.log('─'.repeat(80));
  }

  // @ts-ignore
  displayChanges(changes) {
    if (changes.length === 0) return;

    this.updateCount++;
    log(`\nStatus Changes Detected (#${this.updateCount}):`, 'yellow');
    
    // @ts-ignore
    changes.forEach(change => {
      const arrow = '→';
      const statusColor = change.to === 'CONFIRMED' ? 'green' : change.to === 'REJECTED' ? 'red' : 'yellow';
      
      log(`   ${change.id}... | ${change.userId}`, 'dim');
      log(`   ${change.from} ${arrow} ${change.to}`, statusColor);
      
      if (change.to === 'CONFIRMED') {
        log(`   Final Price: ₹${change.finalPrice}`, 'green');
      } else if (change.to === 'REJECTED') {
        log(`   Reason: ${change.reason}`, 'red');
      }
      console.log();
    });
    console.log('─'.repeat(80));
  }

  // @ts-ignore
  displayBookingsTable(bookings) {
    log('\nRecent Bookings:', 'cyan');
    console.log('─'.repeat(80));
    console.log('ID       | User ID         | Status     | Base   | Final  | Age');
    console.log('─'.repeat(80));

    // @ts-ignore
    bookings.slice(0, 10).forEach(row => {
      const id = row.id.substring(0, 8);
      const userId = row.userId.padEnd(15).substring(0, 15);
      const status = row.status.padEnd(10);
      const basePrice = `₹${row.basePrice}`.padEnd(6);
      const finalPrice = row.finalPrice ? `₹${row.finalPrice}`.padEnd(6) : 'N/A   ';
      const ageStr = formatAge(row.createdAt);
      
      let statusColor = 'reset';
      if (row.status === 'CONFIRMED') statusColor = 'green';
      else if (row.status === 'REJECTED') statusColor = 'red';
      else if (row.status === 'PENDING') statusColor = 'yellow';

      const line = `${id} | ${userId} | ${status} | ${basePrice} | ${finalPrice} | ${ageStr}`;
      log(line, statusColor);
    });

    console.log('─'.repeat(80));
    log('\nPress Ctrl+C to exit', 'dim');
  }

  // @ts-ignore
  displayStuckBookings(stuckBookings) {
    if (stuckBookings.length === 0) return;

    log('\nSTUCK BOOKINGS (PENDING > 5 minutes):', 'yellow');
    console.log('─'.repeat(80));
    
    // @ts-ignore
    stuckBookings.forEach(row => {
      const id = row.id.substring(0, 8);
      const age = Math.floor(row.age_seconds / 60);
      log(`   ${id}... | User: ${row.userId} | Age: ${age}m`, 'red');
    });
    
    console.log('─'.repeat(80));
    log('These bookings may have timed out or failed', 'dim');
  }
}

module.exports = BookingMonitor;