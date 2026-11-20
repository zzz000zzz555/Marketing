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

// Music control
const btn = document.getElementById("musicBtn");
const audio = document.getElementById("ambientAudio");
const control = document.getElementById("musicControl");
const volume = document.getElementById("musicVolume");
const icon = btn.querySelector("i");

try {
  const savedVolume = Number(localStorage.getItem("nordico_festive_volume"));
  if (Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1) {
    audio.volume = savedVolume;
    volume.value = savedVolume;
  } else {
    audio.volume = 0.4;
  }
} catch (e) {
  audio.volume = 0.4;
}

function syncMusicUI() {
  const playing = !audio.paused;
  control.classList.toggle("playing", playing);
  btn.classList.toggle("playing", playing);
  btn.setAttribute("aria-pressed", String(playing));
  btn.setAttribute("aria-label", playing ? "Pausar música ambiental" : "Reproducir música ambiental");
  icon.textContent = playing ? "❚❚" : "♪";
}

btn.addEventListener("click", async () => {
  if (!audio.paused) {
    audio.pause();
    return;
  }
  try {
    await audio.play();
  } catch (e) {
    btn.setAttribute("aria-label", "Música no disponible en este navegador");
    control.classList.remove("playing");
  }
});

audio.addEventListener("play", syncMusicUI);
audio.addEventListener("pause", syncMusicUI);
audio.addEventListener("error", () => {
  btn.disabled = true;
  btn.setAttribute("aria-label", "Música no disponible");
  control.classList.remove("playing");
});

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
  try { localStorage.setItem("nordico_festive_volume", volume.value); } catch (e) {}
});

syncMusicUI();