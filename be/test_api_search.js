const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';
const PORT = process.env.PORT || 3000;

async function test() {
  try {
    // 1. Generate Token for User ID 2 (Admin)
    const token = jwt.sign({ id: 2 }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated Token:', token);

    // 2. Call Search API
    const url = `http://localhost:${PORT}/api/users/search?q=`;
    console.log('Calling URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response Status:', response.status);
    console.log('X-Debug-Auth:', response.headers.get('X-Debug-Auth'));
    console.log('X-Debug-Controller:', response.headers.get('X-Debug-Controller'));
    
    if (response.ok) {
        const data = await response.json();
        console.log('Response Data:', JSON.stringify(data, null, 2));
    } else {
        const text = await response.text();
        console.log('Error Body:', text);
    }

  } catch (error) {
    console.error('API Error:', error);
  }
}

test();
