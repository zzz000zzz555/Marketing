// Animaciones fluidas: capa nativa (IntersectionObserver) + realce opcional con GSAP.
(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const useGsap = !!(window.gsap && window.ScrollTrigger);
  window.Motion = window.Motion || {};

  const revealSelector = "[data-reveal], .benefits, .section-wrap, .newsletter, .product-card";

  function initNativeReveal() {
    document.documentElement.classList.add("js-motion");

    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          });
        }, { rootMargin: "0px 0px -6% 0px", threshold: 0.04 })
      : null;

    function observe(root) {
      const scope = root || document;
      const nodes = scope.querySelectorAll(revealSelector);
      nodes.forEach((node, index) => {
        if (node.dataset.observed === "1" || node.classList.contains("is-revealed")) return;
        node.dataset.observed = "1";
        if (!node.style.getPropertyValue("--reveal-delay")) {
          node.style.setProperty("--reveal-delay", `${Math.min(index % 8, 7) * 70}ms`);
        }
        if (observer && !reduced) observer.observe(node);
        else node.classList.add("is-revealed");
      });
    }

    if (!useGsap) {
      document.querySelectorAll(".hero-copy > *, .hero-art").forEach((node, index) => {
        node.setAttribute("data-reveal", "");
        node.style.setProperty("--reveal-delay", `${index * 90}ms`);
      });
    }

    observe(document);
    window.Motion.observeCards = observe;
  }

  function initGsapEnhancements() {
    if (!useGsap || reduced) return;
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    if (window.Lenis) {
      const lenis = new window.Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
      });
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) gsap.from(heroTitle, { opacity: 0, y: 60, duration: 1.2, ease: "power3.out", delay: 0.2 });
    const heroEyebrow = document.querySelector(".hero .eyebrow");
    if (heroEyebrow) gsap.from(heroEyebrow, { opacity: 0, y: 20, duration: 0.9, ease: "power2.out", delay: 0.05 });
    const heroP = document.querySelector(".hero-copy > p");
    if (heroP) gsap.from(heroP, { opacity: 0, y: 30, duration: 1, ease: "power2.out", delay: 0.4 });
    const heroBtn = document.querySelector(".hero .button");
    if (heroBtn) gsap.from(heroBtn, { opacity: 0, y: 20, duration: 0.9, ease: "power2.out", delay: 0.6 });
    const heroArt = document.querySelector(".hero-art");
    if (heroArt) gsap.from(heroArt, { opacity: 0, scale: 0.96, duration: 1.3, ease: "power3.out", delay: 0.3 });

    const heroImage = document.querySelector(".hero-art-image");
    if (heroImage) {
      gsap.to(heroImage, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    document.querySelectorAll(".product-image").forEach((img) => {
      gsap.fromTo(img, { scale: 1.08 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: img, start: "top 95%", end: "bottom 5%", scrub: true }
      });
    });
  }

  function init() {
    initNativeReveal();
    initGsapEnhancements();
    if (!window.Motion.observeCards) window.Motion.observeCards = () => {};
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
