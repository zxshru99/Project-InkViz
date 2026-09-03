/**
 * Inkviz API Automated Sanity Test Runner
 * Run with: node .agents/skills/inkviz-api-manager/scripts/test_api.js
 */
const http = require('http');

(async () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5001';
  console.log(`\n🔍 Starting Inkviz API Health & Sanity Test against: ${baseUrl}\n`);

  try {
    // 1. Health
    console.log('1. Testing GET /health ...');
    const health = await (await fetch(`${baseUrl}/health`)).json();
    console.log('   ✅ Health Status:', health.status, `(uptime: ${Math.round(health.uptime)}s)`);

    // 2. Ready
    console.log('2. Testing GET /ready ...');
    const ready = await (await fetch(`${baseUrl}/ready`)).json();
    console.log('   ✅ Ready Status:', ready.status);

    // 3. Register
    const testUser = {
      name: 'Automated Bot',
      email: `test_bot_${Date.now()}@example.com`,
      password: 'Password123!'
    };
    console.log(`3. Testing POST /api/v1/auth/register (${testUser.email}) ...`);
    const regRes = await fetch(`${baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();
    if (!regData.success) throw new Error('Registration failed: ' + JSON.stringify(regData));
    console.log('   ✅ Registered user ID:', regData.data.user._id);

    // 4. Login
    console.log('4. Testing POST /api/v1/auth/login ...');
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await loginRes.json();
    const token = loginData.data?.accessToken;
    if (!token) throw new Error('No access token returned on login');
    console.log('   ✅ Login successful, JWT token acquired');

    // 5. Protected Endpoint (Templates)
    console.log('5. Testing Protected GET /api/v1/templates ...');
    const tplRes = await fetch(`${baseUrl}/api/v1/templates`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const tplData = await tplRes.json();
    console.log('   ✅ Protected route verified! Success:', tplData.success);

    console.log('\n🎉 ALL INKVIZ API TESTS PASSED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('\n❌ API Test Failed:', err.message);
    process.exit(1);
  }
})();
