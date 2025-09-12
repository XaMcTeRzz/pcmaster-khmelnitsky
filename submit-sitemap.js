/**
 * Скрипт для отправки sitemap в поисковые системы
 * 
 * Этот скрипт помогает уведомить поисковые системы о наличии нового sitemap
 * для ускорения индексации сайта.
 */

// URL вашего sitemap
const sitemapUrl = 'https://pcmaster-khmelnytskyi.xyz/sitemap.xml';

// URL поисковых систем для уведомления
const searchEngines = [
  {
    name: 'Google',
    pingUrl: `https://www.google.com/ping?sitemap=${sitemapUrl}`
  },
  {
    name: 'Bing',
    pingUrl: `https://www.bing.com/ping?sitemap=${sitemapUrl}`
  }
];

/**
 * Функция для отправки уведомления поисковой системе
 * @param {Object} engine - Объект с информацией о поисковой системе
 */
async function notifySearchEngine(engine) {
  try {
    console.log(`Отправка уведомления в ${engine.name}...`);
    
    const response = await fetch(engine.pingUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PC-Master Sitemap Notifier/1.0)'
      }
    });
    
    if (response.ok) {
      console.log(`✅ Успешно уведомлен ${engine.name}`);
    } else {
      console.log(`❌ Ошибка при уведомлении ${engine.name}: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ Ошибка при уведомлении ${engine.name}: ${error.message}`);
  }
}

/**
 * Основная функция для уведомления всех поисковых систем
 */
async function submitSitemap() {
  console.log('Начинаем уведомление поисковых систем о новом sitemap...');
  console.log(`Sitemap URL: ${sitemapUrl}\n`);
  
  // Уведомляем каждую поисковую систему
  for (const engine of searchEngines) {
    await notifySearchEngine(engine);
  }
  
  console.log('\nПроцесс уведомления завершен.');
  console.log('Обратите внимание, что индексация может занять некоторое время.');
}

// Запускаем скрипт, если он используется напрямую
if (typeof window === 'undefined' && require.main === module) {
  submitSitemap();
}

// Экспортируем функции для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { submitSitemap, notifySearchEngine };
}