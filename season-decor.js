/* ============================================================
 * NÓRDICO STUDIO — Motor de decoraciones de temporada
 * Cuatro contenedores reales: header / hero / divider / footer.
 * Inyecta SVG (nunca emojis), partículas en canvas y respeta:
 * prefers-reduced-motion, saveData, hardwareConcurrency, modo
 * rendimiento, cambio de pestaña, checkout, carrito y modales.
 * Solo transform/opacity => animaciones en GPU a 60 FPS.
 * ============================================================ */
(() => {
  "use strict";

  const root = document.documentElement;
  const slots = {
    header: document.getElementById("season-header-decor"),
    hero: document.getElementById("season-hero-decor"),
    divider: document.getElementById("season-divider-decor"),
    footer: document.getElementById("season-footer-decor"),
  };

  const ART = {
    navidad: {
      header: `<svg class="deco-svg deco-garland" viewBox="0 0 1200 90" preserveAspectRatio="none">
        <defs>
          <linearGradient id="x-pine" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#3f9d68"/><stop offset="1" stop-color="#14532d"/></linearGradient>
          <radialGradient id="x-bulb"><stop stop-color="#fff8dc"/><stop offset=".45" stop-color="#fbbf24"/><stop offset="1" stop-color="#b45309"/></radialGradient>
          <path id="x-needle" d="M0,0 L9,22 L-9,22 Z"/>
        </defs>
        <path d="M0,16 Q200,62 400,16 T800,16 T1200,16" fill="none" stroke="#6b4423" stroke-width="3" stroke-linecap="round"/>
        <g fill="url(#x-pine)">
          <use href="#x-needle" x="60" y="14" transform="rotate(-18 60 14)"/><use href="#x-needle" x="150" y="30" transform="rotate(16 150 30)"/>
          <use href="#x-needle" x="240" y="36" transform="rotate(-12 240 36)"/><use href="#x-needle" x="330" y="32" transform="rotate(14 330 32)"/>
          <use href="#x-needle" x="420" y="14" transform="rotate(-16 420 14)"/><use href="#x-needle" x="510" y="22" transform="rotate(18 510 22)"/>
          <use href="#x-needle" x="600" y="16" transform="rotate(-14 600 16)"/><use href="#x-needle" x="690" y="22" transform="rotate(16 690 22)"/>
          <use href="#x-needle" x="780" y="14" transform="rotate(-18 780 14)"/><use href="#x-needle" x="870" y="32" transform="rotate(12 870 32)"/>
          <use href="#x-needle" x="960" y="36" transform="rotate(-16 960 36)"/><use href="#x-needle" x="1050" y="30" transform="rotate(18 1050 30)"/>
          <use href="#x-needle" x="1140" y="14" transform="rotate(-14 1140 14)"/>
        </g>
        <g class="deco-twinkle" fill="url(#x-bulb)">
          <circle cx="105" cy="32" r="5"/><circle cx="285" cy="40" r="5"/><circle cx="465" cy="24" r="5"/>
          <circle cx="645" cy="22" r="5"/><circle cx="825" cy="28" r="5"/><circle cx="1005" cy="38" r="5"/><circle cx="1155" cy="24" r="5"/>
        </g>
      </svg>`,
      hero: `<svg class="deco-svg deco-tree deco-tree-left deco-float" viewBox="0 0 140 200">
          <defs><linearGradient id="x-tree" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2f855a"/><stop offset="1" stop-color="#14532d"/></linearGradient></defs>
          <ellipse cx="70" cy="190" rx="42" ry="7" fill="rgba(15,23,42,.18)"/>
          <rect x="62" y="150" width="16" height="32" rx="2" fill="#7c4a21"/>
          <path d="M70,12 L26,78 H46 L14,132 H126 L94,78 H114 Z" fill="url(#x-tree)"/>
          <path d="M70,12 L48,54 H92 Z" fill="#fff" opacity=".22"/>
          <path d="M46,78 L30,110 H58 Z" fill="#fff" opacity=".14"/>
          <circle class="deco-twinkle" cx="70" cy="66" r="5" fill="#fbbf24"/><circle class="deco-twinkle" cx="52" cy="104" r="4" fill="#c41e3a"/><circle class="deco-twinkle" cx="88" cy="104" r="4" fill="#fbbf24"/>
        </svg>
        <svg class="deco-svg deco-tree deco-tree-right deco-float" viewBox="0 0 140 200" style="animation-delay:-3s">
          <ellipse cx="70" cy="190" rx="42" ry="7" fill="rgba(15,23,42,.16)"/>
          <rect x="62" y="150" width="16" height="32" rx="2" fill="#7c4a21"/>
          <path d="M70,12 L26,78 H46 L14,132 H126 L94,78 H114 Z" fill="#14532d"/>
          <path d="M70,12 L48,54 H92 Z" fill="#fff" opacity=".18"/>
          <circle class="deco-twinkle" cx="70" cy="66" r="5" fill="#c41e3a"/><circle class="deco-twinkle" cx="52" cy="104" r="4" fill="#fbbf24"/>
        </svg>`,
      divider: `<svg class="deco-svg deco-cane deco-cane-left" viewBox="0 0 60 120">
          <path d="M30,114 V44 Q30,16 48,16 Q60,16 60,30" fill="none" stroke="#f8fafc" stroke-width="15" stroke-linecap="round"/>
          <path d="M30,114 V44 Q30,16 48,16 Q60,16 60,30" fill="none" stroke="#c41e3a" stroke-width="15" stroke-dasharray="13 13" stroke-linecap="round"/>
        </svg>
        <svg class="deco-svg deco-cane deco-cane-right" viewBox="0 0 60 120">
          <path d="M30,114 V44 Q30,16 12,16 Q0,16 0,30" fill="none" stroke="#f8fafc" stroke-width="15" stroke-linecap="round"/>
          <path d="M30,114 V44 Q30,16 12,16 Q0,16 0,30" fill="none" stroke="#c41e3a" stroke-width="15" stroke-dasharray="13 13" stroke-linecap="round"/>
        </svg>`,
      footer: `<svg class="deco-svg deco-snowman deco-float" viewBox="0 0 110 140">
          <defs><radialGradient id="x-ball" cx="34%" cy="28%"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#b9c6d4"/></radialGradient></defs>
          <ellipse cx="55" cy="134" rx="38" ry="6" fill="rgba(15,23,42,.16)"/>
          <circle cx="55" cy="100" r="31" fill="url(#x-ball)"/><circle cx="55" cy="52" r="23" fill="url(#x-ball)"/>
          <rect x="29" y="74" width="52" height="10" rx="5" fill="#c41e3a"/>
          <path d="M78,79 h14 v20 h-14 z" fill="#c41e3a"/><path d="M90,79 l12,8 l-12,8 z" fill="#9f1239"/>
          <circle cx="47" cy="48" r="2.6" fill="#18181b"/><circle cx="63" cy="48" r="2.6" fill="#18181b"/>
          <path d="M55,52 L76,56 L55,60 Z" fill="#f59e0b"/>
          <path d="M36,22 q19,-14 38,0" fill="none" stroke="#18181b" stroke-width="9" stroke-linecap="round"/>
          <rect x="30" y="20" width="50" height="8" rx="4" fill="#18181b"/>
        </svg>`,
    },

    "fiestas-patrias": {
      header: `<svg class="deco-svg deco-garland" viewBox="0 0 1200 90" preserveAspectRatio="none">
        <path d="M0,10 Q300,54 600,10 T1200,10" fill="none" stroke="#b91c1c" stroke-width="2.5"/>
        <g class="deco-sway">
          <path d="M80,18 L112,18 L96,54 Z" fill="#dc2626"/><path d="M180,22 L212,22 L196,58 Z" fill="#ffffff"/>
          <path d="M280,26 L312,26 L296,62 Z" fill="#dc2626"/><path d="M380,26 L412,26 L396,62 Z" fill="#ffffff"/>
          <path d="M480,22 L512,22 L496,58 Z" fill="#dc2626"/><path d="M580,12 L612,12 L596,48 Z" fill="#ffffff"/>
          <path d="M680,22 L712,22 L696,58 Z" fill="#dc2626"/><path d="M780,26 L812,26 L796,62 Z" fill="#ffffff"/>
          <path d="M880,26 L912,26 L896,62 Z" fill="#dc2626"/><path d="M980,22 L1012,22 L996,58 Z" fill="#ffffff"/>
          <path d="M1080,18 L1112,18 L1096,54 Z" fill="#dc2626"/>
        </g>
      </svg>`,
      hero: `<svg class="deco-svg deco-rosette deco-pulse" viewBox="0 0 170 170">
          <defs><radialGradient id="fp-r" cx="35%" cy="30%"><stop stop-color="#ffffff"/><stop offset=".55" stop-color="#fca5a5"/><stop offset="1" stop-color="#991b1b"/></radialGradient></defs>
          <circle cx="85" cy="85" r="62" fill="url(#fp-r)"/>
          <g stroke="#ffffff" stroke-width="3.5" stroke-linecap="round">
            <path d="M85,30 V55"/><path d="M85,115 V140"/><path d="M30,85 H55"/><path d="M115,85 H140"/>
            <path d="M46,46 L63,63"/><path d="M124,46 L107,63"/><path d="M46,124 L63,107"/><path d="M124,124 L107,107"/>
          </g>
          <circle cx="85" cy="85" r="21" fill="#fbbf24"/><circle cx="85" cy="85" r="10" fill="#b91c1c"/>
        </svg>
        <svg class="deco-svg deco-cenefa" viewBox="0 0 520 40" preserveAspectRatio="none">
          <path d="M0,20 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l20,14 l20,-14 l20,14" fill="none" stroke="#b91c1c" stroke-width="3" opacity=".55"/>
        </svg>`,
      divider: `<svg class="deco-svg deco-miniflag" viewBox="0 0 300 60" preserveAspectRatio="none">
          <path d="M0,16 Q150,42 300,16" fill="none" stroke="#b91c1c" stroke-width="2"/>
          <path d="M40,20 L66,20 L53,46 Z" fill="#dc2626"/><path d="M110,24 L136,24 L123,50 Z" fill="#fff"/>
          <path d="M180,24 L206,24 L193,50 Z" fill="#dc2626"/><path d="M250,20 L276,20 L263,46 Z" fill="#fff"/>
        </svg>`,
      footer: `<svg class="deco-svg deco-flag deco-wave" viewBox="0 0 150 100">
          <path d="M18,18 H140 V72 H18 Z" fill="#dc2626"/>
          <path d="M79,18 H140 V72 H79 Z" fill="#ffffff"/>
          <circle cx="50" cy="45" r="10" fill="#fbbf24"/>
          <path d="M18,18 V72" stroke="#7f1d1d" stroke-width="4"/>
        </svg>`,
    },

    "anio-nuevo": {
      header: `<svg class="deco-svg deco-stars" viewBox="0 0 1200 80" preserveAspectRatio="none">
        <defs><linearGradient id="ny-gold" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff7c2"/><stop offset="1" stop-color="#d97706"/></linearGradient>
        <path id="ny-star" d="M0,-10 L2.6,-3 L10,-3 L4,1.6 L6.4,9 L0,4.6 L-6.4,9 L-4,1.6 L-10,-3 L-2.6,-3 Z"/></defs>
        <g class="deco-twinkle" fill="url(#ny-gold)">
          <use href="#ny-star" x="80" y="26" transform="scale(.9)"/><use href="#ny-star" x="240" y="18"/>
          <use href="#ny-star" x="410" y="30" transform="scale(.7)"/><use href="#ny-star" x="600" y="20"/>
          <use href="#ny-star" x="790" y="30" transform="scale(.8)"/><use href="#ny-star" x="970" y="18"/>
          <use href="#ny-star" x="1130" y="26" transform="scale(.9)"/>
        </g>
      </svg>`,
      hero: `<svg class="deco-svg deco-firework deco-pulse" viewBox="0 0 200 200">
          <defs><radialGradient id="ny-glow"><stop stop-color="#fff"/><stop offset=".3" stop-color="#fde68a"/><stop offset="1" stop-color="#f59e0b" stop-opacity="0"/></radialGradient></defs>
          <circle cx="100" cy="100" r="62" fill="url(#ny-glow)" opacity=".45"/>
          <g stroke="#ffd700" stroke-width="2.5" stroke-linecap="round">
            <path d="M100,100 L100,34"/><path d="M100,100 L147,53"/><path d="M100,100 L166,100"/>
            <path d="M100,100 L147,147"/><path d="M100,100 L100,166"/><path d="M100,100 L53,147"/>
            <path d="M100,100 L34,100"/><path d="M100,100 L53,53"/>
          </g>
          <g fill="#fff8dc"><circle cx="100" cy="30" r="3"/><circle cx="150" cy="50" r="3"/><circle cx="170" cy="100" r="3"/><circle cx="150" cy="150" r="3"/><circle cx="100" cy="170" r="3"/><circle cx="50" cy="150" r="3"/><circle cx="30" cy="100" r="3"/><circle cx="50" cy="50" r="3"/></g>
        </svg>
        <svg class="deco-svg deco-firework deco-pulse" viewBox="0 0 200 200" style="animation-delay:-1.4s;--deco-scale:.72">
          <g stroke="#fde68a" stroke-width="2"><path d="M100,100 L100,40"/><path d="M100,100 L160,100"/><path d="M100,100 L100,160"/><path d="M100,100 L40,100"/><path d="M100,100 L143,57"/><path d="M100,100 L57,143"/></g>
        </svg>`,
      divider: `<svg class="deco-svg deco-streamer" viewBox="0 0 320 70" preserveAspectRatio="none">
          <defs><linearGradient id="ny-stream" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#fbbf24"/><stop offset="1" stop-color="#fef3c7"/></linearGradient></defs>
          <path d="M10,10 q20,24 0,48 q20,24 0,48" fill="none" stroke="url(#ny-stream)" stroke-width="5" stroke-linecap="round"/>
          <path d="M120,4 q22,26 0,52 q22,26 0,52" fill="none" stroke="url(#ny-stream)" stroke-width="5" stroke-linecap="round" opacity=".8"/>
          <path d="M230,10 q20,24 0,48 q20,24 0,48" fill="none" stroke="url(#ny-stream)" stroke-width="5" stroke-linecap="round" opacity=".6"/>
        </svg>`,
      footer: `<svg class="deco-svg deco-sparks" viewBox="0 0 200 90">
          <g class="deco-twinkle" fill="#ffd700">
            <circle cx="30" cy="70" r="3"/><circle cx="62" cy="48" r="2"/><circle cx="96" cy="76" r="3.5"/>
            <circle cx="132" cy="40" r="2.5"/><circle cx="166" cy="66" r="3"/><circle cx="186" cy="30" r="2"/>
          </g>
          <path d="M20,84 Q100,70 180,84" fill="none" stroke="#ffd700" stroke-width="2" opacity=".45"/>
        </svg>`,
    },

    cyber: {
      header: `<svg class="deco-svg deco-neon-wave" viewBox="0 0 1200 80" preserveAspectRatio="none">
        <defs><linearGradient id="cy-neon" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#00ff88"/><stop offset=".5" stop-color="#22d3ee"/><stop offset="1" stop-color="#00ff88"/></linearGradient></defs>
        <path d="M0,40 Q150,4 300,40 T600,40 T900,40 T1200,40" fill="none" stroke="url(#cy-neon)" stroke-width="3" opacity=".8"/>
        <path d="M0,58 Q150,22 300,58 T600,58 T900,58 T1200,58" fill="none" stroke="url(#cy-neon)" stroke-width="2" opacity=".35"/>
      </svg>`,
      hero: `<svg class="deco-svg deco-neon-grid" viewBox="0 0 400 200" preserveAspectRatio="none">
          <g stroke="#00ff88" stroke-width="1" opacity=".22">
            <path d="M0,40 H400"/><path d="M0,80 H400"/><path d="M0,120 H400"/><path d="M0,160 H400"/>
            <path d="M40,0 V200"/><path d="M120,0 V200"/><path d="M200,0 V200"/><path d="M280,0 V200"/><path d="M360,0 V200"/>
          </g>
        </svg>
        <svg class="deco-svg deco-neon-badge deco-pulse" viewBox="0 0 150 60">
          <rect x="4" y="4" width="142" height="52" rx="10" fill="#0a0a0a" stroke="#00ff88" stroke-width="2"/>
          <path d="M24,30 h28 M24,22 h18 M24,38 h34" stroke="#00ff88" stroke-width="3" stroke-linecap="round"/>
          <circle cx="112" cy="30" r="12" fill="none" stroke="#22d3ee" stroke-width="3"/>
        </svg>`,
      divider: `<svg class="deco-svg deco-neon-bolt deco-pulse" viewBox="0 0 120 100">
          <path d="M66,6 L26,54 H60 L50,94 L96,40 H60 Z" fill="#00ff88" opacity=".85"/>
        </svg>`,
      footer: `<svg class="deco-svg deco-neon-orbs" viewBox="0 0 200 80">
          <circle class="deco-twinkle" cx="40" cy="42" r="12" fill="none" stroke="#00ff88" stroke-width="2"/>
          <circle class="deco-twinkle" cx="100" cy="32" r="8" fill="none" stroke="#22d3ee" stroke-width="2"/>
          <circle class="deco-twinkle" cx="160" cy="46" r="14" fill="none" stroke="#00ff88" stroke-width="2"/>
        </svg>`,
    },

    "san-valentin": {
      header: `<svg class="deco-svg deco-garland" viewBox="0 0 1200 80" preserveAspectRatio="none">
        <defs><path id="v-heart" d="M0,6 C-14,-8 -28,4 -20,16 L0,34 L20,16 C28,4 14,-8 0,6 Z"/>
        <linearGradient id="v-hg" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fb7185"/><stop offset="1" stop-color="#9f1239"/></linearGradient></defs>
        <path d="M0,12 Q300,46 600,12 T1200,12" fill="none" stroke="#fb7185" stroke-width="2" opacity=".6"/>
        <g class="deco-sway" fill="url(#v-hg)">
          <use href="#v-heart" x="100" y="20"/><use href="#v-heart" x="300" y="28"/><use href="#v-heart" x="500" y="32"/>
          <use href="#v-heart" x="700" y="28"/><use href="#v-heart" x="900" y="20"/><use href="#v-heart" x="1100" y="26"/>
        </g>
      </svg>`,
      hero: `<svg class="deco-svg deco-heart deco-float" viewBox="0 0 120 120">
          <defs><radialGradient id="v-heart-g" cx="35%" cy="28%"><stop stop-color="#fecdd3"/><stop offset="1" stop-color="#9f1239"/></radialGradient></defs>
          <path d="M60,108 C6,68 4,34 30,22 C46,14 58,26 60,34 C62,26 74,14 90,22 C116,34 114,68 60,108 Z" fill="url(#v-heart-g)"/>
          <path d="M42,32 C34,38 34,50 40,58" fill="none" stroke="#fff" stroke-width="4" opacity=".35" stroke-linecap="round"/>
        </svg>
        <svg class="deco-svg deco-heart deco-float" viewBox="0 0 120 120" style="animation-delay:-2.6s;--deco-scale:.65">
          <path d="M60,108 C6,68 4,34 30,22 C46,14 58,26 60,34 C62,26 74,14 90,22 C116,34 114,68 60,108 Z" fill="#fb7185" opacity=".8"/>
        </svg>`,
      divider: `<svg class="deco-svg deco-heart-cluster deco-pulse" viewBox="0 0 220 90">
          <defs><path id="v-mini" d="M0,5 C-9,-5 -18,3 -12,11 L0,22 L12,11 C18,3 9,-5 0,5 Z"/></defs>
          <g fill="#fb7185"><use href="#v-mini" x="50" y="30"/><use href="#v-mini" x="110" y="20"/><use href="#v-mini" x="170" y="34"/><use href="#v-mini" x="80" y="56"/><use href="#v-mini" x="140" y="56"/></g>
        </svg>`,
      footer: `<svg class="deco-svg deco-heart deco-float" viewBox="0 0 140 140">
          <path d="M70,126 C10,82 6,42 36,28 C54,18 68,32 70,42 C72,32 86,18 104,28 C134,42 130,82 70,126 Z" fill="#9f1239" opacity=".9"/>
          <path d="M48,40 C38,48 38,62 46,72" fill="none" stroke="#fff" stroke-width="5" opacity=".3" stroke-linecap="round"/>
        </svg>`,
    },
  };

  const PARTICLES = {
    navidad: { kind: "snow", count: 90, layers: 3, colors: ["rgba(255,255,255,.9)", "rgba(255,255,255,.6)", "rgba(255,255,255,.35)"] },
    "fiestas-patrias": { kind: "confetti", count: 70, duration: 3000, colors: ["#dc2626", "#ffffff", "#f59e0b"] },
    "anio-nuevo": { kind: "sparkles", count: 55, colors: ["#ffd700", "#fde68a", "#ffffff"] },
    cyber: { kind: "sparks", count: 45, colors: ["#00ff88", "#22d3ee"] },
    "san-valentin": { kind: "hearts", count: 35, colors: ["#fb7185", "#fda4af", "#9f1239"] },
  };

  let rafId = null;
  let particles = [];
  let ctx = null;
  let canvas = null;
  let startedAt = 0;
  let windTime = 0;
  let lastFrame = 0;
  let activeParticleConfig = null;

  function isReduced() {
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      root.classList.contains("reduce-motion")
    );
  }

  function isPerformanceBlocked() {
    try {
      if (localStorage.getItem("nordico_performance") === "1") return true;
    } catch (e) { /* almacenamiento no disponible */ }
    if (navigator.connection && navigator.connection.saveData) return true;
    if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4) return true;
    return false;
  }

  function isUiBlocked() {
    const body = document.body;
    return (
      document.hidden ||
      body.classList.contains("checkout-open") ||
      body.classList.contains("modal-open") ||
      body.classList.contains("cart-open") ||
      body.classList.contains("drawer-open")
    );
  }

  function setActive(on) {
    Object.values(slots).forEach((el) => el && el.classList.toggle("is-active", on));
    root.setAttribute("data-decor-active", on ? "on" : "off");
  }

  function stopParticles() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    particles = [];
    activeParticleConfig = null;
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle(config, width, height) {
    const depth = config.layers ? 1 + Math.floor(Math.random() * config.layers) : 1;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: (config.kind === "snow" ? 1.2 : 2.4) + Math.random() * 2.4 * depth,
      speed: (config.kind === "snow" ? 0.25 : 0.7) + Math.random() * 0.9 * depth,
      drift: Math.random() * 0.6 - 0.3,
      phase: Math.random() * Math.PI * 2,
      depth,
      color: config.colors[Math.floor(Math.random() * config.colors.length)],
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.08,
      life: 0,
    };
  }

  function drawHeart(c, x, y, size) {
    c.beginPath();
    c.moveTo(x, y + size * 0.7);
    c.bezierCurveTo(x - size * 1.6, y - size * 0.5, x - size * 0.5, y - size * 1.5, x, y - size * 0.5);
    c.bezierCurveTo(x + size * 0.5, y - size * 1.5, x + size * 1.6, y - size * 0.5, x, y + size * 0.7);
    c.fill();
  }

  function tick(now) {
    if (!ctx || !canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dt = Math.min(32, now - (lastFrame || now)) / 16.67;
    lastFrame = now;
    const config = activeParticleConfig || {};
    const elapsed = now - startedAt;

    ctx.clearRect(0, 0, width, height);
    windTime += 0.006 * dt;

    if (config.duration && elapsed > config.duration) {
      const fade = Math.max(0, 1 - (elapsed - config.duration) / 700);
      ctx.globalAlpha = fade;
      if (fade <= 0) { stopParticles(); return; }
    }

    particles.forEach((p) => {
      const wind = Math.sin(windTime + p.phase) * (0.35 + p.depth * 0.25);
      p.x += (p.drift + wind) * dt;
      p.y += p.speed * dt;
      p.rotation += p.spin * dt;
      p.life += dt;

      if (p.y > height + 12) { p.y = -12; p.x = Math.random() * width; }
      if (p.x > width + 12) p.x = -12;
      if (p.x < -12) p.x = width + 12;

      ctx.globalAlpha = config.kind === "snow" ? 0.45 + p.depth * 0.18 : 0.85;
      ctx.fillStyle = p.color;

      if (config.kind === "confetti") {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
        ctx.restore();
      } else if (config.kind === "hearts") {
        drawHeart(ctx, p.x, p.y, p.r);
      } else if (config.kind === "sparkles" || config.kind === "sparks") {
        ctx.globalAlpha *= 0.55 + 0.45 * Math.sin(p.life * 0.05 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(tick);
  }

  function particleConfigFor(season) {
    let effect = null;
    try {
      const c = JSON.parse(localStorage.getItem("nordico_campaign") || "null");
      effect = c && c.visualEffect && c.visualEffect !== "none" ? c.visualEffect : null;
    } catch (e) { /* sin campaña guardada: se usa la temporada activa */ }
    const byEffect = {
      snow: "navidad",
      confetti: "fiestas-patrias",
      sparkles: "anio-nuevo",
      sparks: "cyber",
      hearts: "san-valentin",
    };
    return PARTICLES[(effect && byEffect[effect]) || season] || null;
  }

  function startParticles(season) {
    const config = particleConfigFor(season);
    canvas = document.getElementById("campaignCanvas");
    if (!canvas || !config || root.dataset.animations === "off" || isReduced() || isPerformanceBlocked() || isUiBlocked()) return;
    ctx = canvas.getContext("2d");
    activeParticleConfig = config;
    resizeCanvas();
    startedAt = performance.now();
    lastFrame = startedAt;
    particles = Array.from({ length: Math.min(config.count, 120) }, () => makeParticle(config, window.innerWidth, window.innerHeight));
    rafId = requestAnimationFrame(tick);
  }

  let currentSeason = root.dataset.season || "default";

  function applyCampaignFlags(campaign) {
    if (!campaign) return;
    root.dataset.season = campaign.themeKey || "default";
    root.dataset.decor = campaign.showDecorations !== false ? "on" : "off";
    root.dataset.animations = campaign.showAnimations !== false ? "on" : "off";
  }

  function readCampaignFlags() {
    try {
      applyCampaignFlags(JSON.parse(localStorage.getItem("nordico_campaign") || "null"));
    } catch (e) { /* configuración inválida: se conservan los atributos actuales */ }
  }

  function render() {
    currentSeason = root.dataset.season || "default";
    const visible =
      root.dataset.decor !== "off" &&
      currentSeason !== "default" &&
      !!ART[currentSeason] &&
      !isReduced() &&
      !isPerformanceBlocked() &&
      !isUiBlocked();

    Object.keys(slots).forEach((key) => {
      const el = slots[key];
      if (!el) return;
      el.innerHTML = visible ? (ART[currentSeason][key] || "") : "";
    });
    setActive(visible);
    stopParticles();
    if (visible) startParticles(currentSeason);
  }

  function refreshLifecycle() {
    if (isUiBlocked() || isPerformanceBlocked() || isReduced()) {
      stopParticles();
      setActive(false);
      Object.values(slots).forEach((el) => el && (el.innerHTML = ""));
    } else if (root.dataset.decor !== "off" && currentSeason !== "default") {
      render();
    }
  }

  window.addEventListener("resize", () => {
    if (rafId !== null) resizeCanvas();
  });
  window.addEventListener("nordico:seasonchange", () => {
    readCampaignFlags();
    render();
  });
  window.addEventListener("storage", (event) => {
    if (event.key !== "nordico_campaign") return;
    readCampaignFlags();
    render();
  });
  document.addEventListener("visibilitychange", refreshLifecycle);
  new MutationObserver(refreshLifecycle).observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", refreshLifecycle);

  window.SeasonDecor = {
    render,
    refresh: refreshLifecycle,
    stop: stopParticles,
    seasons: Object.keys(ART),
  };

  readCampaignFlags();
  render();
})();
