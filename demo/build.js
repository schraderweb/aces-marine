const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src');
const partials = [
  '_head.html',
  '_nav.html',
  '_hero.html',
  '_about.html',
  '_expertise.html',
  '_reviews.html',
  '_projects.html',
  '_badges.html',
  '_serving.html',
  '_map.html',
  '_footer.html',
  '_scripts.html',
];

const html = partials
  .map(file => fs.readFileSync(path.join(src, file), 'utf-8'))
  .join('\n');

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Built demo/index.html');
