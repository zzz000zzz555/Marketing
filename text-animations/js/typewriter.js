// Classic typewriter
export function typewriter(el, phrases, speed = 80, pause = 1500) {
  let i = 0, j = 0, deleting = false;
  const cursor = document.createElement("span");
  cursor.className = "cursor";
  el.appendChild(cursor);
  function tick() {
    const current = phrases[i];
    if (!deleting) {
      el.insertBefore(document.createTextNode(current[j]), cursor);
      j++;
      if (j === current.length) { deleting = true; setTimeout(tick, pause); return; }
    } else {
      // remove last char
      const last = el.lastChild;
      if (last && last !== cursor && last.nodeType === 3) {
        last.textContent = last.textContent.slice(0, -1);
        if (last.textContent === "") el.removeChild(last);
      }
      j--;
      if (j === 0) { deleting = false; i = (i + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? speed / 2 : speed);
  }
  tick();
}

// Terminal typewriter
export function terminalTypewriter(el, lines, speed = 30) {
  let lineIdx = 0, charIdx = 0;
  const cursor = document.createElement("span");
  cursor.className = "block-cursor";
  el.appendChild(cursor);
  function tick() {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    if (charIdx === 0 && line.startsWith("$")) {
      const prompt = document.createElement("span");
      prompt.className = "prompt";
      prompt.textContent = "$ ";
      el.insertBefore(prompt, cursor);
    }
    if (charIdx < line.length) {
      const ch = line[charIdx];
      if (ch !== "$" && ch !== " ") {
        el.insertBefore(document.createTextNode(ch), cursor);
      }
      charIdx++;
      setTimeout(tick, speed);
    } else {
      el.insertBefore(document.createElement("br"), cursor);
      lineIdx++;
      charIdx = 0;
      setTimeout(tick, 300);
    }
  }
  tick();
}