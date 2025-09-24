const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Установка размера viewport
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2 // Для лучшего качества (ретина)
  });

  // Загрузка локального HTML
  const htmlPath = path.join('file://', __dirname, 'og-generator.html');
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });
  
  // Создание папки images, если её нет
  const fs = require('fs');
  const dir = './images';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  
  // Сохранение скриншота
  await page.screenshot({
    path: './images/og-image.jpg', 
    type: 'jpeg',
    quality: 90,
    fullPage: false
  });

  await browser.close();
  console.log('OG изображение успешно создано!');
})();
