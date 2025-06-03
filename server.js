// Simple Next.js server starter
const next = require('next');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Check if .next directory exists
const nextDirExists = fs.existsSync(path.join(__dirname, '.next'));
console.log(`> .next directory exists: ${nextDirExists}`);
if (!nextDirExists) {
  console.error('> ERROR: .next directory does not exist. Build may have failed.');
  console.error('> Checking for build artifacts...');
  const files = fs.readdirSync(__dirname);
  console.log(`> Files in root directory: ${files.join(', ')}`);
}

const port = parseInt(process.env.PORT || '10000', 10);
console.log(`> PORT set to: ${port}`);

const dev = process.env.NODE_ENV !== 'production';
console.log(`> Running in ${dev ? 'development' : 'production'} mode`);

try {
  const app = next({ dev });
  const handleNextRequests = app.getRequestHandler();

  app.prepare().then(() => {
    console.log('> Next.js app prepared successfully');
    
    const server = http.createServer((req, res) => {
      handleNextRequests(req, res);
    });

    server.listen(port, (err) => {
      if (err) {
        console.error('> Error starting server:', err);
        throw err;
      }
      console.log(`> Ready on http://localhost:${port}`);
    });
  }).catch(err => {
    console.error('> Error preparing Next.js app:', err);
    process.exit(1);
  });
} catch (error) {
  console.error('> Critical error starting Next.js server:', error);
  process.exit(1);
} 