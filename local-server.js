const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.url}`);
  
  // Обробка кореневого шляху
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Помилка сервера');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      }
    });
  }
  // Обробка HTML файлів
  else if (req.url.endsWith('.html')) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Сторінку не знайдено');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      }
    });
  }
  // Обробка CSS файлів
  else if (req.url.startsWith('/css/')) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('CSS файл не знайдено');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
  }
  // Обробка JS файлів
  else if (req.url.startsWith('/js/')) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('JS файл не знайдено');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });
  }
  // Обробка зображень
  else if (req.url.startsWith('/images/')) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Зображення не знайдено');
      } else {
        const ext = path.extname(filePath);
        let contentType = 'image/jpeg';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.svg') contentType = 'image/svg+xml';
        if (ext === '.ico') contentType = 'image/x-icon';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  }
  // Обробка favicon
  else if (req.url === '/favicon.svg') {
    fs.readFile(path.join(__dirname, 'favicon.svg'), (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Favicon не знайдено');
      } else {
        res.writeHead(200, { 'Content-Type': 'image/svg+xml' });
        res.end(data);
      }
    });
  }
  // Для всіх інших файлів
  else {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Файл не знайдено');
      } else {
        res.writeHead(200);
        res.end(data);
      }
    });
  }
});

// Функція для пошуку доступного порту
function findAvailablePort(startPort, callback) {
  const server = http.createServer();
  server.listen(startPort, () => {
    const port = server.address().port;
    server.close(() => callback(null, port));
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      findAvailablePort(startPort + 1, callback);
    } else {
      callback(err);
    }
  });
}

// Пошук доступного порту та запуск сервера
findAvailablePort(3000, (err, port) => {
  if (err) {
    console.error('Помилка при пошуку порту:', err);
    return;
  }
  
  server.listen(port, () => {
    console.log(`Локальний сервер запущено на http://localhost:${port}`);
    console.log(`Натисніть Ctrl+C для зупинки сервера`);
  });
});