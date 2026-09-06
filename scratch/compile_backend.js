const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else if (file.endsWith('.jar') && !file.endsWith('-sources.jar') && !file.endsWith('-javadoc.jar')) {
      results.push(fullPath.replace(/\\/g, '/'));
    }
  });
  return results;
}

function getJavaFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getJavaFiles(fullPath));
    } else if (file.endsWith('.java')) {
      results.push(fullPath.replace(/\\/g, '/'));
    }
  });
  return results;
}

const javacPath = 'C:/Users/me/Documents/sts-5.1.1.RELEASE/plugins/org.eclipse.justj.openjdk.hotspot.jre.full.win32.x86_64_25.0.2.v20260203-1141/jre/bin/javac.exe';
const m2Repo = 'C:/Users/me/.m2/repository';
const targetClasses = 'c:/Users/me/Desktop/ExTask/backend/target/classes';
const srcDir = 'c:/Users/me/Desktop/ExTask/backend/src/main/java';

if (!fs.existsSync(targetClasses)) {
  fs.mkdirSync(targetClasses, { recursive: true });
}

const jars = getAllFiles(m2Repo);
const sources = getJavaFiles(srcDir);

console.log(`Found ${jars.length} binary dependency JARs and ${sources.length} Java source files.`);

const cpArg = `${targetClasses};` + jars.join(';');
const argFileContent = `--release 17\n-parameters\n-d "${targetClasses}"\n-cp "${cpArg}"\n${sources.map(s => `"${s}"`).join('\n')}`;

const argFilePath = path.join(__dirname, 'javac_args.txt').replace(/\\/g, '/');
fs.writeFileSync(argFilePath, argFileContent, 'utf-8');

console.log('Running javac with --release 17 -parameters...');
const result = spawnSync(javacPath, [`@${argFilePath}`], { stdio: 'inherit', shell: true });

console.log('Javac exit code:', result.status);
process.exit(result.status || 0);
