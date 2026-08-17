/* Scroll-reveal for [data-reveal] elements. Degrades to "always visible"
   where IntersectionObserver is missing, so content is never hidden by a
   script that failed to run. */
(function () {
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  var show = function (el) { el.classList.add('in'); };

  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(els, show);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });

  Array.prototype.forEach.call(els, function (el, i) {
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(el);
  });
})();
