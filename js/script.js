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

// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
    botToken: '8256319983:AAGZKs_9Nqw2Kuep3HauUsSWpps5y7iGAcs',
    chatId: '542791657'
};

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
        `    🕐 <b>Час:</b> ${formattedTime}\n` +
        `    🌍 <b>Часовий пояс:</b> EET (UTC+2)\n\n` +
        
        `📊 <b>СИСТЕМНА ІНФОРМАЦІЯ</b>\n` +
        `    🎯 <b>Джерело:</b> Офіційний сайт\n` +
        `    📈 <b>Пріоритет:</b> Звичайний\n` +
        `    ⚡ <b>Статус:</b> Нова заявка\n\n` +
        
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
            chat_id: TELEGRAM_CONFIG.chatId,
            message: telegramMessage
        });
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: telegramMessage,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        console.log('Telegram API response:', result);
        
        if (response.ok && result.ok) {
            showNotification('✅ Дякуємо! Ваша заявка відправлена. Ми зв\'яжемося з вами найближчим часом.', 'success');
        } else {
            throw new Error(`Telegram API error: ${result.description || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        showNotification('❌ Помилка відправки. Будь ласка, зателефонуйте: +38 (097) 609-73-10', 'error');
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