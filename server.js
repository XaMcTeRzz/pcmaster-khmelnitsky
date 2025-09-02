const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Обробка кореневого шляху
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'telegram_message_example.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Помилка сервера');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Сторінку не знайдено');
  }
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Сервер запущено на http://localhost:${PORT}`);
});