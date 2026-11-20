// Toggle progress simulation
const fill = document.querySelector(".progress-bar .fill");
if (fill) {
  let w = 60;
  setInterval(() => { w = w >= 100 ? 0 : w + 5; fill.style.width = w + "%"; }, 800);
}