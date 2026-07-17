const fs = require('fs');
const path = require('path');

const index = fs.readFileSync('demo/index.html', 'utf-8');

const markers = [
  { name: '_head.html', startStr: null, endStr: '    <!-- Mobile Topbar -->' },
  { name: '_nav.html', startStr: '    <!-- Mobile Topbar -->', endStr: '      <!-- ═══════════════════════════ HERO ═══════════════════════════ -->' },
  { name: '_hero.html', startStr: '      <!-- ═══════════════════════════ HERO ═══════════════════════════ -->', endStr: '      <!-- ═══════════════════════════ ABOUT ═══════════════════════════ -->' },
  { name: '_about.html', startStr: '      <!-- ═══════════════════════════ ABOUT ═══════════════════════════ -->', endStr: '<!-- ═══════════════════════════ OUR SERVICES ═══════════════════════════ -->' },
  { name: '_expertise.html', startStr: '<!-- ═══════════════════════════ OUR SERVICES ═══════════════════════════ -->', endStr: '<!-- ═══════════════════════════ REVIEWS CAROUSEL ═══════════════════════════ -->' },
  { name: '_reviews.html', startStr: '<!-- ═══════════════════════════ REVIEWS CAROUSEL ═══════════════════════════ -->', endStr: '<!-- ═══════════════════════════ PROJECTS GALLERY ═══════════════════════════ -->' },
  { name: '_projects.html', startStr: '<!-- ═══════════════════════════ PROJECTS GALLERY ═══════════════════════════ -->', endStr: '      <!-- ═══════════════════════════ BADGES + SERVING ═══════════════════════════ -->' },
  { name: '_serving.html', startStr: '      <!-- ═══════════════════════════ BADGES + SERVING ═══════════════════════════ -->', endStr: '      <!-- ═══════════════════════════ MAP ═══════════════════════════ -->' },
  { name: '_map.html', startStr: '      <!-- ═══════════════════════════ MAP ═══════════════════════════ -->', endStr: '      <!-- ═══════════════════════════ FOOTER ═══════════════════════════ -->' },
  { name: '_footer.html', startStr: '      <!-- ═══════════════════════════ FOOTER ═══════════════════════════ -->', endStr: '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>' },
  { name: '_scripts.html', startStr: '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>', endStr: null }
];

for (const m of markers) {
  let startIdx = 0;
  if (m.startStr) {
    startIdx = index.indexOf(m.startStr);
  }
  
  let endIdx = index.length;
  if (m.endStr) {
    endIdx = index.indexOf(m.endStr);
  }
  
  const content = index.substring(startIdx, endIdx);
  fs.writeFileSync(path.join('demo/src', m.name), content);
}
console.log('Sync complete');
