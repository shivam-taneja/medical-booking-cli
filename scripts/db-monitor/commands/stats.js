const { client } = require('../db/client');
const queries = require('../db/queries');
const { log } = require('../utils/logger');
const { formatDate } = require('../utils/formatters');

async function statsCommand() {
  try {
    await client.connect();

    const statsQuery = await client.query(queries.getBookingStats);

    console.log('\n' + '─'.repeat(80));
    log('📊  BOOKING STATISTICS', 'cyan');
    console.log('─'.repeat(80));

    statsQuery.rows.forEach(row => {
      const statusColor = row.status === 'CONFIRMED' ? 'green' : row.status === 'REJECTED' ? 'red' : 'yellow';
      
      log(`\n${row.status}:`, statusColor);
      console.log(`   Count: ${row.count}`);
      console.log(`   Avg Base Price: ₹${Math.round(row.avg_base_price || 0)}`);
      
      if (row.avg_final_price) {
        console.log(`   Avg Final Price: ₹${Math.round(row.avg_final_price)}`);
        const discount = ((1 - row.avg_final_price / row.avg_base_price) * 100).toFixed(1);
        console.log(`   Avg Discount: ${discount}%`);
      }
      
      console.log(`   Oldest: ${formatDate(row.oldest)}`);
      console.log(`   Newest: ${formatDate(row.newest)}`);
    });

    console.log('\n' + '─'.repeat(80) + '\n');
    
    await client.end();
    process.exit(0);
  } catch (error) {
    log(`\nError: ${error}\n`, 'red');
    process.exit(1);
  }
}

module.exports = statsCommand;