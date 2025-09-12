/**
 * Скрипт для проверки правильности мета-тегов на HTML-страницах
 * 
 * Этот скрипт проверяет, соответствуют ли заголовки и мета-описания 
 * требованиям для отображения в поисковых системах.
 */

const fs = require('fs');
const path = require('path');

// Требуемые заголовки и описания
const requiredMetaTags = [
  {
    file: 'ustanovka-windows-khmelnitsky.html',
    title: 'Встановлення Windows Хмельницький',
    description: 'Професійне встановлення Windows 10/11 в Хмельницькому'
  },
  {
    file: 'remont-noutbukov-khmelnitsky.html',
    title: 'Ремонт ноутбуків Хмельницький',
    description: 'Професійний ремонт ноутбуків HP, Lenovo, Dell, Acer, Asus в Хмельницькому'
  },
  {
    file: 'remont-kompyuterov-khmelnitsky.html',
    title: 'Ремонт комп’ютерів Хмельницький',
    description: 'Професійний ремонт компʼютерів у Хмельницькому'
  },
  {
    file: 'index.html',
    title: 'Комп’ютерний майстер Хмельницький',
    description: 'Професіональне налаштування програм та ремонт ПК в Хмельницькому'
  }
];

/**
 * Функция для извлечения мета-тегов из HTML-файла
 * @param {string} filePath - Путь к HTML-файлу
 * @returns {Object} Объект с заголовком и описанием
 */
function extractMetaTags(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Извлекаем заголовок
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';
    
    // Извлекаем описание
    const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    const description = descMatch ? descMatch[1] : '';
    
    return { title, description };
  } catch (error) {
    console.error(`Ошибка при чтении файла ${filePath}:`, error.message);
    return { title: '', description: '' };
  }
}

/**
 * Функция для проверки соответствия мета-тегов требованиям
 * @param {Object} required - Требуемые значения
 * @param {Object} actual - Фактические значения
 * @returns {Object} Результат проверки
 */
function checkMetaTags(required, actual) {
  const titleCheck = actual.title.includes(required.title);
  const descCheck = actual.description.includes(required.description);
  
  return {
    title: {
      required: required.title,
      actual: actual.title,
      status: titleCheck ? '✅ OK' : '❌ ОШИБКА'
    },
    description: {
      required: required.description,
      actual: actual.description,
      status: descCheck ? '✅ OK' : '❌ ОШИБКА'
    }
  };
}

/**
 * Основная функция для проверки всех файлов
 */
function checkAllMetaTags() {
  console.log('Проверка мета-тегов на HTML-страницах...\n');
  
  let allChecksPassed = true;
  
  for (const item of requiredMetaTags) {
    const filePath = path.join(__dirname, item.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Файл не найден: ${item.file}\n`);
      allChecksPassed = false;
      continue;
    }
    
    const actualMeta = extractMetaTags(filePath);
    const result = checkMetaTags(item, actualMeta);
    
    console.log(`Файл: ${item.file}`);
    console.log(`Заголовок: ${result.title.status}`);
    console.log(`  Требуется: ${result.title.required}`);
    console.log(`  Фактически: ${result.title.actual}`);
    console.log(`Описание: ${result.description.status}`);
    console.log(`  Требуется: ${result.description.required}`);
    console.log(`  Фактически: ${result.description.actual}`);
    console.log('---');
    
    if (result.title.status.includes('ОШИБКА') || result.description.status.includes('ОШИБКА')) {
      allChecksPassed = false;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  if (allChecksPassed) {
    console.log('✅ Все мета-теги соответствуют требованиям!');
    console.log('Теперь необходимо отправить сайт на переиндексацию в поисковые системы.');
  } else {
    console.log('❌ Найдены ошибки в мета-тегах.');
    console.log('Исправьте ошибки и повторите проверку.');
  }
  console.log('='.repeat(50));
}

// Запускаем проверку, если скрипт используется напрямую
if (require.main === module) {
  checkAllMetaTags();
}

module.exports = { extractMetaTags, checkMetaTags, checkAllMetaTags };