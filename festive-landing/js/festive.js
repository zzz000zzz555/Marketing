// Canvas snow particles
const canvas = document.getElementById("fxCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener("resize", resize);

if (!reduced) {
  for (let i = 0; i < 80; i++) {
    particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: 1 + Math.random() * 2.5, s: 0.3 + Math.random() * 0.8, a: 0.4 + Math.random() * 0.6 });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.globalAlpha = p.a;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.s;
      p.x += Math.sin(p.y * 0.01) * 0.3;
      if (p.y > canvas.height) { p.y = -5; p.x = Math.random() * canvas.width; }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
}

// Music button
const btn = document.getElementById("musicBtn");
const audio = document.getElementById("ambientAudio");
let playing = false;
btn.addEventListener("click", () => {
  if (playing) {
    audio.pause();
    btn.classList.remove("playing");
    btn.querySelector("i").textContent = "♪";
  } else {
    audio.volume = 0.4;
    audio.play().catch(() => {});
    btn.classList.add("playing");
    btn.querySelector("i").textContent = "❚❚";
  }
  playing = !playing;
});