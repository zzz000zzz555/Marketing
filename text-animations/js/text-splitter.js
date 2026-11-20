// Utility to split text into spans at runtime
export function splitChars(el) {
  const text = el.getAttribute("aria-label") || el.textContent;
  el.setAttribute("aria-label", text);
  el.textContent = "";
  const wrap = document.createElement("span");
  wrap.className = "split-mask";
  for (const ch of text) {
    const span = document.createElement("span");
    span.className = "char";
    span.textContent = ch === " " ? "\u00A0" : ch;
    span.style.transitionDelay = "0s";
    wrap.appendChild(span);
  }
  el.appendChild(wrap);
  el.classList.add("split-chars");
}

export function splitWords(el) {
  const text = el.getAttribute("aria-label") || el.textContent;
  el.setAttribute("aria-label", text);
  el.textContent = "";
  const words = text.split(/\s+/);
  words.forEach((w, i) => {
    const span = document.createElement("span");
    span.className = "word";
    span.textContent = w;
    span.style.transitionDelay = `${i * 0.08}s`;
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
  el.classList.add("split-words");
}

export function splitLines(el) {
  const text = el.getAttribute("aria-label") || el.textContent;
  el.setAttribute("aria-label", text);
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  el.innerHTML = "";
  lines.forEach((line, i) => {
    const span = document.createElement("span");
    span.className = "line";
    span.textContent = line;
    span.style.transitionDelay = `${i * 0.12}s`;
    el.appendChild(span);
    if (i < lines.length - 1) el.appendChild(document.createElement("br"));
  });
  el.classList.add("split-lines");
}

export function applyStagger(el, selector, baseDelay) {
  el.querySelectorAll(selector).forEach((node, i) => {
    node.style.transitionDelay = `${i * baseDelay}s`;
  });
}