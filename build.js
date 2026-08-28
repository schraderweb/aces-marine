const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'src');

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

const basePartials = [
  '_expertise.html', '_reviews.html', '_projects.html',
  '_serving.html', '_map.html',
  '_footer.html', '_scripts.html',
];

const indexPartials = ['_head.html', '_nav.html', '_hero.html', '_about.html', ...basePartials];
const galleryPartials = ['_head.html', '_nav.html', '_gallery_hero.html', '_gallery_content.html', ...basePartials];

const indexHtml = indexPartials
  .map(file => fs.readFileSync(path.join(SRC, file), 'utf-8'))
  .join('\n');

const galleryHtml = galleryPartials
  .map(file => fs.readFileSync(path.join(SRC, file), 'utf-8'))
  .join('\n');

// Write compiled sites to root
fs.writeFileSync(path.join(ROOT, 'index.html'), indexHtml);
fs.writeFileSync(path.join(ROOT, 'gallery.html'), galleryHtml);

// 2. Assemble dist/
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(DIST, 'index.html'));
fs.copyFileSync(path.join(ROOT, 'gallery.html'), path.join(DIST, 'gallery.html'));

for (const dir of ['images', 'css', 'js', 'assets']) {
  const srcPath = path.join(ROOT, dir);
  if (fs.existsSync(srcPath)) {
    copyDir(srcPath, path.join(DIST, dir));
  }
}

if (fs.existsSync(path.join(ROOT, 'hero-section-video.mp4'))) {
  fs.copyFileSync(
    path.join(ROOT, 'hero-section-video.mp4'),
    path.join(DIST, 'hero-section-video.mp4')
  );
}

console.log('Built dist/');