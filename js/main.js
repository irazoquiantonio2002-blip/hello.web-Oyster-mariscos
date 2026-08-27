const header = document.getElementById("site-header");
const navToggle = document.getElementById("nav-toggle");
const mainNav = document.getElementById("main-nav");
const loadingScreen = document.getElementById("loading-screen");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

window.addEventListener("load", () => {
  loadingScreen?.classList.add("is-hidden");
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = mainNav?.classList.toggle("is-open");
  navToggle.classList.toggle("is-active", Boolean(isOpen));
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  document.body.classList.toggle("nav-open", Boolean(isOpen));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav?.classList.remove("is-open");
    navToggle?.classList.remove("is-active");
    navToggle?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll("[data-reveal]").forEach((element) => {
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -50% 0px" });

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const typewriter = document.getElementById("typewriter");
const words = ["sashimi", "aguachile", "camarón crudo", "ostiones frescos", "cerveza bien fría"];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const tickTypewriter = () => {
  if (!typewriter) return;

  const current = words[wordIndex];
  typewriter.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    setTimeout(tickTypewriter, 70);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(tickTypewriter, 1300);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(tickTypewriter, 38);
    return;
  }

  deleting = false;
  wordIndex = (wordIndex + 1) % words.length;
  setTimeout(tickTypewriter, 280);
};

tickTypewriter();

const canvas = document.getElementById("particles-canvas");
const ctx = canvas?.getContext("2d");
let particles = [];
let animationFrame;

const resizeCanvas = () => {
  if (!canvas || !ctx) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(72, Math.floor(window.innerWidth / 18)) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 2 + .7,
    vx: (Math.random() - .5) * .28,
    vy: Math.random() * .42 + .12,
    alpha: Math.random() * .45 + .18
  }));
};

const drawParticles = () => {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.y > window.innerHeight + 10) particle.y = -10;
    if (particle.x < -10) particle.x = window.innerWidth + 10;
    if (particle.x > window.innerWidth + 10) particle.x = -10;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
    ctx.fill();
  });

  animationFrame = requestAnimationFrame(drawParticles);
};

if (canvas && ctx) {
  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
    } else {
      drawParticles();
    }
  });
}
