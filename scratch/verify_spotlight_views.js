const puppeteer = require('puppeteer-core');
const path = require('path');

async function testTaskViewAndDashboards() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. User Dashboard Screenshot
  console.log("Navigating to User Dashboard...");
  await page.goto('http://localhost:3000/login');
  await page.evaluate(() => localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Alice Smith', email: 'alice@extask.com', role: 'STUDENT' })));
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(__dirname, 'user_dashboard_spotlight.png') });
  console.log("Captured User Dashboard");

  // 2. View Task Detail Page Screenshot
  console.log("Navigating to View Task Page...");
  await page.goto('http://localhost:3000/task/1', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(__dirname, 'task_view_spotlight.png') });
  console.log("Captured Task View Page");

  // 3. Admin Dashboard Screenshot
  console.log("Navigating to Admin Dashboard...");
  await page.evaluate(() => localStorage.setItem('user', JSON.stringify({ id: 999, name: 'Campus Admin', email: 'admin@extask.com', role: 'ADMIN' })));
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(__dirname, 'admin_dashboard_spotlight.png') });
  console.log("Captured Admin Dashboard");

  await browser.close();
  console.log("Verification complete!");
}

testTaskViewAndDashboards().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
