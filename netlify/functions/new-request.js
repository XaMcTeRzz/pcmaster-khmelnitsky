exports.handler = async (event, context) => {
    // CORS заголовки
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Обработка preflight запроса
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Метод не поддерживается' })
        };
    }

    try {
        const requestData = JSON.parse(event.body);
        
        // Валидация данных
        if (!requestData.name || !requestData.phone) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Отсутствуют обязательные поля' })
            };
        }

        // Добавляем временную метку
        requestData.timestamp = new Date().toISOString();
        requestData.id = `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        console.log('📞 Новая заявка:', requestData.name, requestData.phone);

        // Отправляем push-уведомление через Web Push API
        // (здесь можно интегрировать с сервисами типа Firebase или OneSignal)
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Заявка получена и обработана',
                requestId: requestData.id,
                data: requestData
            })
        };

    } catch (error) {
        console.error('Ошибка обработки заявки:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Внутренняя ошибка сервера',
                details: error.message
            })
        };
    }
};