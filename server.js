// Minimal local static server with clean-route rewrites
// - "/"               -> "/index.html"
// - "/:slug"[ / ]     -> "/pages/:slug.html"
// - Direct files and assets served as-is (e.g., "/assets/...", "/pages/...", "/vercel.json")

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const rootDir = __dirname;
const port = process.env.PORT || 3000;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4'
};

function mapRequestToFilePath(requestUrl) {
  const parsed = url.parse(requestUrl);
  let pathname = decodeURIComponent(parsed.pathname || '/');

  // Normalize to avoid path traversal
  pathname = path.posix.normalize(pathname);

  // Root -> index.html
  if (pathname === '/' || pathname === '/index' || pathname === '/index/') {
    return '/index.html';
  }

  // If request has an extension, serve as-is (assets, pages, etc.)
  const hasExtension = path.posix.extname(pathname) !== '';
  if (hasExtension) {
    return pathname;
  }

  // Clean route rewrite: "/about" or "/about/" -> "/pages/about.html"
  const slug = pathname.replace(/^\//, '').replace(/\/$/, '');
  if (slug.length > 0) {
    return `/pages/${slug}.html`;
  }

  // Fallback to index.html
  return '/index.html';
}

function sendFile(res, absolutePath) {
  const ext = path.extname(absolutePath).toLowerCase();
  const type = contentTypes[ext] || 'application/octet-stream';
  fs.readFile(absolutePath, (err, data) => {
    if (err) {
      res.statusCode = err.code === 'ENOENT' ? 404 : 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(err.code === 'ENOENT' ? '404 Not Found' : '500 Internal Server Error');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', type);
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  try {
    const mappedPath = mapRequestToFilePath(req.url);
    const absolutePath = path.join(rootDir, mappedPath);

    // Ensure the resolved path stays within the project root
    if (!absolutePath.startsWith(rootDir)) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('403 Forbidden');
      return;
    }

    // If mapped file doesn't exist, try serving index.html (SPA-style fallback) or 404
    fs.stat(absolutePath, (err, stat) => {
      if (!err && stat.isFile()) {
        sendFile(res, absolutePath);
      } else {
        const fallback = path.join(rootDir, 'index.html');
        fs.stat(fallback, (fallbackErr, fallbackStat) => {
          if (!fallbackErr && fallbackStat.isFile()) {
            sendFile(res, fallback);
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('404 Not Found');
          }
        });
      }
    });
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('500 Internal Server Error');
  }
});

server.listen(port, () => {
  console.log(`Local server running at http://localhost:${port}`);
  console.log('Clean routes enabled: /about -> /pages/about.html, etc.');
});


