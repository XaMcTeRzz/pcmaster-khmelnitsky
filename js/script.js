// Force HTTPS redirect
if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    location.replace('https:' + window.location.href.substring(window.location.protocol.length));
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Background on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Phone validation function
function isValidPhone(phone) {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid Ukrainian phone number
    // Formats: +380XXXXXXXXX, 380XXXXXXXXX, 0XXXXXXXXX, XXXXXXXXX
    if (cleanPhone.length === 12 && cleanPhone.startsWith('380')) {
        return true; // +380XXXXXXXXX
    }
    if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
        return true; // 0XXXXXXXXX
    }
    if (cleanPhone.length === 9) {
        return true; // XXXXXXXXX (without 0)
    }
    
    return false;
}

// Contact Form Handling with Telegram Bot
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Form submitted!');
        
        // Get form data with better selectors
        const nameInput = this.querySelector('input[type="text"]') || this.querySelector('input[placeholder*="ім"]');
        const phoneInput = this.querySelector('input[type="tel"]') || this.querySelector('input[placeholder*="телеф"]');
        const serviceSelect = this.querySelector('select');
        const messageTextarea = this.querySelector('textarea');
        
        const name = nameInput ? nameInput.value.trim() : '';
        const phone = phoneInput ? phoneInput.value.trim() : '';
        const service = serviceSelect ? serviceSelect.value : '';
        const message = messageTextarea ? messageTextarea.value.trim() : '';
        
        console.log('Form data:', { name, phone, service, message });
        
        // Basic validation
        if (!name || !phone) {
            showNotification('Будь ласка, заповніть обов\'язкові поля', 'error');
            return;
        }
        
        if (!isValidPhone(phone)) {
            showNotification('Будь ласка, введіть коректний номер телефону', 'error');
            return;
        }
        
        // Send to Telegram
        sendToTelegram(name, phone, service, message);
        
        // Reset form
        this.reset();
    });
} else {
    console.error('Contact form not found!');
}

// Telegram Bot Configuration - Updated with correct Chat ID
const TELEGRAM_CONFIG = {
    botToken: '8256319983:AAGZKs_9Nqw2Kuep3HauUsSWpps5y7iGAcs',
    chatId: '542791657' // Verified working Chat ID
};

// Test bot connection on page load
async function testBotConnection() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/getMe`);
        const result = await response.json();
        
        if (result.ok) {
            console.log('✅ Telegram бот активен:', result.result.first_name);
            return true;
        } else {
            console.error('❌ Ошибка бота:', result.description);
            return false;
        }
    } catch (error) {
        console.error('❌ Не удалось подключиться к Telegram API:', error);
        return false;
    }
}

// Test bot connection when page loads
document.addEventListener('DOMContentLoaded', function() {
    testBotConnection();
});

// Generate unique ID for each request
function generateRequestId() {
    return 'PC' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

// Send message to Telegram
async function sendToTelegram(name, phone, service, message) {
    const serviceNames = {
        'windows': '💻 Перестановка Windows',
        'programs': '⚙️ Налаштування програм',
        'repair': '🔧 Ремонт комп\'ютера',
        'virus': '🛡 Видалення вірусів',
        'network': '🌐 Налаштування мережі',
        'other': '❓ Інше'
    };
    
    const serviceName = serviceNames[service] || 'Не вказано';
    
    // Clean phone number for tel: link (only digits)
    const cleanPhone = phone.replace(/\D/g, '');
    let dialNumber = phone;
    
    // Format phone number for display
    let formattedPhone = phone;
    if (cleanPhone.startsWith('380') && cleanPhone.length === 12) {
        formattedPhone = `+38 (${cleanPhone.slice(2, 5)}) ${cleanPhone.slice(5, 8)}-${cleanPhone.slice(8, 10)}-${cleanPhone.slice(10, 12)}`;
        dialNumber = `+${cleanPhone}`;
    } else if (cleanPhone.length === 10) {
        formattedPhone = `+38 (${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6, 8)}-${cleanPhone.slice(8, 10)}`;
        dialNumber = `+38${cleanPhone}`;
    }
    
    // Get current date and time with better formatting
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    const formattedDate = `${day}.${month}.${year}`;
    const formattedTime = `${hours}:${minutes}`;
    
    // Get day of week
    const daysOfWeek = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    const dayOfWeek = daysOfWeek[now.getDay()];
    
    // Generate unique request ID
    const requestId = generateRequestId();
    
    // Create premium 3D styled Telegram message
    const telegramMessage = 
        `🌟 <b>НОВА ЗАЯВКА</b> 🌟\n` +
        `🏷️ <code>#${requestId}</code>\n\n` +
        
        `🏢 <b>PC-Master Хмельницький</b>\n` +
        `📍 м. Хмельницький, Україна\n` +
        `🌐 pcmaster-khmelnytskyi.xyz\n\n` +
        
        `👤 <b>ІНФОРМАЦІЯ ПРО КЛІЄНТА</b>\n` +
        `    🙋‍♂️ <b>Ім'я:</b> ${name}\n` +
        `    📱 <b>Телефон:</b> <a href="tel:${dialNumber}">${formattedPhone}</a>\n\n` +
        
        `🛠️ <b>ДЕТАЛІ ЗАМОВЛЕННЯ</b>\n` +
        `    🔸 <b>Послуга:</b> ${serviceName}\n` +
        `    📝 <b>Опис:</b> ${message || '❌ Не вказано'}\n\n` +
        
        `⏰ <b>ЧАСОВА МІТКА</b>\n` +
        `    📅 <b>Дата:</b> ${formattedDate} (${dayOfWeek})\n` +
        `    🕐 <b>Час:</b> ${formattedTime}\n\n` +
        
        `💼 <b>ПЛАН ДІЙ:</b>\n` +
        `    • 📞 Зателефонувати клієнту\n` +
        `    • 📋 Уточнити деталі\n` +
        `    • 🗓️ Домовитися про час\n` +
        `    • ✅ Виконати замовлення\n\n` +
        
        `✨━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━✨\n` +
        `🤖 <i>Повідомлення згенеровано автоматично</i>\n` +
        `🔗 <i>CRM Система PC-Master v2.1</i>`;
    
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    try {
        showNotification('Відправляємо заявку...', 'info');
        
        console.log('Sending to Telegram:', {
            bot_token: TELEGRAM_CONFIG.botToken.substring(0, 10) + '...',
            chat_id: TELEGRAM_CONFIG.chatId,
            message_length: telegramMessage.length,
            url: url
        });
        
        // Проверяем конфигурацию перед отправкой
        if (!TELEGRAM_CONFIG.botToken || TELEGRAM_CONFIG.botToken.length < 20) {
            throw new Error('Неправильный Bot Token');
        }
        
        if (!TELEGRAM_CONFIG.chatId || TELEGRAM_CONFIG.chatId.length < 3) {
            throw new Error('Неправильный Chat ID');
        }
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                chat_id: String(TELEGRAM_CONFIG.chatId),
                text: telegramMessage,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        console.log('Telegram API response:', result);
        
        if (response.ok && result.ok) {
            showNotification('✅ Дякуємо! Ваша заявка відправлена. Ми зв\'яжемося з вами найближчим часом.', 'success');
            
            // Отправляем уведомление через Netlify Function
            try {
                const notificationResponse = await fetch('/.netlify/functions/new-request', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        phone: formattedPhone,
                        service: serviceName,
                        message: message,
                        requestId: requestId,
                        timestamp: Date.now()
                    })
                });
                
                if (notificationResponse.ok) {
                    console.log('✅ Уведомление отправлено через Netlify Function');
                    
                    // Отправляем push-уведомление
                    await sendPushNotification({
                        title: '🚨 Новая заявка PC-Master!',
                        body: `${name}\n${formattedPhone}\n${serviceName}`,
                        data: {
                            name: name,
                            phone: formattedPhone,
                            service: serviceName,
                            requestId: requestId
                        }
                    });
                }
            } catch (functionError) {
                console.log('❌ Netlify Function недоступна:', functionError);
            }
        } else {
            console.error('Telegram API error:', result);
            let errorMessage = '❌ Помилка відправки заявки';
            
            // Specific error handling with Ukrainian messages
            if (result.error_code === 403) {
                errorMessage = '❌ Помилка доступу до Telegram Bot. Можливо, бот заблокований або не активований. Будь ласка, зателефонуйте: +38 (097) 609-73-10';
            } else if (result.error_code === 400) {
                if (result.description && result.description.includes('chat not found')) {
                    errorMessage = '❌ Неправильний Chat ID в налаштуваннях бота. Зверніться до адміністратора сайту або зателефонуйте: +38 (097) 609-73-10';
                } else if (result.description && result.description.includes('bot was blocked')) {
                    errorMessage = '❌ Бот заблокований користувачем. Зверніться до адміністратора або зателефонуйте: +38 (097) 609-73-10';
                } else {
                    errorMessage = '❌ Помилка у даних заявки. Перевірте правильність введеної інформації або зателефонуйте: +38 (097) 609-73-10';
                }
            } else if (result.error_code === 401) {
                errorMessage = '❌ Помилка авторизації Telegram Bot. Зверніться до адміністратора сайту або зателефонуйте: +38 (097) 609-73-10';
            } else if (result.description) {
                errorMessage = `❌ Помилка: ${result.description}. Зателефонуйте напряму: +38 (097) 609-73-10`;
            } else {
                errorMessage = '❌ Не вдалося відправити заявку через технічні проблеми. Зателефонуйте прямо зараз: +38 (097) 609-73-10';
            }
            
            showNotification(errorMessage, 'error', 10000);
        }
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        
        let errorMessage = '❌ Помилка відправки';
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            errorMessage = '❌ Помилка мережі. Перевірте підключення до інтернету або спробуйте пізніше. Зателефонуйте: +38 (097) 609-73-10';
        } else if (error.message.includes('CORS')) {
            errorMessage = '❌ Помилка безпеки браузера. Зателефонуйте напряму: +38 (097) 609-73-10';
        } else if (error.message.includes('timeout')) {
            errorMessage = '❌ Перевищено час очікування відповіді. Спробуйте ще раз або зателефонуйте: +38 (097) 609-73-10';
        } else {
            errorMessage = `❌ Неочікувана помилка: ${error.message}. Зателефонуйте напряму: +38 (097) 609-73-10`;
        }
        
        showNotification(errorMessage, 'error', 12000);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .notification-icon {
            font-weight: bold;
            font-size: 1.2rem;
        }
        .notification-message {
            flex: 1;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
            margin-left: 0.5rem;
        }
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .advantage, .price-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    // Set initial styles for animated elements
    const elements = document.querySelectorAll('.service-card, .advantage, .price-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Initial check
    animateOnScroll();
});

// Listen for scroll events
window.addEventListener('scroll', animateOnScroll);

// Click to call functionality
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function(e) {
        // On desktop, show notification instead of trying to make a call
        if (!/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            e.preventDefault();
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            showNotification(`Телефон для дзвінка: ${phoneNumber}`, 'info');
        }
    });
});

// Service card click handlers for better UX
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        // Scroll to contact form
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = contactSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Pre-select the service in the form
            const serviceSelect = document.querySelector('.contact-form select');
            const serviceTitle = this.querySelector('h3').textContent;
            
            if (serviceSelect) {
                const options = serviceSelect.querySelectorAll('option');
                options.forEach(option => {
                    if (serviceTitle.includes('Windows') && option.value === 'windows') {
                        option.selected = true;
                    } else if (serviceTitle.includes('програм') && option.value === 'programs') {
                        option.selected = true;
                    } else if (serviceTitle.includes('Ремонт') && option.value === 'repair') {
                        option.selected = true;
                    } else if (serviceTitle.includes('вірус') && option.value === 'virus') {
                        option.selected = true;
                    } else if (serviceTitle.includes('Мережі') && option.value === 'network') {
                        option.selected = true;
                    }
                });
            }
        }
    });
});

// Lazy loading for performance
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== PUSH-УВЕДОМЛЕНИЯ =====

// Инициализация push-уведомлений
let isNotificationsEnabled = false;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    await initializePushNotifications();
});

// Инициализация push-уведомлений
async function initializePushNotifications() {
    // Проверяем поддержку
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('Push-уведомления не поддерживаются');
        return;
    }

    try {
        // Регистрируем Service Worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker зарегистрирован');

        // Запрашиваем разрешение на уведомления
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            await subscribeToPushNotifications(registration);
        }
    } catch (error) {
        console.error('Ошибка инициализации push-уведомлений:', error);
    }
}

// Подписка на push-уведомления
async function subscribeToPushNotifications(registration) {
    try {
        // Получаем публичный ключ VAPID
        const response = await fetch('/.netlify/functions/push-notifications/vapid-public-key');
        const { publicKey } = await response.json();

        // Создаем подписку
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
        });

        // Отправляем подписку на сервер
        await fetch('/.netlify/functions/push-notifications/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        });

        isNotificationsEnabled = true;
        console.log('✅ Push-уведомления включены');
    } catch (error) {
        console.error('Ошибка подписки на push-уведомления:', error);
    }
}

// Отправка push-уведомления
async function sendPushNotification(data) {
    if (!isNotificationsEnabled) {
        console.log('Push-уведомления отключены');
        return;
    }

    try {
        const response = await fetch('/.netlify/functions/push-notifications/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log('📱 Push-уведомление отправлено:', result);
    } catch (error) {
        console.error('Ошибка отправки push-уведомления:', error);
    }
}

// Вспомогательная функция для конвертации VAPID ключа
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}