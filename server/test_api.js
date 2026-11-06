import connectDB from './config/db.js';
import app from './index.js';
import User from './models/User.js';
import ExchangeRequest from './models/ExchangeRequest.js';
import Review from './models/Review.js';

let server;
const PORT = 5005;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function runTests() {
  console.log('--- STARTING SKILLSWAP END-TO-END SUITE ---');
  await connectDB();

  server = app.listen(PORT, async () => {
    try {
      console.log(`Test server running at ${BASE_URL}`);

      // 1. Health check
      console.log('\n[TEST 1] GET /api/health');
      const healthRes = await fetch(`${BASE_URL}/api/health`);
      const health = await healthRes.json();
      console.log('Health status:', health.status, 'Service:', health.service);
      if (health.status !== 'healthy') throw new Error('Health check failed');

      // 2. Register new student
      console.log('\n[TEST 2] POST /api/auth/register');
      const testEmail = `student_${Date.now()}@example.com`;
      const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Vikram Joshi',
          email: testEmail,
          password: 'Password@123',
          confirmPassword: 'Password@123',
          college: 'IIT Delhi'
        })
      });
      const regData = await regRes.json();
      console.log('Register response success:', regData.success, 'User:', regData.user?.name);
      if (!regData.success || !regData.token) throw new Error('Registration failed');
      const token = regData.token;

      // 3. Duplicate email test
      console.log('\n[TEST 3] Duplicate Registration Validation');
      const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Vikram Clone',
          email: testEmail,
          password: 'Password@123',
          confirmPassword: 'Password@123',
          college: 'IIT Delhi'
        })
      });
      const dupData = await dupRes.json();
      console.log('Duplicate check blocked duplicate?', !dupData.success, 'Msg:', dupData.message);
      if (dupData.success) throw new Error('Duplicate email was not blocked');

      // 4. Login
      console.log('\n[TEST 4] POST /api/auth/login');
      const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'Password@123'
        })
      });
      const loginData = await loginRes.json();
      console.log('Login success:', loginData.success, 'Email:', loginData.user?.email);
      if (!loginData.success) throw new Error('Login failed');

      // 5. Get current profile
      console.log('\n[TEST 5] GET /api/auth/me');
      const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const meData = await meRes.json();
      console.log('Me profile fetched:', meData.user?.name, 'Rating:', meData.user?.averageRating);

      // 6. Add teaching skill
      console.log('\n[TEST 6] POST /api/skills/teach');
      const teachRes = await fetch(`${BASE_URL}/api/skills/teach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'C++',
          category: 'Programming',
          level: 'Advanced',
          description: 'Data Structures, STL, and competitive programming.'
        })
      });
      const teachData = await teachRes.json();
      console.log('Add teaching skill success:', teachData.success, 'Skills count:', teachData.skillsToTeach?.length);
      if (!teachData.success) throw new Error('Failed to add teaching skill');

      // 7. Add learning skill
      console.log('\n[TEST 7] POST /api/skills/learn');
      const learnRes = await fetch(`${BASE_URL}/api/skills/learn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: 'Photoshop',
          category: 'Graphic Design',
          level: 'Beginner',
          description: 'Want to learn digital editing.'
        })
      });
      const learnData = await learnRes.json();
      console.log('Add learning skill success:', learnData.success, 'Goals count:', learnData.skillsToLearn?.length);
      if (!learnData.success) throw new Error('Failed to add learning skill');

      // 8. Explore students
      console.log('\n[TEST 8] GET /api/users');
      const usersRes = await fetch(`${BASE_URL}/api/users?category=Graphic Design`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usersData = await usersRes.json();
      console.log('Filtered users count:', usersData.users?.length);
      const targetPartner = usersData.users.find((u) => u.name === 'Priya Patel') || usersData.users[0];
      console.log('Selected target peer for swap:', targetPartner?.name);

      // 9. Dashboard stats & smart recommendations
      console.log('\n[TEST 9] GET /api/dashboard/stats');
      const dashRes = await fetch(`${BASE_URL}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dashData = await dashRes.json();
      console.log('Dashboard stats:', dashData.stats);
      console.log('Top Recommendation:', dashData.recommendations?.[0]?.student?.name, 'Reason:', dashData.recommendations?.[0]?.primaryReason);

      // 10. Propose an exchange request
      console.log('\n[TEST 10] POST /api/requests');
      const reqRes = await fetch(`${BASE_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: targetPartner._id,
          learningSkill: 'Photoshop',
          offeredSkill: 'C++',
          message: 'Hey, I can teach you C++ algorithms in exchange for Photoshop lessons!'
        })
      });
      const reqData = await reqRes.json();
      console.log('Exchange request created:', reqData.success, 'Request ID:', reqData.request?._id);
      if (!reqData.success) throw new Error('Failed to create exchange request');
      const requestId = reqData.request._id;

      // 11. Target partner logs in and accepts the request
      console.log('\n[TEST 11] Target Partner Login & PATCH /api/requests/:id/accept');
      const partnerLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetPartner.email || 'priya.patel@example.com',
          password: 'Password@123'
        })
      });
      const partnerLoginData = await partnerLoginRes.json();
      const partnerToken = partnerLoginData.token;

      const acceptRes = await fetch(`${BASE_URL}/api/requests/${requestId}/accept`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${partnerToken}` }
      });
      const acceptData = await acceptRes.json();
      console.log('Accept request status:', acceptData.request?.status);
      if (acceptData.request?.status !== 'accepted') throw new Error('Failed to accept request');

      // 12. Complete the exchange
      console.log('\n[TEST 12] PATCH /api/requests/:id/complete');
      const completeRes = await fetch(`${BASE_URL}/api/requests/${requestId}/complete`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const completeData = await completeRes.json();
      console.log('Completed request status:', completeData.request?.status);
      if (completeData.request?.status !== 'completed') throw new Error('Failed to complete exchange');

      // 13. Submit a review
      console.log('\n[TEST 13] POST /api/reviews');
      const revRes = await fetch(`${BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          exchangeRequestId: requestId,
          rating: 5,
          comment: 'Outstanding session! Extremely knowledgeable and friendly.'
        })
      });
      const revData = await revRes.json();
      console.log('Review submitted successfully:', revData.success, 'Rating:', revData.review?.rating);
      if (!revData.success) throw new Error('Failed to submit review');

      // 14. Verify review appears for target partner
      console.log('\n[TEST 14] GET /api/reviews/:userId');
      const getRevRes = await fetch(`${BASE_URL}/api/reviews/${targetPartner._id}`);
      const getRevData = await getRevRes.json();
      console.log('Reviews for partner:', getRevData.count, 'Average rating:', getRevData.averageRating);

      console.log('\n======================================================');
      console.log('🎉 ALL 14 BACKEND MODULE AND ENDPOINT TESTS PASSED! 🎉');
      console.log('======================================================\n');
      process.exit(0);
    } catch (err) {
      console.error('\n❌ TEST FAILURE:', err);
      process.exit(1);
    }
  });
}

runTests();
