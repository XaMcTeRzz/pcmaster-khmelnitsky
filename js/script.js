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

// Contact Form Handling with Telegram Bot
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const phone = this.querySelector('input[type="tel"]').value;
        const service = this.querySelector('select').value;
        const message = this.querySelector('textarea').value;
        
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
}

// Telegram Bot Configuration
const TELEGRAM_CONFIG = {
    botToken: '8256319983:AAGZKs_9Nqw2Kuep3HauUsSWpps5y7iGAcs',
    chatId: '542791657'
};

// Send message to Telegram
async function sendToTelegram(name, phone, service, message) {
    const serviceNames = {
        'windows': 'Перестановка Windows',
        'programs': 'Налаштування програм',
        'repair': 'Ремонт комп\'ютера',
        'virus': 'Видалення вірусів',
        'network': 'Налаштування мережі',
        'other': 'Інше'
    };
    
    const serviceName = serviceNames[service] || 'Не вказано';
    
    const telegramMessage = `🔧 *Нова заявка PC-Master Хмельницький*\n\n` +
        `👤 *Ім\'я:* ${name}\n` +
        `📞 *Телефон:* ${phone}\n` +
        `🛠 *Послуга:* ${serviceName}\n` +
        `📝 *Опис:* ${message || 'Не вказано'}\n\n` +
        `🌐 *Джерело:* Сайт PC-Master`;
    
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
    
    try {
        showNotification('Відправляємо заявку...', 'info');
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: telegramMessage,
                parse_mode: 'Markdown'
            })
        });
        
        if (response.ok) {
            showNotification('✅ Дякуємо! Ваша заявка відправлена. Ми зв\'яжемося з вами найближчим часом.', 'success');
        } else {
            throw new Error('Помилка відправки');
        }
    } catch (error) {
        console.error('Error sending to Telegram:', error);
        showNotification('❌ Помилка відправки. Будь ласка, зателефонуйте: +38 (097) 609-73-10', 'error');
    }
}

// Phone number validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
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