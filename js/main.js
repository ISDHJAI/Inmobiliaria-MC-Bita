/* ==========================================================
   MC INMOBILIARIA — Modelo Bita · Privada Sotavento
   Interacciones y animaciones
   ========================================================== */
(function () {
  'use strict';

  /* ---------- Configuración WhatsApp ---------- */
  var WA_NUMBER = '524444119732';
  var WA_MESSAGE = 'Hola MC. Inmobiliaria me gustaria agendar una cita para conocer la privada Sotavento modelo Bita';
  var WA_URL = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_MESSAGE);

  document.querySelectorAll('.wa-link').forEach(function (a) {
    a.href = WA_URL;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Galerías: generación de slides ---------- */
  var GALLERIES = {
    galeriaCarousel: { dir: 'images/galeria/', from: 38, to: 64, alt: 'Modelo Bita — foto ' },
    amenidadesCarousel: { dir: 'images/amenidades/', from: 25, to: 37, alt: 'Amenidades Sotavento — foto ' }
  };

  Object.keys(GALLERIES).forEach(function (id) {
    var cfg = GALLERIES[id];
    var wrap = document.getElementById(id);
    if (!wrap) return;
    var frag = document.createDocumentFragment();
    for (var i = cfg.from; i <= cfg.to; i++) {
      var slide = document.createElement('div');
      slide.className = 'slide';
      var img = document.createElement('img');
      img.src = cfg.dir + i + '.jpg';
      img.alt = cfg.alt + (i - cfg.from + 1);
      img.loading = 'lazy';
      img.decoding = 'async';
      slide.appendChild(img);
      frag.appendChild(slide);
    }
    wrap.appendChild(frag);
  });

  /* ---------- Carrusel: contador, flechas y slide activo ---------- */
  function setupCarousel(id, countId) {
    var el = document.getElementById(id);
    var count = document.getElementById(countId);
    if (!el) return;
    var slides = Array.prototype.slice.call(el.children);
    var total = slides.length;

    function activeIndex() {
      var center = el.scrollLeft + el.clientWidth / 2;
      var best = 0, bestDist = Infinity;
      slides.forEach(function (s, i) {
        var mid = s.offsetLeft + s.offsetWidth / 2;
        var d = Math.abs(mid - center);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      return best;
    }
    function update() {
      var idx = activeIndex();
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      if (count) count.textContent = (idx + 1) + ' / ' + total;
    }
    var ticking = false;
    el.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () { update(); ticking = false; });
      }
    }, { passive: true });
    update();

    el._goto = function (dir) {
      var idx = Math.min(total - 1, Math.max(0, activeIndex() + dir));
      var s = slides[idx];
      el.scrollTo({ left: s.offsetLeft - (el.clientWidth - s.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
  }
  setupCarousel('galeriaCarousel', 'galeriaCount');
  setupCarousel('amenidadesCarousel', 'amenidadesCount');

  document.querySelectorAll('.c-arrow').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.dataset.target);
      if (el && el._goto) el._goto(parseInt(btn.dataset.dir, 10));
    });
  });

  /* ---------- Reveal con stagger ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var lastTime = 0, chain = 0;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var now = performance.now();
      chain = (now - lastTime < 140) ? chain + 1 : 0;
      lastTime = now;
      e.target.style.setProperty('--rd', (chain * 0.09) + 's');
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
  revealEls.forEach(function (el) { io.observe(el); });

  /* ---------- Contadores animados ---------- */
  function animateCount(el) {
    var to = parseFloat(el.dataset.to);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = to.toFixed(decimals) + suffix; return; }
    var dur = 1400, start = null;
    function step(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / dur);
      var eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (to * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.count').forEach(function (el) { cio.observe(el); });

  /* ---------- Header sólido + barra de progreso + parallax ---------- */
  var topbar = document.getElementById('topbar');
  var progress = document.getElementById('progress');
  var heroImg = document.getElementById('heroImg');
  var raf = false;

  function onScroll() {
    var y = window.scrollY;
    topbar.classList.toggle('solid', y > 40);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (heroImg && !reduceMotion && y < window.innerHeight) {
      heroImg.style.transform = 'scale(1.02) translateY(' + y * 0.25 + 'px)';
    }
    raf = false;
  }
  window.addEventListener('scroll', function () {
    if (!raf) { raf = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- Lightbox con navegación y swipe ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCounter = document.getElementById('lbCounter');
  var lbGroup = [], lbIndex = 0;

  function openLightbox(group, index) {
    lbGroup = group; lbIndex = index;
    renderLb();
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function renderLb() {
    lbImg.src = lbGroup[lbIndex];
    lbCounter.textContent = lbGroup.length > 1 ? (lbIndex + 1) + ' / ' + lbGroup.length : '';
  }
  function closeLightbox() {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  function lbNav(dir) {
    lbIndex = (lbIndex + dir + lbGroup.length) % lbGroup.length;
    renderLb();
  }

  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', function (e) { e.stopPropagation(); lbNav(-1); });
  document.getElementById('lbNext').addEventListener('click', function (e) { e.stopPropagation(); lbNav(1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
  });

  var touchX = null;
  lightbox.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 46) lbNav(dx > 0 ? -1 : 1);
    touchX = null;
  }, { passive: true });

  // Fotos de carruseles → lightbox por grupo
  Object.keys(GALLERIES).forEach(function (id) {
    var wrap = document.getElementById(id);
    if (!wrap) return;
    var srcs = Array.prototype.map.call(wrap.querySelectorAll('img'), function (i) { return i.src; });
    wrap.addEventListener('click', function (e) {
      var slide = e.target.closest('.slide');
      if (!slide) return;
      var idx = Array.prototype.indexOf.call(wrap.children, slide);
      openLightbox(srcs, idx);
    });
  });

  // Planos → lightbox individual
  document.querySelectorAll('[data-zoom]').forEach(function (img) {
    img.addEventListener('click', function () { openLightbox([img.src], 0); });
  });

  /* ---------- Burbuja del botón flotante ---------- */
  var bubble = document.getElementById('fabBubble');
  var bubbleClosed = false;
  setTimeout(function () { if (!bubbleClosed) bubble.classList.add('show'); }, 1800);
  document.getElementById('fabBubbleClose').addEventListener('click', function (e) {
    e.preventDefault(); e.stopPropagation();
    bubbleClosed = true;
    bubble.classList.remove('show');
  });
  // Vuelve a aparecer al llegar a la galería si no la cerraron manualmente
  var galeriaSec = document.getElementById('galeria');
  if (galeriaSec) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !bubbleClosed) bubble.classList.add('show');
      });
    }, { threshold: 0.2 });
    bio.observe(galeriaSec);
  }

  /* ---------- Video: pausa al salir de pantalla ---------- */
  var reel = document.getElementById('reel');
  if (reel) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting && !reel.paused) reel.pause();
      });
    }, { threshold: 0.15 });
    vio.observe(reel);
  }
})();
