const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduced) {
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x*15}deg) rotateX(${-y*15}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
  document.querySelectorAll(".parallax-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.querySelector(".bg").style.transform = `translate(${x*-10}px, ${y*-10}px)`;
      card.querySelector(".text").style.transform = `translate(${x*5}px, ${y*5}px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.querySelector(".bg").style.transform = "";
      card.querySelector(".text").style.transform = "";
    });
  });
}