const http = require('http');
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '..', '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf-8').split('\n')) {
    const i = line.indexOf('=');
    if (i > 0 && !process.env[line.slice(0, i)]) process.env[line.slice(0, i)] = line.slice(i + 1);
  }
}

const scoresHandler = require('../api/submit.js');
const DIST = path.join(__dirname, '..', 'dist');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname.startsWith('/api/')) {
    res.status = code => { res.statusCode = code; return res; };
    res.json = body => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(body)); };
    if (req.method === 'POST') {
      let raw = '';
      req.on('data', c => { raw += c; });
      req.on('end', () => { req.body = raw; scoresHandler(req, res); });
      return;
    }
    return scoresHandler(req, res);
  }
  let filePath = path.join(DIST, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  } else if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html');
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

let port = parseInt(process.env.PORT || '3001', 10);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${port} is in use, trying port ${port + 1}...`);
    port++;
    server.listen(port);
  } else {
    console.error('Server error:', err);
  }
});

server.on('listening', () => {
  console.log(`Dev server (static + /api): http://localhost:${server.address().port}`);
});

server.listen(port);