import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Building DJ John web portal for production...');

// Clean and recreate dist
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist, { recursive: true });

// Copy main HTML pages
fs.copyFileSync(path.join(root, 'index.html'), path.join(dist, 'index.html'));
if (fs.existsSync(path.join(root, 'standalone.html'))) {
  fs.copyFileSync(path.join(root, 'standalone.html'), path.join(dist, 'standalone.html'));
}

// Copy full assets tree (css, js, media, fonts, vendor)
copyDir(path.join(root, 'assets'), path.join(dist, 'assets'));

// Copy public directory and place favicons at root of dist
if (fs.existsSync(path.join(root, 'public'))) {
  copyDir(path.join(root, 'public'), path.join(dist, 'public'));
  for (const f of fs.readdirSync(path.join(root, 'public'))) {
    const srcF = path.join(root, 'public', f);
    if (fs.statSync(srcF).isFile()) {
      fs.copyFileSync(srcF, path.join(dist, f));
    }
  }
}

console.log('Build successful! All static assets, scripts, fonts, and media copied to dist/');
