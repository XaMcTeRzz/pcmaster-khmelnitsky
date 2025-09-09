const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
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
  else {
    res.writeHead(404);
    res.end('Сторінку не знайдено');
  }
});

const PORT = 8001;
server.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});