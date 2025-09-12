# Інструкція з переіндексації сайту в пошукових системах

Цей документ містить покрокову інструкцію для переіндексації вашого сайту в пошукових системах, щоб правильні заголовки та описи відображалися в результатах пошуку.

## 1. Перевірка правильності мета-тегів

Переконайтесь, що всі HTML-сторінки мають правильні заголовки та мета-описи:

- **Встановлення Windows Хмельницький**
- **Ремонт ноутбуків Хмельницький**
- **Ремонт комп’ютерів Хмельницький**
- **Комп’ютерний майстер Хмельницький**

## 2. Оновлення sitemap.xml

Файл sitemap.xml вже оновлено та містить всі важливі сторінки сайту.

## 3. Надсилання sitemap в пошукові системи

### Варіант 1: Автоматичне надсилання (рекомендовано)

1. Відкрийте термінал або командний рядок
2. Перейдіть до директорії проекту
3. Виконайте команду:
   ```
   node submit-sitemap.js
   ```

### Варіант 2: Ручне надсилання

#### Google Search Console:
1. Перейдіть до [Google Search Console](https://search.google.com/search-console)
2. Увійдіть у свій обліковий запис Google
3. Виберіть свій сайт: `pcmaster-khmelnytskyi.xyz`
4. Перейдіть до розділу "Індексування" → "Sitemap"
5. Надішліть запит на індексування файлу: `sitemap.xml`

#### Bing Webmaster Tools:
1. Перейдіть до [Bing Webmaster Tools](https://www.bing.com/toolbox/webmaster)
2. Увійдіть у свій обліковий запис Microsoft
3. Виберіть свій сайт
4. Перейдіть до розділу "Configure" → "Sitemaps"
5. Додайте та надішліть запит на індексування файлу: `sitemap.xml`

## 4. Запит на індивідуальну переіндексацію URL

Для швидкого оновлення конкретних сторінок:

### Google Search Console:
1. Перейдіть до "URL Inspection"
2. Введіть URL сторінки, яку потрібно переіндексувати
3. Натисніть "Request Indexing"

### Bing Webmaster Tools:
1. Перейдіть до "Configure" → "Submit URLs"
2. Введіть URL сторінки
3. Натисніть "Submit"

## 5. Важливі URL для переіндексації

- https://pcmaster-khmelnytskyi.xyz/
- https://pcmaster-khmelnytskyi.xyz/ustanovka-windows-khmelnitsky.html
- https://pcmaster-khmelnytskyi.xyz/remont-noutbukov-khmelnitsky.html
- https://pcmaster-khmelnytskyi.xyz/remont-kompyuterov-khmelnitsky.html
- https://pcmaster-khmelnytskyi.xyz/nalashtuyvannya-internetu-khmelnitsky.html
- https://pcmaster-khmelnytskyi.xyz/nalashtuyvannya-wifi-khmelnitsky.html
- https://pcmaster-khmelnytskyi.xyz/chistka-noutbuka-vid-pilu-khmelnitsky.html
- https://pcmaster-khmelnytskyi.xyz/nalashtuyvannya-printera-khmelnitsky.html
- https://pcmaster-khmelnytskyi.xyz/nalashtuyvannya-videokamer-khmelnitsky.html

## 6. Очікувані результати

Після завершення переіндексації (може зайняти від кількох годин до кількох тижнів):
- Заголовки сторінок у результатах пошуку Google будуть відображатися правильно
- Мета-описи сторінок будуть відповідати вимогам
- Сайт отримає кращу видимість у пошукових системах

## 7. Додаткові рекомендації

1. Регулярно оновлюйте контент сайту
2. Перевіряйте працездатність всіх посилань
3. Слідкуйте за швидкістю завантаження сторінок
4. Використовуйте семантичну розмітку для покращення індексації