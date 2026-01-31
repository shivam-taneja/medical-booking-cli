const SERVICES = [
  'General Consultation',
  'Blood Test',
  'X-Ray',
  'MRI Scan',
  'Dental Cleaning',
  'Vaccination',
];

// @ts-ignore
function generateRandomBooking(userIndex) {
  const genders = ['Male', 'Female', 'Other'];
  const today = new Date();
  
  // 30% chance of birthday today (to trigger discount)
  const isBirthday = Math.random() < 0.3;
  const birthYear = 1970 + Math.floor(Math.random() * 30); // 1970-2000
  
  let dob;
  if (isBirthday) {
    dob = `${birthYear}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  } else {
    const randomMonth = Math.floor(Math.random() * 12) + 1;
    const randomDay = Math.floor(Math.random() * 28) + 1;
    dob = `${birthYear}-${String(randomMonth).padStart(2, '0')}-${String(randomDay).padStart(2, '0')}`;
  }

  // Random service selection (1-3 services)
  const numServices = Math.floor(Math.random() * 3) + 1;
  // @ts-ignore
  const selectedServices = [];
  for (let i = 0; i < numServices; i++) {
    const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
    // @ts-ignore
    if (!selectedServices.includes(service)) {
      selectedServices.push(service);
    }
  }

  return {
    userName: `load_test_user_${userIndex}`,
    gender: genders[Math.floor(Math.random() * genders.length)],
    dob,
    serviceNames: selectedServices,
  };
}

module.exports = { generateRandomBooking, SERVICES };