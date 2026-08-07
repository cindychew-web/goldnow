document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- use-case marquee (auto-scrolling, pauses on hover, arrows nudge) ----
  const usecaseSlider = document.getElementById("usecaseSlider");
  const marqueeTrack = document.getElementById("sliderTrack");
  if (usecaseSlider && marqueeTrack) {
    const viewport = marqueeTrack.parentElement;
    const originalCards = Array.from(marqueeTrack.children);
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      marqueeTrack.appendChild(clone);
    });

    let position = 0;
    let paused = prefersReducedMotion;
    const speed = 0.45;

    const setWidth = () => marqueeTrack.scrollWidth / 2;

    const frame = () => {
      if (!paused) {
        position += speed;
        const width = setWidth();
        if (width > 0 && position >= width) position -= width;
        marqueeTrack.style.transform = `translateX(-${position}px)`;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);

    viewport.addEventListener("mouseenter", () => { paused = true; });
    viewport.addEventListener("mouseleave", () => { paused = prefersReducedMotion; });
    viewport.addEventListener("touchstart", () => { paused = true; }, { passive: true });

    const cardStep = 226;
    const resumeAfterNudge = () => {
      paused = true;
      setTimeout(() => { paused = prefersReducedMotion; }, 2600);
    };
    usecaseSlider.querySelector(".slider-arrow--prev").addEventListener("click", () => {
      position -= cardStep;
      if (position < 0) position += setWidth();
      marqueeTrack.style.transform = `translateX(-${position}px)`;
      resumeAfterNudge();
    });
    usecaseSlider.querySelector(".slider-arrow--next").addEventListener("click", () => {
      position += cardStep;
      const width = setWidth();
      if (width > 0 && position >= width) position -= width;
      marqueeTrack.style.transform = `translateX(-${position}px)`;
      resumeAfterNudge();
    });
  }

  // ---- generic count-up helper ----
  const animateCount = (el, { duration = 1200 } = {}) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // ---- hero goal calculator ----
  const calcChips = document.querySelectorAll(".calc-chip");
  const calcCustomCost = document.getElementById("calcCustomCost");
  const calcMonths = document.getElementById("calcMonths");
  const calcMonthsLabel = document.getElementById("calcMonthsLabel");
  const calcGrams = document.getElementById("calcGrams");
  const calcMonthly = document.getElementById("calcMonthly");
  const calcProjection = document.getElementById("calcProjection");
  const calcProjectionLabel = document.getElementById("calcProjectionLabel");
  if (calcCustomCost && calcMonths && calcGrams && calcMonthly) {
    const GOLD_PRICE_PER_GRAM = 500; // indicative RM/g, shown live in the app
    const GOLD_AVG_RETURN_PA = 0.081; // matches the historical returns card — sample figure, replace before launch
    const formatMYR = (n) => "RM " + Math.round(n).toLocaleString();

    // future value of a monthly contribution stream, ordinary annuity
    const futureValue = (monthlyContribution, annualRate, months) => {
      const i = annualRate / 12;
      if (months <= 0) return 0;
      if (i === 0) return monthlyContribution * months;
      return monthlyContribution * ((Math.pow(1 + i, months) - 1) / i);
    };

    const update = () => {
      const cost = Math.max(parseFloat(calcCustomCost.value) || 0, 0);
      const months = parseInt(calcMonths.value, 10);
      const totalGrams = cost / GOLD_PRICE_PER_GRAM;
      const monthlyGrams = totalGrams / months;
      const monthlyMYR = cost / months;
      calcMonthsLabel.textContent = `${months} month${months === 1 ? "" : "s"}`;
      calcGrams.textContent = `~${totalGrams.toFixed(1)}g`;
      calcMonthly.textContent = `~${monthlyGrams.toFixed(2)}g / ${formatMYR(monthlyMYR)} per month`;

      if (calcProjection && calcProjectionLabel) {
        const projected = futureValue(monthlyMYR, GOLD_AVG_RETURN_PA, months);
        calcProjectionLabel.textContent = `Potential value in ${months} month${months === 1 ? "" : "s"}*`;
        calcProjection.textContent = formatMYR(projected);
      }
    };

    calcChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        calcCustomCost.value = chip.dataset.cost;
        calcChips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        update();
      });
    });
    calcCustomCost.addEventListener("input", () => {
      calcChips.forEach((c) => c.classList.remove("is-active"));
      update();
    });
    calcMonths.addEventListener("input", update);
    update();
  }

  // ---- stats count-up (triggered on scroll into view) ----
  const statsCountEls = document.querySelectorAll(".stats-count");
  if (statsCountEls.length) {
    // HTML holds the real final value as a no-JS/crawler fallback;
    // now that we know JS is running, zero it out to animate up on scroll.
    if (!prefersReducedMotion) {
      statsCountEls.forEach((el) => { el.textContent = "0"; });
    }
    if (!("IntersectionObserver" in window)) {
      statsCountEls.forEach((el) => animateCount(el, { duration: 1600 }));
    } else {
      const statsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target, { duration: 1600 });
              statsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      statsCountEls.forEach((el) => statsObserver.observe(el));
    }
  }

  // ---- 3-steps phone mockup switcher ----
  const stepsList = document.getElementById("stepsList");
  const phoneScreens = document.querySelectorAll(".phone-screen");
  if (stepsList && phoneScreens.length) {
    stepsList.querySelectorAll(".step-trigger").forEach((btn) => {
      btn.addEventListener("click", () => {
        stepsList.querySelectorAll(".step-trigger").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const step = btn.dataset.step;
        phoneScreens.forEach((screen) => {
          const active = screen.dataset.screen === step;
          screen.classList.toggle("is-active", active);
          screen.setAttribute("aria-hidden", active ? "false" : "true");
        });
      });
    });
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
