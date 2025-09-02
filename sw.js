// Service Worker для PC-Master push-уведомлений
const CACHE_NAME = 'pc-master-v1';
const STATIC_CACHE = [
    '/',
    '/css/style.css',
    '/js/script.js',
    '/favicon.svg'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker установлен');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_CACHE))
    );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker активирован');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
    console.log('📨 Получено push-уведомление');
    
    let notificationData = {
        title: '🚨 Новая заявка PC-Master!',
        body: 'Получена новая заявка на сайте',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200, 100, 200, 100, 400],
        requireInteraction: true,
        actions: [
            {
                action: 'view',
                title: 'Посмотреть',
                icon: '/favicon.svg'
            },
            {
                action: 'close',
                title: 'Закрыть'
            }
        ],
        data: {
            url: '/',
            timestamp: Date.now()
        }
    };

    // Парсим данные из push-сообщения
    if (event.data) {
        try {
            const pushData = event.data.json();
            notificationData = { ...notificationData, ...pushData };
        } catch (error) {
            console.error('Ошибка парсинга push-данных:', error);
        }
    }

    // Показываем уведомление
    event.waitUntil(
        self.registration.showNotification(notificationData.title, {
            body: notificationData.body,
            icon: notificationData.icon,
            badge: notificationData.badge,
            vibrate: notificationData.vibrate,
            requireInteraction: notificationData.requireInteraction,
            actions: notificationData.actions,
            data: notificationData.data,
            tag: 'pc-master-request' // Группировка уведомлений
        })
    );
});

// Обработка кликов по уведомлению
self.addEventListener('notificationclick', (event) => {
    console.log('👆 Клик по уведомлению:', event.notification.tag);
    
    event.notification.close();

    if (event.action === 'view' || !event.action) {
        // Открываем сайт или фокусируемся на существующей вкладке
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then((clientList) => {
                // Проверяем, есть ли уже открытая вкладка с сайтом
                for (const client of clientList) {
                    if (client.url.includes(self.location.hostname) && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                // Если нет открытых вкладок, открываем новую
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    }
});

// Обработка закрытия уведомления
self.addEventListener('notificationclose', (event) => {
    console.log('❌ Уведомление закрыто:', event.notification.tag);
});

// Кеширование запросов
self.addEventListener('fetch', (event) => {
    // Пропускаем Netlify Functions
    if (event.request.url.includes('/.netlify/functions/')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Возвращаем кешированную версию или делаем сетевой запрос
                return response || fetch(event.request);
            })
    );
});

// Синхронизация в фоне (опционально)
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('🔄 Фоновая синхронизация');
        event.waitUntil(
            // Здесь можно добавить логику синхронизации данных
            Promise.resolve()
        );
    }
});

// Обработка ошибок
self.addEventListener('error', (event) => {
    console.error('❌ Ошибка Service Worker:', event.error);
});

// Логирование сообщений от основного потока
self.addEventListener('message', (event) => {
    console.log('📩 Сообщение от клиента:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});