// @ts-ignore
function formatDate(date) {
  return new Date(date).toLocaleString('en-IN', { 
    timeZone: 'Asia/Kolkata',
    hour12: false 
  });
}

// @ts-ignore
function formatAge(createdAt) {
  // @ts-ignore
  const age = Math.floor((Date.now() - new Date(createdAt)) / 1000);
  return age < 60 ? `${age}s` : `${Math.floor(age / 60)}m`;
}

module.exports = {
  formatDate,
  formatAge,
};