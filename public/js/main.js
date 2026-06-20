/* The Trendz Beauty Salon — front-end interactions.
   Vanilla JS, no dependencies. Honors prefers-reduced-motion. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('primary-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---- Generic slider (hero + testimonials) ---- */
  document.querySelectorAll('[data-slider]').forEach(function (root) {
    var slides = Array.prototype.filter.call(root.children, function (c) {
      return c.classList.contains('hero__slide') || c.classList.contains('testi');
    });
    if (slides.length < 2) return;

    var index = 0;
    var playing = !reduceMotion;
    var interval = parseInt(root.getAttribute('data-autoplay'), 10) || 6000;
    var timer = null;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var active = n === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
      });
    }
    function next() { show(index + 1); }
    function prev() { show(index - 1); }
    function start() { if (playing && !timer) timer = setInterval(next, interval); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    var scope = root.parentElement;
    (scope.querySelectorAll('[data-slider-next]')).forEach(function (b) { b.addEventListener('click', function () { next(); }); });
    (scope.querySelectorAll('[data-slider-prev]')).forEach(function (b) { b.addEventListener('click', function () { prev(); }); });
    (scope.querySelectorAll('[data-slider-pause]')).forEach(function (btn) {
      // reflect initial state for reduced-motion users
      btn.setAttribute('aria-pressed', playing ? 'false' : 'true');
      btn.innerHTML = playing ? '&#10073;&#10073;' : '&#9658;';
      btn.addEventListener('click', function () {
        playing = !playing;
        btn.setAttribute('aria-pressed', playing ? 'false' : 'true');
        btn.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
        btn.innerHTML = playing ? '&#10073;&#10073;' : '&#9658;';
        if (playing) start(); else stop();
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      if (panel) panel.hidden = expanded;
    });
  });

  /* ---- Pre-select service from ?service= on contact page ---- */
  var params = new URLSearchParams(window.location.search);
  var svc = params.get('service');
  if (svc) {
    var field = document.getElementById('f-service');
    if (field) {
      if (field.tagName === 'SELECT') {
        Array.prototype.forEach.call(field.options, function (o) { if (o.value === svc) o.selected = true; });
      } else {
        field.value = svc;
      }
    }
  }

  /* ---- Header shadow on scroll ---- */
  var header = document.getElementById('site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
