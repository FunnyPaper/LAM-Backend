const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const run = (cmd) => {
    console.log(`> ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
};

console.log('Creating installer...');
run('npm run build:windows:nsis');

fs.mkdirSync('bin', { recursive: true });
const installer = 'installer/lam-backend-installer.exe';
if (fs.existsSync(installer)) {
    fs.cpSync(installer, 'bin/lam-backend-installer.exe');
    fs.rmSync(installer);
}

console.log('Installer created.');