// Site Health Check Script for pcmaster-khmelnytskyi.xyz
// Проверка доступности и основных функций сайта

class SiteHealthChecker {
    constructor() {
        this.domain = 'pcmaster-khmelnytskyi.xyz';
        this.checks = [];
        this.results = {
            total: 0,
            passed: 0,
            failed: 0,
            warnings: 0
        };
    }

    // Проверка SSL сертификата
    async checkSSL() {
        try {
            const response = await fetch(`https://${this.domain}`, {
                method: 'HEAD',
                mode: 'no-cors'
            });
            this.addResult('SSL Certificate', 'PASS', 'SSL работает корректно');
        } catch (error) {
            this.addResult('SSL Certificate', 'FAIL', `SSL ошибка: ${error.message}`);
        }
    }

    // Проверка доступности основных файлов
    async checkCriticalFiles() {
        const files = [
            '/robots.txt',
            '/sitemap.xml',
            '/manifest.json',
            '/css/style.css',
            '/js/script.js'
        ];

        for (const file of files) {
            try {
                const response = await fetch(`https://${this.domain}${file}`, {
                    method: 'HEAD',
                    mode: 'no-cors'
                });
                this.addResult(`File Check: ${file}`, 'PASS', 'Файл доступен');
            } catch (error) {
                this.addResult(`File Check: ${file}`, 'FAIL', `Файл недоступен: ${error.message}`);
            }
        }
    }

    // Проверка мета-тегов SEO
    checkSEOTags() {
        const title = document.querySelector('title');
        const metaDesc = document.querySelector('meta[name="description"]');
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        const structuredData = document.querySelector('script[type="application/ld+json"]');

        if (title && title.textContent.length > 10) {
            this.addResult('Title Tag', 'PASS', `Title: "${title.textContent}"`);
        } else {
            this.addResult('Title Tag', 'FAIL', 'Title отсутствует или слишком короткий');
        }

        if (metaDesc && metaDesc.content.length > 50) {
            this.addResult('Meta Description', 'PASS', `Length: ${metaDesc.content.length} chars`);
        } else {
            this.addResult('Meta Description', 'FAIL', 'Meta description отсутствует или слишком короткий');
        }

        if (canonicalLink) {
            this.addResult('Canonical URL', 'PASS', canonicalLink.href);
        } else {
            this.addResult('Canonical URL', 'WARNING', 'Canonical URL отсутствует');
        }

        if (structuredData) {
            this.addResult('Structured Data', 'PASS', 'Schema.org разметка найдена');
        } else {
            this.addResult('Structured Data', 'FAIL', 'Structured data отсутствует');
        }
    }

    // Проверка производительности
    checkPerformance() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            this.addResult('Network Info', 'INFO', 
                `Type: ${connection.effectiveType}, Speed: ${connection.downlink}Mbps`);
        }

        // Проверка времени загрузки
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        if (loadTime < 3000) {
            this.addResult('Page Load Time', 'PASS', `${loadTime}ms`);
        } else if (loadTime < 5000) {
            this.addResult('Page Load Time', 'WARNING', `${loadTime}ms (медленно)`);
        } else {
            this.addResult('Page Load Time', 'FAIL', `${loadTime}ms (очень медленно)`);
        }
    }

    // Проверка мобильной адаптивности
    checkMobileReadiness() {
        const viewport = document.querySelector('meta[name="viewport"]');
        const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (viewport) {
            this.addResult('Viewport Meta', 'PASS', viewport.content);
        } else {
            this.addResult('Viewport Meta', 'FAIL', 'Viewport meta отсутствует');
        }

        if (isMobileDevice) {
            this.addResult('Mobile Device', 'INFO', 'Просмотр с мобильного устройства');
        }
    }

    // Проверка форм и функциональности
    checkForms() {
        const contactForm = document.querySelector('.contact-form');
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        const socialLinks = document.querySelectorAll('.social-link');

        if (contactForm) {
            this.addResult('Contact Form', 'PASS', 'Форма обратной связи найдена');
        } else {
            this.addResult('Contact Form', 'WARNING', 'Форма обратной связи не найдена');
        }

        if (phoneLinks.length > 0) {
            this.addResult('Phone Links', 'PASS', `Найдено ${phoneLinks.length} телефонных ссылок`);
        } else {
            this.addResult('Phone Links', 'WARNING', 'Телефонные ссылки не найдены');
        }

        if (socialLinks.length > 0) {
            this.addResult('Social Links', 'PASS', `Найдено ${socialLinks.length} социальных ссылок`);
        } else {
            this.addResult('Social Links', 'WARNING', 'Социальные ссылки не найдены');
        }
    }

    // Добавление результата проверки
    addResult(test, status, message) {
        this.checks.push({
            test,
            status,
            message,
            timestamp: new Date().toISOString()
        });

        this.results.total++;
        switch (status) {
            case 'PASS':
                this.results.passed++;
                break;
            case 'FAIL':
                this.results.failed++;
                break;
            case 'WARNING':
                this.results.warnings++;
                break;
        }
    }

    // Запуск всех проверок
    async runAllChecks() {
        console.log('🔍 Начинаем проверку здоровья сайта...');
        
        // Синхронные проверки
        this.checkSEOTags();
        this.checkPerformance();
        this.checkMobileReadiness();
        this.checkForms();
        
        // Асинхронные проверки
        await this.checkSSL();
        await this.checkCriticalFiles();
        
        this.displayResults();
    }

    // Отображение результатов
    displayResults() {
        console.log('\n📊 РЕЗУЛЬТАТЫ ПРОВЕРКИ САЙТА:');
        console.log('='.repeat(50));
        console.log(`✅ Пройдено: ${this.results.passed}`);
        console.log(`❌ Ошибки: ${this.results.failed}`);
        console.log(`⚠️  Предупреждения: ${this.results.warnings}`);
        console.log(`📈 Общий счет: ${this.results.passed}/${this.results.total}`);
        
        const healthPercentage = Math.round((this.results.passed / this.results.total) * 100);
        console.log(`🎯 Здоровье сайта: ${healthPercentage}%`);
        
        console.log('\n📋 ДЕТАЛЬНЫЕ РЕЗУЛЬТАТЫ:');
        console.log('-'.repeat(50));
        
        this.checks.forEach(check => {
            const statusIcon = {
                'PASS': '✅',
                'FAIL': '❌',
                'WARNING': '⚠️',
                'INFO': 'ℹ️'
            }[check.status] || '❓';
            
            console.log(`${statusIcon} ${check.test}: ${check.message}`);
        });

        // Рекомендации
        if (this.results.failed > 0) {
            console.log('\n🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ:');
            this.checks.filter(c => c.status === 'FAIL').forEach(check => {
                console.log(`• ${check.test}: ${check.message}`);
            });
        }

        if (this.results.warnings > 0) {
            console.log('\n⚠️ РЕКОМЕНДАЦИИ К УЛУЧШЕНИЮ:');
            this.checks.filter(c => c.status === 'WARNING').forEach(check => {
                console.log(`• ${check.test}: ${check.message}`);
            });
        }

        // Отправка отчета (если необходимо)
        this.sendReport();
    }

    // Отправка отчета
    sendReport() {
        const report = {
            domain: this.domain,
            timestamp: new Date().toISOString(),
            results: this.results,
            checks: this.checks,
            healthScore: Math.round((this.results.passed / this.results.total) * 100)
        };

        // Сохранение в localStorage для анализа
        localStorage.setItem('siteHealthReport', JSON.stringify(report));
        
        console.log('\n💾 Отчет сохранен в localStorage');
        console.log('Для просмотра: localStorage.getItem("siteHealthReport")');
    }
}

// Автоматический запуск проверки при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    // Задержка для полной загрузки ресурсов
    setTimeout(async () => {
        const healthChecker = new SiteHealthChecker();
        await healthChecker.runAllChecks();
    }, 2000);
});

// Экспорт для ручного использования
window.SiteHealthChecker = SiteHealthChecker;