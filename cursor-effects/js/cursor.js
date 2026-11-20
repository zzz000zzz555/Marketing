// Cursor effects system
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const dot = document.getElementById("cursorDot");
const ring = document.getElementById("cursorRing");
const spotlight = document.getElementById("cursorSpotlight");
const label = document.getElementById("cursorLabel");
const canvas = document.getElementById("trailCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

let mx = -100, my = -100;
let rx = -100, ry = -100;
let sx = -300, sy = -300;
let lastParticle = 0;

if (fine && !reduced) {
  window.addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    const target = e.target;
    const ct = target?.getAttribute?.("data-cursor-text");
    if (ct) { label.textContent = ct; label.classList.add("show"); }
    else label.classList.remove("show");
    // morph state
    ring.classList.remove("morph-link","morph-img","morph-btn","morph-text");
    if (target?.tagName === "A" || target?.tagName === "BUTTON") ring.classList.add("morph-link");
    else if (target?.tagName === "IMG") ring.classList.add("morph-img");
  });
  window.addEventListener("pointerdown", () => ring.classList.add("clicking"));
  window.addEventListener("pointerup", () => ring.classList.remove("clicking"));

  // Magnetic
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width/2, cy = r.top + r.height/2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 100) {
        const f = 0.3;
        el.style.transform = `translate3d(${dx*f}px, ${dy*f}px, 0)`;
      }
    });
    el.addEventListener("pointerleave", () => {
      el.style.transition = "transform 400ms cubic-bezier(0.25,0.1,0.25,1)";
      el.style.transform = "translate3d(0,0,0)";
      setTimeout(() => { el.style.transition = ""; }, 400);
    });
  });

  // Ripple
  document.querySelectorAll(".ripple-surface").forEach((el) => {
    el.addEventListener("pointerenter", (e) => {
      const r = el.getBoundingClientRect();
      const ripple = document.createElement("div");
      ripple.className = "ripple";
      const size = Math.hypot(r.width, r.height) * 2;
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - r.left - size/2) + "px";
      ripple.style.top = (e.clientY - r.top - size/2) + "px";
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    });
  });

  // Particle trail canvas
  if (canvas && ctx) {
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener("resize", resize);
    const particles = [];
    function spawnParticle(x, y) {
      particles.push({ x, y, life: 1, size: 4 + Math.random()*2, vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2 });
    }
    function loop() {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      // spotlight follow
      sx += (mx - sx) * 0.1;
      sy += (my - sy) * 0.1;
      spotlight.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      // dot exact
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      // ring lerp
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      // label offset
      label.style.transform = `translate3d(${mx+18}px, ${my+18}px, 0)`;
      // particles
      const now = performance.now();
      if (now - lastParticle > 25) { spawnParticle(mx + (Math.random()-0.5)*6, my + (Math.random()-0.5)*6); lastParticle = now; }
      for (let i = particles.length-1; i >= 0; i--) {
        const p = particles[i];
        p.life -= 0.025;
        p.x += p.vx; p.y += p.vy;
        if (p.life <= 0) { particles.splice(i,1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = "#00e5ff";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
} else {
  // touch or reduced motion: hide custom cursor
  [dot, ring, spotlight, label].forEach((el) => { if (el) el.style.display = "none"; });
}