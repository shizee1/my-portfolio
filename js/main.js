(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- плавный вход страницы ---------- */
  window.addEventListener('load', function () {
    root.classList.add('loaded');
    document.body.classList.add('loaded');
  });

  /* ---------- переключатель темы ---------- */
  var themeBtn = document.querySelector('.theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var t = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = t;
      try { localStorage.setItem('theme', t); } catch (e) {}
    });
  }

  /* ---------- индикатор прокрутки ---------- */
  var bar = document.querySelector('.progress');
  function onScroll() {
    var max = root.scrollHeight - innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- размеры content-блока (как в DevTools) ---------- */
  var con = document.getElementById('con');
  var dim = document.getElementById('dim');
  if (con && dim && 'ResizeObserver' in window) {
    function showSize() {
      var r = con.getBoundingClientRect();
      dim.textContent = Math.round(r.width) + ' × ' + Math.round(r.height);
    }
    new ResizeObserver(showSize).observe(con);
    showSize();
  }

  /* ---------- бегущая строка: бесшовная петля ---------- */
  var track = document.querySelector('.track');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  /* ---------- появление блоков при прокрутке ---------- */
  function initReveal(selector) {
    var items = document.querySelectorAll(selector);
    if (!items.length) return;

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.18 });

      items.forEach(function (el) { io.observe(el); });
    } else {
      items.forEach(function (el) { el.classList.add('in'); });
    }
  }

  initReveal('.reveal');

  /* ---------- копирование почты ---------- */
  var toast = document.querySelector('.toast');
  var timer;
  var mailBtn = document.getElementById('mail');
  if (mailBtn && toast) {
    mailBtn.addEventListener('click', function (e) {
      var text = this.dataset.copy;
      if (!navigator.clipboard) return;

      e.preventDefault();
      navigator.clipboard.writeText(text).then(
        function () {
          toast.textContent = 'Почта скопирована';
          toast.classList.add('show');
          clearTimeout(timer);
          timer = setTimeout(function () { toast.classList.remove('show'); }, 2000);
        },
        function () { location.href = 'mailto:' + text; }
      );
    });
  }

  /* ---------- рендер работ из worksData ---------- */
  function renderWorks(containerId, works) {
    var container = document.getElementById(containerId);
    if (!container || !worksApi) return;

    container.innerHTML = '';

    works.forEach(function (w) {
      var article = document.createElement('article');
      article.className = 'work reveal';
      article.innerHTML =
        '<div class="thumb" style="--c:' + (w.color || 'var(--content)') + '" aria-hidden="true"><i></i><i></i><i></i><i></i></div>' +
        '<div>' +
        '  <h3>' + escapeHtml(w.title) + '</h3>' +
        '  <p>' + escapeHtml(w.shortDesc) + '</p>' +
        '  <div class="tags">' + w.tags.map(function (t) { return '<span>' + escapeHtml(t) + '</span>'; }).join('') + '</div>' +
        '</div>' +
        '<a class="go" href="work.html?id=' + escapeHtml(w.id) + '">Подробнее &rarr;</a>';
      container.appendChild(article);
    });

    initReveal('#' + containerId + ' .reveal');
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /* главная: только избранные */
  if (document.getElementById('worksList')) {
    renderWorks('worksList', worksApi.featured());
  }

  /* страница "все работы": весь список */
  if (document.getElementById('worksGrid')) {
    renderWorks('worksGrid', worksApi.all());
  }
})();