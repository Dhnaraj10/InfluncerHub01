//backend/testsRequests.mjs
const base = 'http://localhost:5000/api';

async function run() {
  try {
    // Register a brand user
    const regRes = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Brand', email: 'brand@test.com', password: 'password123', role: 'brand' }),
    });
    const regJson = await regRes.json();
    console.log('register status', regRes.status, regJson);

    // Register an influencer
    const inflRes = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Influencer', email: 'infl@test.com', password: 'password123', role: 'influencer' }),
    });
    const inflJson = await inflRes.json();
    console.log('influencer register status', inflRes.status, inflJson);

    // If influencer registration returned a token, create/update profile
    const token = inflJson.token;
    if (token) {
      const profileRes = await fetch(`${base}/influencers/me`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ handle: 'test_influencer', bio: 'Hello from test', categories: ['Fashion'], followerCount: 5000 }),
      });
      const profileJson = await profileRes.json();
      console.log('create profile status', profileRes.status, profileJson);
    }
  } catch (err) {
    console.error('request error', err);
  }
}

run();
