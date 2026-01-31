const getRecentBookings = `
  SELECT 
    id,
    "userName",
    gender,
    dob,
    "basePrice",
    "finalPrice",
    status,
    "failReason",
    "createdAt",
    "updatedAt"
  FROM booking
  ORDER BY "createdAt" DESC
  LIMIT 20
`;

const getStuckBookings = `
  SELECT 
    id,
    "userName",
    status,
    "createdAt",
    EXTRACT(EPOCH FROM (NOW() - "createdAt")) as age_seconds
  FROM booking
  WHERE status = 'PENDING'
    AND "createdAt" < NOW() - INTERVAL '5 minutes'
  ORDER BY "createdAt" ASC
`;

const getBookingStats = `
  SELECT 
    status,
    COUNT(*) as count,
    AVG("basePrice") as avg_base_price,
    AVG("finalPrice") as avg_final_price,
    MIN("createdAt") as oldest,
    MAX("createdAt") as newest
  FROM booking
  GROUP BY status
  ORDER BY status
`;

// @ts-ignore
const deleteOldBookings = (minutes) => `
  DELETE FROM booking
  WHERE "createdAt" < NOW() - INTERVAL '${minutes} minutes'
  RETURNING id
`;

module.exports = {
  getRecentBookings,
  getStuckBookings,
  getBookingStats,
  deleteOldBookings,
};