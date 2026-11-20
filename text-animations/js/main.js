import { splitChars, splitWords, splitLines, applyStagger } from "./text-splitter.js";
import { typewriter, terminalTypewriter } from "./typewriter.js";
import { scramble } from "./scramble.js";
import { observe } from "./scroll-trigger.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function init() {
  // Typewriter clásico
  const tw = document.getElementById("tw-classic");
  if (tw) {
    const phrases = JSON.parse(tw.dataset.phrases || "[]");
    if (reduced) tw.textContent = phrases[0];
    else typewriter(tw, phrases, 70, 1800);
  }
  // Terminal
  const term = document.getElementById("tw-terminal");
  if (term) {
    const lines = ["$ npm run build", "✓ Compiled successfully", "$ echo 'Hello NÓRDICO'"];
    if (reduced) term.textContent = lines.join("\n");
    else terminalTypewriter(term, lines, 25);
  }
  // Split chars
  document.querySelectorAll(".split-chars").forEach((el) => {
    splitChars(el);
    if (reduced) el.classList.add("in-view");
    else observe(el, () => el.classList.add("in-view"));
  });
  // Split words
  document.querySelectorAll(".split-words").forEach((el) => {
    splitWords(el);
    if (reduced) el.classList.add("in-view");
    else observe(el, () => el.classList.add("in-view"));
  });
  // Split lines
  document.querySelectorAll(".split-lines").forEach((el) => {
    splitLines(el);
    if (reduced) el.classList.add("in-view");
    else observe(el, () => el.classList.add("in-view"));
  });
  // Color wipe data-text
  document.querySelectorAll(".color-wipe").forEach((el) => {
    el.setAttribute("data-text", el.textContent);
    if (reduced) el.classList.add("in-view");
    else observe(el, () => el.classList.add("in-view"));
  });
  // Clip reveal
  document.querySelectorAll(".clip-reveal").forEach((el) => {
    if (reduced) el.classList.add("in-view");
    else observe(el, () => el.classList.add("in-view"));
  });
  // Blur sharp
  document.querySelectorAll(".blur-sharp").forEach((el) => {
    if (reduced) el.classList.add("in-view");
    else observe(el, () => el.classList.add("in-view"));
  });
  // Underline draw
  document.querySelectorAll(".underline-draw").forEach((el) => {
    if (reduced) el.classList.add("in-view");
    else observe(el, () => el.classList.add("in-view"));
  });
  // Bouncing
  document.querySelectorAll(".bouncing-text").forEach((el) => {
    const text = el.getAttribute("aria-label") || el.textContent;
    el.textContent = "";
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.animationDelay = `${i * 0.06}s`;
      el.appendChild(span);
    });
    if (reduced) el.classList.add("in-view");
    else observe(el, () => el.classList.add("in-view"));
  });
  // Scramble
  document.querySelectorAll(".scramble-text").forEach((el) => {
    const text = el.dataset.text || el.textContent;
    if (reduced) { el.textContent = text; return; }
    observe(el, () => scramble(el, text, 1400));
  });
  // Color wipe already handled
}

// Controls panel
const speedRange = document.getElementById("speedRange");
const staggerRange = document.getElementById("staggerRange");
const replayBtn = document.getElementById("replayBtn");
function applyControls() {
  const speed = parseFloat(speedRange?.value || "1");
  const stagger = parseFloat(staggerRange?.value || "0.04");
  document.documentElement.style.setProperty("--dur-med", `${0.6 / speed}s`);
  document.documentElement.style.setProperty("--stagger", `${stagger}s`);
}
speedRange?.addEventListener("input", applyControls);
staggerRange?.addEventListener("input", applyControls);
replayBtn?.addEventListener("click", () => location.reload());

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();