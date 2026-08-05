document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("sliderTrack");
  const slider = document.getElementById("usecaseSlider");
  if (!track || !slider) return;

  const scrollAmount = 200;
  slider.querySelector(".slider-arrow--prev").addEventListener("click", () => {
    track.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
  slider.querySelector(".slider-arrow--next").addEventListener("click", () => {
    track.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });
});
