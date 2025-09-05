const https = require('https');
const fs = require('fs');
const path = require('path');

// Для локальной разработки с самоподписанным сертификатом
const options = {
  key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'localhost.pem'))
};

const server = https.createServer(options, (req, res) => {
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
  // Обробка статичних файлів CSS
  else if (req.url.startsWith('/css/')) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Файл не знайдено');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
      }
    });
  }
  // Обробка статичних файлів JS
  else if (req.url.startsWith('/js/')) {
    const filePath = path.join(__dirname, req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Файл не знайдено');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });
  }
  else {
    res.writeHead(404);
    res.end('Сторінку не знайдено');
  }
});

const PORT = 8443;
server.listen(PORT, () => {
  console.log(`HTTPS сервер запущено на https://localhost:${PORT}`);
  console.log('Примітка: Браузер покаже попередження про небезпечний сертифікат - це нормально для локальної розробки');
});