const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DEMO = __dirname;

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    if (fs.statSync(s).isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

// 1. Build HTML from partials
const srcDir = path.join(DEMO, 'src');
const partials = [
  '_head.html', '_nav.html', '_hero.html', '_about.html',
  '_expertise.html', '_reviews.html', '_projects.html',
  '_badges.html', '_serving.html', '_map.html',
  '_footer.html', '_scripts.html',
];

const html = partials
  .map(file => fs.readFileSync(path.join(srcDir, file), 'utf-8'))
  .join('\n');

// 2. Assemble dist/
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

fs.writeFileSync(path.join(DIST, 'index.html'), html);

// Preserve /demo/ path prefix in dist/
fs.mkdirSync(path.join(DIST, 'demo'));
copyDir(path.join(DEMO, 'images'), path.join(DIST, 'demo', 'images'));
copyDir(path.join(DEMO, 'css'),    path.join(DIST, 'demo', 'css'));
copyDir(path.join(DEMO, 'js'),     path.join(DIST, 'demo', 'js'));

// Root-level assets (favicon, logo, video)
const rootAssets = ['assets'];
if (fs.existsSync(path.join(ROOT, 'hero-section-video.mp4'))) {
  fs.copyFileSync(
    path.join(ROOT, 'hero-section-video.mp4'),
    path.join(DIST, 'hero-section-video.mp4')
  );
}
for (const dir of rootAssets) {
  const srcPath = path.join(ROOT, dir);
  if (fs.existsSync(srcPath)) {
    copyDir(srcPath, path.join(DIST, dir));
  }
}

// Also copy demo/index.html so /demo/ resolves from root
fs.copyFileSync(path.join(DIST, 'index.html'), path.join(DIST, 'demo', 'index.html'));

console.log('Built dist/');
