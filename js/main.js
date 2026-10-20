(function () {
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- переключатель темы --- */
  document.querySelector('.theme').addEventListener('click', function () {
    var t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
  });

  /* --- индикатор прокрутки --- */
  var bar = document.querySelector('.progress');
  function onScroll() {
    var max = root.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- размеры блока, как в DevTools --- */
  var con = document.getElementById('con');
  var dim = document.getElementById('dim');
  function showSize() {
    var r = con.getBoundingClientRect();
    dim.textContent = Math.round(r.width) + ' × ' + Math.round(r.height);
  }
  if ('ResizeObserver' in window) new ResizeObserver(showSize).observe(con);
  showSize();

  /* --- отступы реагируют на курсор --- */
  var hero = document.querySelector('.hero');
  var bm = document.getElementById('bm');
  var fine = matchMedia('(pointer: fine)').matches;
  var ticking = false;
  if (fine && !reduce) {
    hero.addEventListener('pointermove', function (e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        bm.style.setProperty('--m', (16 + x * 28).toFixed(0) + 'px');
        bm.style.setProperty('--p', (16 + y * 28).toFixed(0) + 'px');
        ticking = false;
      });
    });
    hero.addEventListener('pointerleave', function () {
      bm.style.removeProperty('--m');
      bm.style.removeProperty('--p');
    });
  }

  /* --- бегущая строка: копия для бесшовного цикла --- */
  var track = document.querySelector('.track');
  track.innerHTML += track.innerHTML;

  /* --- появление блоков при прокрутке --- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.2 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* --- копирование почты --- */
  var toast = document.querySelector('.toast');
  var timer;
  document.getElementById('mail').addEventListener('click', function (e) {
    var text = this.dataset.copy;
    if (!navigator.clipboard) return; /* без буфера сработает mailto */
    e.preventDefault();
    navigator.clipboard.writeText(text).then(function () {
      toast.textContent = 'Почта скопирована';
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(function () { toast.classList.remove('show'); }, 2000);
    }, function () { location.href = 'mailto:' + text; });
  });
})();
