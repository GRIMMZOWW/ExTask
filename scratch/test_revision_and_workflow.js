const http = require('http');

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const cookies = res.headers['set-cookie'] || [];
        resolve({
          status: res.statusCode,
          headers: res.headers,
          cookies: cookies.map(c => c.split(';')[0]),
          data: data ? (function() { try { return JSON.parse(data); } catch(e) { return data; } })() : ''
        });
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== EXTASK END-TO-END WORKFLOW & ROLE TEST SUITE ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition, name, details = '') {
    total++;
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} — ${details}`);
    }
  }

  const timestamp = Date.now();
  const studentAEmail = `studentA_${timestamp}@campus.edu`;
  const studentBEmail = `studentB_${timestamp}@campus.edu`;
  const password = 'Password1!';

  try {
    // 1. Register Student A
    const regA = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/users/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { name: 'Student Alpha', email: studentAEmail, password });
    assert(regA.status === 200, 'Register Student A');

    // 2. Register Student B
    const regB = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/users/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { name: 'Student Beta', email: studentBEmail, password });
    assert(regB.status === 200, 'Register Student B');

    // 3. Login Student A & get session cookie
    const loginA = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/users/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: studentAEmail, password });
    assert(loginA.status === 200 && loginA.data.id, 'Login Student A');
    const userA = loginA.data;
    const cookieA = loginA.cookies.join('; ');

    // 4. Login Student B & get session cookie
    const loginB = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/users/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: studentBEmail, password });
    assert(loginB.status === 200 && loginB.data.id, 'Login Student B');
    const userB = loginB.data;
    const cookieB = loginB.cookies.join('; ');

    // 5. Login Admin
    const loginAdmin = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/users/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { email: 'admin@extask.com', password: 'demo123' });
    assert(loginAdmin.status === 200 && loginAdmin.data.role === 'ADMIN', 'Login Admin');
    const adminUser = loginAdmin.data;
    const cookieAdmin = loginAdmin.cookies.join('; ');

    // 6. Student A posts a task
    const postRes = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/tasks/add',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieA }
    }, {
      title: 'Initial Task Requirements',
      description: 'Need help with React state management',
      budget: 500,
      deliveryType: 'GitHub Link',
      postedBy: userA.id
    });
    assert(postRes.status === 200 && postRes.data.id, 'Student A posts task', JSON.stringify(postRes.data));
    const taskId = postRes.data.id;

    // 7. Student A edits the open task
    const editRes = await request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/tasks/edit/${taskId}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieA }
    }, {
      userId: userA.id,
      title: 'Updated Task Requirements: React Hooks & State',
      description: 'Need help with custom hooks & Context API',
      budget: 750,
      deliveryType: 'GitHub Link'
    });
    assert(editRes.status === 200, 'Student A successfully edits open task', JSON.stringify(editRes.data));

    // Verify task was updated
    const getTask1 = await request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/tasks/get/${taskId}`,
      method: 'GET'
    });
    assert(getTask1.data.title.includes('Updated Task Requirements') && getTask1.data.budget === 750, 'Task updates reflected in database');

    // 8. Admin cannot accept task as solver
    const adminAcceptRes = await request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/tasks/accept/${taskId}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieAdmin }
    }, { userId: adminUser.id });
    assert(adminAcceptRes.status === 400 && typeof adminAcceptRes.data === 'string' && adminAcceptRes.data.includes('Admins cannot accept tasks'), 'Reject Admin accepting task as solver');

    // 9. Student B accepts the task
    const acceptRes = await request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/tasks/accept/${taskId}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieB }
    }, { userId: userB.id });
    assert(acceptRes.status === 200, 'Student B accepts task');

    // 10. Student A cannot edit task once accepted
    const editAcceptedRes = await request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/tasks/edit/${taskId}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieA }
    }, {
      userId: userA.id,
      title: 'Attempt edit after acceptance',
      budget: 1000,
      deliveryType: 'GitHub Link'
    });
    assert(editAcceptedRes.status === 400, 'Reject editing task after it has been accepted');

    // 11. Student B submits deliverable
    const submitRes = await request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/tasks/submit/${taskId}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieB }
    }, {
      userId: userB.id,
      deliveryContent: 'https://github.com/studentB/solution-v1'
    });
    assert(submitRes.status === 200, 'Student B submits initial delivery');

    // 12. Student A requests changes with feedback
    const changeReqRes = await request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/tasks/request-changes/${taskId}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieA }
    }, {
      userId: userA.id,
      feedback: 'Please add unit tests and TypeScript definitions.'
    });
    assert(changeReqRes.status === 200, 'Student A requests changes with revision feedback');

    // Verify task status is CHANGE_REQUESTED
    const getTask2 = await request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/tasks/get/${taskId}`,
      method: 'GET'
    });
    assert(
      getTask2.data.status === 'CHANGE_REQUESTED' && 
      getTask2.data.revisionFeedback === 'Please add unit tests and TypeScript definitions.',
      'Task status is CHANGE_REQUESTED with feedback persisted'
    );

    // 13. Student B resubmits revised delivery
    const resubmitRes = await request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/tasks/submit/${taskId}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookieB }
    }, {
      userId: userB.id,
      deliveryContent: 'https://github.com/studentB/solution-v2-with-tests'
    });
    assert(resubmitRes.status === 200, 'Student B resubmits revised delivery');

    // Verify task status returned to SUBMITTED
    const getTask3 = await request({
      hostname: 'localhost',
      port: 8080,
      path: `/api/tasks/get/${taskId}`,
      method: 'GET'
    });
    assert(
      getTask3.data.status === 'SUBMITTED' && 
      getTask3.data.deliveryContent === 'https://github.com/studentB/solution-v2-with-tests',
      'Task status updated back to SUBMITTED with new deliverable'
    );

  } catch (err) {
    console.error('Test run failed with error:', err);
  }

  console.log(`\n=== RESULTS: ${passed}/${total} TESTS PASSED ===\n`);
  process.exit(passed === total ? 0 : 1);
}

runTests();
