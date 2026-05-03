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

const simpleFiles = ['lam-backend.exe', '.env'];
simpleFiles.forEach(f => {
    if (fs.existsSync(f)) fs.cpSync(f, path.join('build', f));
});

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
copyWithFilter('proto', 'build', '.proto');

if (fs.existsSync('lam-backend.exe')) fs.rmSync('lam-backend.exe');

console.log('Build completed successfully!');