document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- use-case slider ----
  const track = document.getElementById("sliderTrack");
  const slider = document.getElementById("usecaseSlider");
  if (slider && track) {
    const scrollAmount = 210;
    slider.querySelector(".slider-arrow--prev").addEventListener("click", () => {
      track.scrollBy({ left: -scrollAmount, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
    slider.querySelector(".slider-arrow--next").addEventListener("click", () => {
      track.scrollBy({ left: scrollAmount, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  // ---- ledger balance count-up ----
  const gramsEl = document.getElementById("totalGrams");
  const potsEl = document.getElementById("activePots");
  if (gramsEl && potsEl) {
    const targetGrams = 1286.4;
    const targetPots = 5;
    if (prefersReducedMotion) {
      gramsEl.textContent = targetGrams.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      potsEl.textContent = targetPots;
    } else {
      const duration = 1100;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        gramsEl.textContent = (targetGrams * eased).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        potsEl.textContent = Math.round(targetPots * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  // ---- reveal-on-scroll ----
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach((el) => observer.observe(el));
    }
  }
});
