const webpush = require('web-push');

// Настройка VAPID ключей (замените на ваши)
const VAPID_KEYS = {
    publicKey: process.env.VAPID_PUBLIC_KEY || 'BEl62iUYgUivxIkv69yViEuiBIa40HcCWLdHw5hh_nxAvE-2_QKLK7s0UAEbKDj0VqGwAP9IgPWZ8wpwTJ5dM3c',
    privateKey: process.env.VAPID_PRIVATE_KEY || 'nGzcgw5zIrWz4d4XnETGJMVyHUOT2FYg0VXKm3vOKzE'
};

webpush.setVapidDetails(
    'mailto:support@pcmaster-khmelnytskyi.xyz',
    VAPID_KEYS.publicKey,
    VAPID_KEYS.privateKey
);

// Хранилище подписок (в продакшене используйте базу данных)
let subscriptions = new Set();

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const path = event.path.replace('/.netlify/functions/push-notifications', '');

    try {
        switch (event.httpMethod) {
            case 'POST':
                if (path === '/subscribe') {
                    return await handleSubscribe(event, headers);
                } else if (path === '/send') {
                    return await handleSendNotification(event, headers);
                }
                break;
            
            case 'GET':
                if (path === '/vapid-public-key') {
                    return {
                        statusCode: 200,
                        headers,
                        body: JSON.stringify({ publicKey: VAPID_KEYS.publicKey })
                    };
                }
                break;
        }

        return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Endpoint не найден' })
        };

    } catch (error) {
        console.error('Ошибка push-уведомлений:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Внутренняя ошибка сервера' })
        };
    }
};

async function handleSubscribe(event, headers) {
    const subscription = JSON.parse(event.body);
    
    // Добавляем подписку в хранилище
    subscriptions.add(JSON.stringify(subscription));
    
    console.log('📱 Новая подписка на push-уведомления');
    
    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Подписка добавлена' })
    };
}

async function handleSendNotification(event, headers) {
    const { title, body, icon, data } = JSON.parse(event.body);
    
    const payload = JSON.stringify({
        title: title || '🚨 Новая заявка PC-Master!',
        body: body || 'Получена новая заявка на сайте',
        icon: icon || '/favicon.svg',
        badge: '/favicon.svg',
        data: data || {},
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
        requireInteraction: true,
        vibrate: [200, 100, 200, 100, 200, 100, 400]
    });

    const results = [];
    
    // Отправляем уведомления всем подписчикам
    for (const subscriptionString of subscriptions) {
        try {
            const subscription = JSON.parse(subscriptionString);
            await webpush.sendNotification(subscription, payload);
            results.push({ success: true });
        } catch (error) {
            console.error('Ошибка отправки push-уведомления:', error);
            // Удаляем недействительные подписки
            if (error.statusCode === 410) {
                subscriptions.delete(subscriptionString);
            }
            results.push({ success: false, error: error.message });
        }
    }

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            success: true,
            message: 'Уведомления отправлены',
            results: results,
            totalSent: results.filter(r => r.success).length
        })
    };
}