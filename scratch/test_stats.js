async function testStats() {
  try {
    // 1. Login to get token
    console.log('Logging in...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('Login successful. Token acquired.');

    // 2. Get Stats
    console.log('Fetching stats...');
    const statsRes = await fetch('http://localhost:5000/api/dashboard/stats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const statsData = await statsRes.json();
    console.log('Stats Response:', JSON.stringify(statsData, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testStats();
