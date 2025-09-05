const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Конфигурация
const CONFIG = {
    port: 8000,
    telegramToken: '8256319983:AAGZKs_9Nqw2Kuep3HauUsSWpps5y7iGAcs', // Ваш токен бота
    chatId: '542791657', // Ваш Chat ID
    webhookPath: '/webhook/telegram',
    monitorClients: new Set() // WebSocket соединения для мониторинга
};

// Хранение активных соединений для Server-Sent Events
const sseClients = new Set();

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Обработка webhook от Telegram
    if (pathname === CONFIG.webhookPath && req.method === 'POST') {
        handleTelegramWebhook(req, res);
        return;
    }
    
    // Server-Sent Events для мониторинга
    if (pathname === '/monitor/events') {
        handleSSE(req, res);
        return;
    }
    
    // API для новых заявок с сайта
    if (pathname === '/api/new-request' && req.method === 'POST') {
        handleNewRequestFromSite(req, res);
        return;
    }
    
    // Статические файлы
    handleStaticFiles(req, res, pathname);
});

// Обработка webhook от Telegram
function handleTelegramWebhook(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const update = JSON.parse(body);
            
            // Проверяем, есть ли сообщение и содержит ли оно информацию о заявке
            if (update.message && update.message.text) {
                const message = update.message.text;
                
                // Если сообщение содержит маркеры заявки
                if (message.includes('НОВА ЗАЯВКА') || message.includes('PC-Master')) {
                    const requestData = parseRequestFromMessage(message);
                    broadcastNewRequest(requestData);
                }
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
            
        } catch (error) {
            console.error('Error processing webhook:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}

// Парсинг данных заявки из сообщения Telegram
function parseRequestFromMessage(message) {
    const nameMatch = message.match(/Ім'я:\*\s*(.+)/);
    const phoneMatch = message.match(/Телефон:\*\s*(.+)/);
    const serviceMatch = message.match(/Послуга:\*\s*(.+)/);
    const timeMatch = message.match(/Час:\*\s*(.+)/);
    
    return {
        name: nameMatch ? nameMatch[1].trim() : 'Невідомо',
        phone: phoneMatch ? phoneMatch[1].trim() : 'Невідомо',
        service: serviceMatch ? serviceMatch[1].trim() : 'Невідомо',
        time: new Date().toISOString(),
        message: message
    };
}

// Трансляция новой заявки всем подключенным клиентам мониторинга
function broadcastNewRequest(requestData) {
    const eventData = JSON.stringify({
        type: 'new_request',
        data: requestData,
        timestamp: Date.now()
    });
    
    console.log('📢 Нова заявка:', requestData.name, requestData.phone);
    
    // Отправка всем SSE клиентам
    sseClients.forEach(client => {
        try {
            client.write(`data: ${eventData}\n\n`);
        } catch (error) {
            console.error('Error sending SSE:', error);
            sseClients.delete(client);
        }
    });
}

// Обработка Server-Sent Events
function handleSSE(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });
    
    // Отправка начального сообщения
    res.write('data: {"type":"connected","message":"Підключено до моніторингу"}\n\n');
    
    // Добавление клиента в список
    sseClients.add(res);
    
    // Heartbeat каждые 30 секунд
    const heartbeat = setInterval(() => {
        try {
            res.write('data: {"type":"heartbeat","timestamp":' + Date.now() + '}\n\n');
        } catch (error) {
            clearInterval(heartbeat);
            sseClients.delete(res);
        }
    }, 30000);
    
    // Очистка при отключении
    req.on('close', () => {
        clearInterval(heartbeat);
        sseClients.delete(res);
        console.log('Клієнт моніторингу відключився');
    });
    
    console.log('Новий клієнт моніторингу підключився');
}

// Обработка новой заявки с сайта
function handleNewRequestFromSite(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const requestData = JSON.parse(body);
            
            console.log('📞 Новая заявка с сайта:', requestData.name, requestData.phone);
            
            // Добавляем метку времени
            requestData.time = new Date().toISOString();
            requestData.source = 'website';
            
            // Транслируем уведомление всем подключенным мониторам
            broadcastNewRequest(requestData);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Заявка получена' }));
            
        } catch (error) {
            console.error('Ошибка обработки заявки:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}

// Тестовое уведомление
function handleTestNotification(req, res) {
    const testData = {
        name: 'Тестовий клієнт',
        phone: '+38 (097) 123-45-67',
        service: 'Тестова послуга',
        time: new Date().toISOString(),
        message: 'Тестове повідомлення'
    };
    
    broadcastNewRequest(testData);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Тестове уведомлення відправлено' }));
}

// Обработка статических файлов
function handleStaticFiles(req, res, pathname) {
    // Обработка корневого пути
    if (pathname === '/' || pathname === '/index.html') {
        serveFile(res, 'index.html', 'text/html; charset=utf-8');
    }
    // Обработка монитора заявок
    else if (pathname === '/monitor' || pathname === '/request-monitor.html') {
        serveFile(res, 'request-monitor.html', 'text/html; charset=utf-8');
    }
    // CSS файлы
    else if (pathname.startsWith('/css/')) {
        serveFile(res, pathname.slice(1), 'text/css');
    }
    // JS файлы
    else if (pathname.startsWith('/js/')) {
        serveFile(res, pathname.slice(1), 'application/javascript');
    }
    // Изображения
    else if (pathname.startsWith('/images/')) {
        const ext = path.extname(pathname);
        const mimeType = getMimeType(ext);
        serveFile(res, pathname.slice(1), mimeType);
    }
    // Другие файлы
    else if (pathname === '/favicon.svg') {
        serveFile(res, 'favicon.svg', 'image/svg+xml');
    }
    else if (pathname === '/robots.txt') {
        serveFile(res, 'robots.txt', 'text/plain');
    }
    else if (pathname === '/sitemap.xml') {
        serveFile(res, 'sitemap.xml', 'application/xml');
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>404 - Сторінку не знайдено</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #e74c3c; }
                    a { color: #3498db; text-decoration: none; }
                </style>
            </head>
            <body>
                <h1>404 - Сторінку не знайдено</h1>
                <p>Запитувана сторінка не існує.</p>
                <p><a href="/">← Повернутися на головну</a></p>
                <p><a href="/monitor">📱 Монітор заявок</a></p>
            </body>
            </html>
        `);
    }
}

// Сервис файла
function serveFile(res, filePath, contentType) {
    const fullPath = path.join(__dirname, filePath);
    
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            console.error('Помилка читання файлу:', err);
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('Файл не знайдено');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}

// Определение MIME типа по расширению
function getMimeType(ext) {
    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.txt': 'text/plain',
        '.xml': 'application/xml',
        '.json': 'application/json'
    };
    
    return mimeTypes[ext] || 'application/octet-stream';
}

// Функция настройки webhook (вызывается при запуске)
async function setupTelegramWebhook() {
    const webhookUrl = `https://your-domain.com${CONFIG.webhookPath}`;
    
    // Для локального тестирования можно использовать ngrok
    console.log('📡 Для настройки webhook используйте:');
    console.log(`curl -X POST "https://api.telegram.org/bot${CONFIG.telegramToken}/setWebhook" -d "url=${webhookUrl}"`);
    console.log('');
    console.log('💡 Для локального тестирования установите ngrok:');
    console.log('npm install -g ngrok');
    console.log(`ngrok http ${CONFIG.port}`);
    console.log('Затем используйте URL от ngrok для webhook');
}

// Запуск сервера
server.listen(CONFIG.port, () => {
    console.log('🚀 Сервер PC-Master запущено!');
    console.log(`📡 Порт: ${CONFIG.port}`);
    console.log(`🌐 Основний сайт: http://localhost:${CONFIG.port}`);
    console.log(`📱 Монітор заявок: http://localhost:${CONFIG.port}/monitor`);
    console.log(`🔗 Webhook endpoint: http://localhost:${CONFIG.port}${CONFIG.webhookPath}`);
    console.log('');
    
    setupTelegramWebhook();
    
    console.log('✅ Система готова до роботи!');
});

// Обработка ошибок
process.on('uncaughtException', (error) => {
    console.error('Критична помилка:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Необроблена помилка Promise:', reason);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Зупинка сервера...');
    server.close(() => {
        console.log('✅ Сервер зупинено');
        process.exit(0);
    });
});

module.exports = server;