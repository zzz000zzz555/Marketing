const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

export function scramble(el, finalText, duration = 1200) {
  const text = finalText || el.dataset.text || el.textContent;
  el.setAttribute("aria-label", text);
  const len = text.length;
  let start = null;
  function frame(t) {
    if (!start) start = t;
    const progress = Math.min((t - start) / duration, 1);
    const revealed = Math.floor(progress * len);
    let out = "";
    for (let i = 0; i < len; i++) {
      if (i < revealed) out += text[i];
      else if (text[i] === " ") out += " ";
      else out += CHARS[Math.floor(Math.random() * CHARS.length)];
    }
    el.textContent = out;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = text;
  }
  requestAnimationFrame(frame);
}