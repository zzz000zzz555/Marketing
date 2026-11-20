// Animaciones fluidas y orgánicas (Lenis + GSAP)
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    if (reduced) {
      // Sin animaciones: solo asegurar visibilidad
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("revealed"));
      return;
    }

    // Lenis smooth scroll
    if (window.Lenis) {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        smoothTouch: false
      });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      if (window.gsap && window.ScrollTrigger) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }
    }

    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroTitle = document.querySelector(".hero h1");
    if (heroTitle) {
      gsap.from(heroTitle, { opacity: 0, y: 60, duration: 1.2, ease: "power3.out", delay: 0.2 });
    }
    const heroEyebrow = document.querySelector(".hero .eyebrow");
    if (heroEyebrow) gsap.from(heroEyebrow, { opacity: 0, y: 20, duration: 0.9, ease: "power2.out", delay: 0.05 });
    const heroP = document.querySelector(".hero-copy > p");
    if (heroP) gsap.from(heroP, { opacity: 0, y: 30, duration: 1, ease: "power2.out", delay: 0.4 });
    const heroBtn = document.querySelector(".hero .button");
    if (heroBtn) gsap.from(heroBtn, { opacity: 0, y: 20, duration: 0.9, ease: "power2.out", delay: 0.6 });
    const heroArt = document.querySelector(".hero-art");
    if (heroArt) gsap.from(heroArt, { opacity: 0, scale: 0.96, duration: 1.3, ease: "power3.out", delay: 0.3 });

    // Hero parallax
    const heroImage = document.querySelector(".hero-art-image");
    if (heroImage) {
      gsap.to(heroImage, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    // Section reveals
    document.querySelectorAll(".benefits, .section-wrap, .newsletter").forEach((sec) => {
      gsap.from(sec, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: sec, start: "top 85%", toggleActions: "play none none none" }
      });
    });

    // Product cards stagger reveal
    ScrollTrigger.batch(".product-card", {
      onEnter: (batch) => gsap.from(batch, { opacity: 0, y: 40, stagger: 0.08, duration: 0.8, ease: "power2.out" }),
      start: "top 90%"
    });

    // Images scale on scroll
    document.querySelectorAll(".product-image").forEach((img) => {
      gsap.fromTo(img, { scale: 1.08 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: img, start: "top 95%", end: "bottom 5%", scrub: true }
      });
    });

    // Progressive background color shift
    ScrollTrigger.create({
      trigger: ".catalog",
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => gsap.to("body", { backgroundColor: "#f0f4f2", duration: 0.8, ease: "power2.out" }),
      onLeaveBack: () => gsap.to("body", { backgroundColor: "#ffffff", duration: 0.8, ease: "power2.out" })
    });
  }

  // (Tilt 3D desactivado para permitir flip on hover)

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
