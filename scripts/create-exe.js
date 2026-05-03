const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const run = (cmd) => {
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
};

console.log('Cleaning...');
['dist', 'build', 'bin', 'lam-backend.exe'].forEach(p => 
    fs.rmSync(p, { recursive: true, force: true })
);

run('npm run build');
run('npm run build:ncc');
run('npm run build:windows:x64');

console.log('Organizing build directory...');
fs.mkdirSync('build', { recursive: true });

const simpleFiles = ['lam-backend.exe'];
simpleFiles.forEach(f => {
    if (fs.existsSync(f)) fs.cpSync(f, path.join('build', f));
});

const env = `
# Initial Admin Credentials
  INITIAL_ADMIN_USERNAME = "SuperAdmin"
  INITIAL_ADMIN_PASSWORD = "Abc123@"

# DB
  TYPE=local
  DB_TYPE=sqlite
  DB_DATABASE=local.sqlite3
  DB_SYNCHRONIZE=false

# JWT
  JWT_ACCESS_SECRET=access-secret
  JWT_ACCESS_EXPIRES_IN=15m
  JWT_REFRESH_SECRET=refresh-secret
  JWT_REFRESH_EXPIRES_IN=30d

# HASH
  HASH_SALT_ROUNDS=10

# Max concurrent runners
  SCRIPT_RUNS_CONCURRENCY=1
`.trim()

fs.writeFileSync(path.join('build', '.env'), env);

const copyWithFilter = (src, dest, ext) => {
    if (!fs.existsSync(src)) return;
    fs.cpSync(src, path.join(dest, src), {
        recursive: true,
        filter: (file) => {
            if (fs.statSync(file).isDirectory()) return true;
            return file.endsWith(ext);
        }
    });
};

copyWithFilter('dist', 'build', '.node');
copyWithFilter('dist/migrations/local', 'build', '.js');
copyWithFilter('proto', 'build', '.proto');

if (fs.existsSync('lam-backend.exe')) fs.rmSync('lam-backend.exe');

console.log('Build completed successfully!');