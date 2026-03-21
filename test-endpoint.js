const http = require('http');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5AcHVwcHlicm8uY29tIiwiaWF0IjoxNzc0MDY5Njc3LCJleHAiOjE3NzQ2NzQ0Nzd9.kztsX2BkkahWt_82bF8-Za2meCD5nguF44Mgq-uYp9Y';

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/adoption/admin/applications',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response:', data);
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

req.end();
