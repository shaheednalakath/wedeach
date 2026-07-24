/* ==========================================================================
   app.js
   Shared behaviour used across every page: sticky nav, mobile menu,
   smooth scroll, scroll-reveal animation, footer year, and (on the
   home page) the countdown timer + floating hearts ambience.
   ========================================================================== */

(function () {
  "use strict";

  /* ---- Sticky nav + mobile toggle -------------------------------------- */
  function initNav() {
    const nav = document.querySelector(".site-nav");
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      links.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          links.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
        })
      );
    }
  }

  /* ---- Scroll-reveal ------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---- Countdown -------------------------------------------------------- */
  function initCountdown() {
    const root = document.querySelector("[data-countdown]");
    if (!root || typeof SITE_CONFIG === "undefined") return;

    const target = new Date(SITE_CONFIG.weddingDateISO).getTime();
    const fields = {
      days: root.querySelector('[data-unit="days"]'),
      hours: root.querySelector('[data-unit="hours"]'),
      minutes: root.querySelector('[data-unit="minutes"]'),
      seconds: root.querySelector('[data-unit="seconds"]'),
    };

    function tick() {
      const now = Date.now();
      let diff = Math.max(0, target - now);

      const days = Math.floor(diff / 86400000);
      diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000);
      diff -= hours * 3600000;
      const minutes = Math.floor(diff / 60000);
      diff -= minutes * 60000;
      const seconds = Math.floor(diff / 1000);

      if (fields.days) fields.days.textContent = String(days).padStart(2, "0");
      if (fields.hours) fields.hours.textContent = String(hours).padStart(2, "0");
      if (fields.minutes) fields.minutes.textContent = String(minutes).padStart(2, "0");
      if (fields.seconds) fields.seconds.textContent = String(seconds).padStart(2, "0");
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---- Floating hearts ambience (hero background) ------------------------ */
  function initFloatingHearts() {
    const field = document.querySelector("[data-hearts-field]");
    if (!field) return;

    const HEART_PATH =
      "M12 21s-7.2-4.6-10-9.1C.4 8.9 1.7 5 5.4 4.2 7.7 3.7 9.9 4.8 12 7.1c2.1-2.3 4.3-3.4 6.6-2.9 3.7.8 5 4.7 3.4 7.7C19.2 16.4 12 21 12 21z";
    const COUNT = 14;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < COUNT; i++) {
      const ns = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("class", "heart");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("fill", "currentColor");

      const size = 10 + Math.random() * 20;
      const left = Math.random() * 100;
      const duration = 9 + Math.random() * 10;
      const delay = Math.random() * 12;
      const drift = (Math.random() * 120 - 60).toFixed(0) + "px";

      svg.style.width = size + "px";
      svg.style.height = size + "px";
      svg.style.left = left + "%";
      svg.style.setProperty("--drift", drift);
      svg.style.animationDuration = duration + "s";
      svg.style.animationDelay = delay + "s";

      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", HEART_PATH);
      svg.appendChild(path);
      frag.appendChild(svg);
    }
    field.appendChild(frag);
  }

  /* ---- Footer year -------------------------------------------------------- */
  function initFooterYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initReveal();
    initCountdown();
    initFloatingHearts();
    initFooterYear();
  });
})();
