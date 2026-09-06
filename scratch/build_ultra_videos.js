const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = 'c:/Users/me/Desktop/ExTask/frontend/public/videos';
const mediaDir = 'c:/Users/me/Desktop/ExTask/frontend/public/media';

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

const DURATION = 6; // 6 second loop
const FPS = 30;

const THEMES = [
  {
    name: 'hero-bg.mp4',
    poster: 'browse-hero.jpg',
    lavfi: "nullsrc=s=960x540:rate=30,geq=r='15+25*sin(X/45+T*3)':g='70+60*sin(Y/35-T*3.5)+40*cos((X+Y)/55+T*2.5)':b='130+90*sin((X-Y)/45+T*3)'"
  },
  {
    name: 'browse-bg.mp4',
    poster: 'browse-hero.jpg',
    lavfi: "cellauto=s=960x540:rate=30:rule=30,format=rgb24,geq=r='10':g='p(X,Y)*1.6+35*sin(X/30+T*4)':b='p(X,Y)*1.4+40*cos(Y/30-T*3.5)'"
  },
  {
    name: 'post-bg.mp4',
    poster: 'post-hero.jpg',
    lavfi: "nullsrc=s=960x540:rate=30,geq=r='30+40*sin(sqrt((X-480)*(X-480)+(Y-270)*(Y-270))/25-T*4.5)':g='90+80*sin(sqrt((X-480)*(X-480)+(Y-270)*(Y-270))/20-T*5.5)':b='120+90*cos(sqrt((X-480)*(X-480)+(Y-270)*(Y-270))/30-T*3.5)'"
  },
  {
    name: 'tasks-bg.mp4',
    poster: 'tasks-hero.jpg',
    lavfi: "nullsrc=s=960x540:rate=30,geq=r='80+70*sin(X/40+Y/50+T*3.5)':g='50+55*cos(X/55-Y/35-T*3)':b='140+90*sin(X/35+T*4.5)'"
  },
  {
    name: 'detail-bg.mp4',
    poster: 'detail-hero.jpg',
    lavfi: "nullsrc=s=960x540:rate=30,geq=r='20+25*sin(atan2(Y-270,X-480)*6+T*4.5)':g='110+90*sin(atan2(Y-270,X-480)*4-T*5.5)+50*sin(sqrt((X-480)*(X-480)+(Y-270)*(Y-270))/30)':b='90+70*cos(atan2(Y-270,X-480)*8+T*3.5)'"
  },
  {
    name: 'dashboard-bg.mp4',
    poster: 'dashboard-hero.jpg',
    lavfi: "life=s=960x540:rate=30:mold=10:random_fill_ratio=0.25,format=rgb24,geq=r='p(X,Y)*0.4':g='p(X,Y)*1.5+25*sin(Y/25+T*3.5)':b='p(X,Y)*1.8+45'"
  },
  {
    name: 'admin-bg.mp4',
    poster: 'admin-hero.jpg',
    lavfi: "nullsrc=s=960x540:rate=30,geq=r='140+85*sin(X/35+T*4)+40*sin(Y/45-T*2.5)':g='25+25*cos(Y/35+T*3.5)':b='45+35*sin((X+Y)/55-T*4.5)'"
  },
  {
    name: 'profile-bg.mp4',
    poster: 'profile-hero.jpg',
    lavfi: "nullsrc=s=960x540:rate=30,geq=r='95+75*sin(X/50+Y/40+T*3)':g='60+50*cos(X/45-T*3.5)':b='130+80*sin(Y/55+T*2.5)'"
  },
  {
    name: 'auth-login.mp4',
    poster: 'auth-login.jpg',
    lavfi: "nullsrc=s=960x540:rate=30,geq=r='20+30*sin(X/65+T*2)':g='55+55*sin(Y/55-T*2.5)+35*cos((X+Y)/85)':b='115+85*sin(sqrt((X-480)*(X-480)+(Y-270)*(Y-270))/65-T*2.5)'"
  },
  {
    name: 'auth-register.mp4',
    poster: 'auth-register.jpg',
    lavfi: "nullsrc=s=960x540:rate=30,geq=r='30+40*sin(atan2(Y-270,X-480)*12+T*7)':g='120+90*sin(atan2(Y-270,X-480)*8+T*6)':b='150+95*cos(atan2(Y-270,X-480)*10+T*8)'"
  },
  {
    name: 'auth-forgot.mp4',
    poster: 'auth-forgot.jpg',
    lavfi: "nullsrc=s=960x540:rate=30,geq=r='110+75*sin(X/35-T*4)':g='80+60*sin(Y/40+T*3.5)':b='70+60*cos((X-Y)/45+T*3)'"
  },
  {
    name: 'auth-otp.mp4',
    poster: 'auth-otp.jpg',
    lavfi: "nullsrc=s=960x540:rate=30,geq=r='15+25*cos(atan2(Y-270,X-480)*6-T*7)':g='135+90*sin(atan2(Y-270,X-480)*6-T*7)+45*sin(sqrt((X-480)*(X-480)+(Y-270)*(Y-270))/25)':b='95+65*sin(atan2(Y-270,X-480)*3+T*4.5)'"
  },
  {
    name: 'auth-reset.mp4',
    poster: 'auth-reset.jpg',
    lavfi: "nullsrc=s=960x540:rate=30,geq=r='25+35*sin(X/55+T*4.5)':g='100+80*sin((X+Y)/45-T*5)':b='145+90*cos(Y/50+T*4)'"
  }
];

console.log('=== GENERATING 13 DISTINCT HIGH-MOTION VIDEOS & EXACT FIRST-FRAME POSTERS ===');

for (let i = 0; i < THEMES.length; i++) {
  const item = THEMES[i];
  const videoPath = path.join(outDir, item.name);
  const posterPath = path.join(mediaDir, item.poster);

  console.log(`[${i + 1}/${THEMES.length}] Generating ${item.name}...`);

  let cmd = `ffmpeg -y -f lavfi -i "${item.lavfi}" -t ${DURATION} -r ${FPS} -c:v libx264 -preset ultrafast -pix_fmt yuv420p "${videoPath}"`;
  execSync(cmd, { stdio: 'ignore' });

  // Extract EXACT first frame as poster
  let posterCmd = `ffmpeg -y -ss 00:00:00.000 -i "${videoPath}" -vframes 1 -q:v 2 "${posterPath}"`;
  execSync(posterCmd, { stdio: 'ignore' });

  console.log(`  -> Video size: ${(fs.statSync(videoPath).size / 1024).toFixed(1)} KB | Poster: ${item.poster}`);
}

console.log('=== ALL 13 VIDEOS & MATCHING POSTERS GENERATED SUCCESSFULLY ===');
