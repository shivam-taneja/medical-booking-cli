const https = require('http');
const { CONFIG } = require('../config');

// @ts-ignore
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, CONFIG.BOOKING_API);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          // @ts-ignore
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            if (parsed.error && Array.isArray(parsed.error)) {
              const errorMessage = parsed.error.join('; ');
              reject(new Error(errorMessage));
            } else {
              reject(new Error(parsed.message || body));
            }
          }
        } catch (e) {
          reject(new Error(`Invalid response: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

module.exports = { makeRequest };