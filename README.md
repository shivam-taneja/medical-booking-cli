# Medical Booking CLI

CLI tool for testing, monitoring, and load testing the [medical-booking-system](https://github.com/shivam-taneja/medical-booking-system.git) appointment system with support for positive/banned/quota scenarios, Redis/DB monitoring.

## Prerequisites

* Node.js (v22)
* First, set up and run the [medical-booking-system](https://github.com/shivam-taneja/medical-booking-system.git) web application. This CLI tool requires the main application, Redis, and PostgreSQL to be running.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   ```

## Usage

### CLI Testing
```bash
pnpm run cli:test:positive    # Test positive booking flow
pnpm run cli:test:banned      # Test banned user scenario
pnpm run cli:test:quota       # Test quota limit scenario
```

### Load Testing
```bash
pnpm run load:test            # Run load test with default settings
pnpm run load:quota           # Test quota limits with 100 concurrent users
```

### Redis Monitoring
```bash
pnpm run monitor:redis        # Start real-time quota monitoring
pnpm run monitor:redis get    # Get current quota count
pnpm run monitor:redis reset  # Reset today's quota to 0
pnpm run monitor:redis set 95 # Set quota to specific number
pnpm run monitor:redis keys   # List all quota keys
pnpm run monitor:redis clean  # Delete all quota keys
```

### Database Monitoring
```bash
pnpm run monitor:db           # Start real-time booking monitoring
pnpm run monitor:db stats     # Show booking statistics
pnpm run monitor:db clear 60  # Delete bookings older than 60 minutes
```