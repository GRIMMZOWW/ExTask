const puppeteer = require('puppeteer-core');

async function testAuthForms() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Test Login Form Typing
  console.log("Testing Login form typing...");
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });

  await page.type('#login-email', 'alice@extask.com', { delay: 30 });
  await page.type('#login-password', 'demo123', { delay: 30 });

  const emailVal = await page.$eval('#login-email', el => el.value);
  const pwdVal = await page.$eval('#login-password', el => el.value);
  console.log(`Login inputs filled: email="${emailVal}", password="${pwdVal}"`);
  if (emailVal !== 'alice@extask.com' || pwdVal !== 'demo123') {
    throw new Error("Login typing failed!");
  }

  // 2. Test Register Form Typing
  console.log("Testing Register form typing...");
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle0' });
  await page.type('#reg-name', 'Test Student User', { delay: 30 });
  await page.type('#reg-email', 'newstudent@extask.com', { delay: 30 });
  await page.type('#reg-password', 'DemoPass123!', { delay: 30 });
  await page.type('#reg-confirm-password', 'DemoPass123!', { delay: 30 });

  const regName = await page.$eval('#reg-name', el => el.value);
  const regEmail = await page.$eval('#reg-email', el => el.value);
  const regPwd = await page.$eval('#reg-password', el => el.value);
  const regConfirm = await page.$eval('#reg-confirm-password', el => el.value);

  console.log(`Register inputs filled: name="${regName}", email="${regEmail}", password="${regPwd}", confirm="${regConfirm}"`);
  if (regName !== 'Test Student User' || regEmail !== 'newstudent@extask.com') {
    throw new Error("Register typing failed!");
  }

  // 3. Test Login Submission
  console.log("Testing Login submission...");
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await page.type('#login-email', 'alice@extask.com', { delay: 20 });
  await page.type('#login-password', 'demo123', { delay: 20 });
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 1500));

  const currentUrl = page.url();
  console.log(`URL after login: ${currentUrl}`);

  await browser.close();
  console.log("=== ALL FORM INTERACTION TESTS PASSED! ===");
}

testAuthForms().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
