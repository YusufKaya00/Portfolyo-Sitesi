// Simple Next.js server starter
const next = require('next');
const http = require('http');

const port = parseInt(process.env.PORT || '10000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handleNextRequests = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handleNextRequests(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
}); 