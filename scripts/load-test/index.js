/**
 * Load Test Script for Medical Booking System
 * 
 * Simulates concurrent users creating bookings to test:
 * - System throughput
 * - Quota enforcement under load
 * - Race condition handling
 * - Idempotency
 */

const { runLoadTest } = require('./tests/load-test');
const { runQuotaTest } = require('./tests/quota-test');

const args = process.argv.slice(2);
const testType = args[0] || 'load';

if (testType === 'quota') {
  const quotaLimit = parseInt(args[1]) || 100;
  runQuotaTest(quotaLimit);
} else {
  runLoadTest();
}