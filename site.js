(function () {
  // Enable reveal CSS that is gated behind ".js-on"
  document.documentElement.classList.add("js-on");

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Reveal-on-scroll
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReduced.matches) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Fallback if IntersectionObserver isn't supported
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, observer) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          observer.unobserve(e.target);
        }
      }
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  els.forEach((el) => io.observe(el));
})();
