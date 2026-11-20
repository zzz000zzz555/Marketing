export function observe(el, cb) {
  if (!("IntersectionObserver" in window)) { cb(); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { cb(); io.unobserve(e.target); } });
  }, { threshold: 0.3 });
  io.observe(el);
}