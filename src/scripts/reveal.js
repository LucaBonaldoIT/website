export function initReveal() {
  var year = document.getElementById('year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // Section entrance reveals; CSS only hides .reveal when html.js is set
  // and the user has no reduced-motion preference.
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var targets = document.querySelectorAll('.reveal');

  if (reduced.matches || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      el.classList.add('is-in');
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );

  targets.forEach(function (el) {
    io.observe(el);
  });
}
