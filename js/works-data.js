/* ============================================
   ДАННЫЕ РАБОТ (редактируйте здесь)
   ============================================
   Каждый объект — один проект.
   - featured: true — показывать на главной (рекомендуется 2–3 шт.)
   - screenshots — ссылки на картинки из папки screenshots репозитория на GitHub.
     Формат: https://raw.githubusercontent.com/<user>/<repo>/<ветка>/screenshots/<файл>
   ============================================ */

const worksData = [
  {
    id: 'foliage-landing',
    title: 'Листва — интернет-магазин комнатных растений',
    shortDesc: 'Адаптивный интернет-магазин комнатных растений.',
    fullDesc:
      'Учебный проект: адаптивный интернет-магазин комнатных растений на чистом HTML, CSS и JavaScript. Три страницы (главная, каталог, карточка товара) и выезжающая панель корзины.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    demoUrl: 'https://foliage-landing-page.netlify.app',
    repoUrl: 'https://github.com/shizee1/foliage-landing-page',
    color: '#8FBCC8',
    screenshots: [
      'https://github.com/shizee1/foliage-landing-page/blob/master/screenshots/home-desktop.png?raw=true',
      'https://github.com/shizee1/foliage-landing-page/blob/master/screenshots/catalog-desktop.png?raw=true',
      'https://github.com/shizee1/foliage-landing-page/blob/master/screenshots/product-desktop.png?raw=true'
    ],
    featured: true
  }
];

/* Вспомогательные функции */
const worksApi = {
  all() {
    return worksData;
  },
  featured() {
    return worksData.filter((w) => w.featured);
  },
  get(id) {
    return worksData.find((w) => w.id === id) || null;
  }
};