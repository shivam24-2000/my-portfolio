// Styles are linked from index.html so they load before first paint.
const root = document.documentElement;
root.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Theme toggle ────────────────────────────────────────────────────────────
const themeBtn = document.getElementById('theme-toggle');
themeBtn?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  if (!prefersReducedMotion) {
    root.classList.add('theme-transition');
    clearTimeout(themeBtn._t);
    themeBtn._t = setTimeout(() => root.classList.remove('theme-transition'), 400);
  }
  root.setAttribute('data-theme', next);
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', next === 'dark' ? '#141517' : '#f5f4f0');
  try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
});

// ── Nav: border on scroll, mobile menu, active section ──────────────────────
const nav = document.getElementById('nav');
const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const setMenu = (open) => {
  navLinks?.classList.toggle('open', open);
  menuBtn?.setAttribute('aria-expanded', String(open));
  menuBtn?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  const icon = menuBtn?.querySelector('i');
  if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
};
menuBtn?.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

const links = [...document.querySelectorAll('.nav-links a')];
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = `#${entry.target.id}`;
    links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => sectionObserver.observe(s));

// ── Reveal on scroll (+ count-up for impact KPIs) ───────────────────────────
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  if (prefersReducedMotion || Number.isNaN(target)) return;
  const duration = 1200;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    // For values like 99.95, count only the last stretch so it reads as "climbing to" the SLA.
    const from = target > 50 ? target - 5 : 0;
    el.textContent = (from + (target - from) * eased).toFixed(decimals);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    entry.target.querySelectorAll('[data-count]').forEach(countUp);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => {
  // light stagger for siblings in the same grid
  const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains('reveal')) : [];
  const idx = siblings.indexOf(el);
  if (idx > 0) el.style.transitionDelay = `${Math.min(idx * 70, 280)}ms`;
  revealObserver.observe(el);
});

// ── Copy email ──────────────────────────────────────────────────────────────
const toast = document.getElementById('toast');
let toastTimer;
const showToast = (msg) => {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
};

const copyBtn = document.getElementById('copy-email');
copyBtn?.addEventListener('click', async () => {
  const email = copyBtn.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email copied to clipboard');
  } catch {
    window.location.href = `mailto:${email}`;
  }
});

// ── Footer year ─────────────────────────────────────────────────────────────
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());

// ════════════════════════════════════════════════════════════════════════════
// Motion & graphics layer (all decorative; skipped under reduced motion)
// ════════════════════════════════════════════════════════════════════════════

// ── Headline: split into words for a staggered build-in ─────────────────────
const heroTitle = document.querySelector('.hero-title');
if (heroTitle && !prefersReducedMotion) {
  let i = 0;
  const wrap = (node) => {
    const span = document.createElement('span');
    span.className = 'w';
    span.style.setProperty('--i', String(i++));
    return span;
  };
  [...heroTitle.childNodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
        const w = wrap(); w.textContent = part; frag.appendChild(w);
      });
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const w = wrap(); node.replaceWith(w); w.appendChild(node);
    }
  });
}

// ── Hero canvas: packets travelling along the background grid ───────────────
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const hero = document.querySelector('.hero');
  if (!canvas || !hero || prefersReducedMotion) return;
  const ctx = canvas.getContext('2d');
  const GRID = 56;
  let w = 0, h = 0, packets = [], visible = true, raf = 0;

  const readAccent = () => getComputedStyle(root).getPropertyValue('--accent').trim() || '#7cc49e';
  let accent = readAccent();
  new MutationObserver(() => { accent = readAccent(); })
    .observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  const hexToRgb = (hex) => {
    const m = hex.replace('#', '').match(/.{2}/g);
    return m ? m.map((x) => parseInt(x, 16)).join(',') : '94,227,154';
  };

  function spawn() {
    const horizontal = Math.random() < 0.5;
    const cols = Math.ceil(w / GRID), rows = Math.ceil(h / GRID);
    const sign = () => (Math.random() < 0.5 ? 1 : -1);
    return {
      x: horizontal ? Math.random() * w : Math.floor(Math.random() * cols) * GRID,
      y: horizontal ? Math.floor(Math.random() * rows) * GRID : Math.random() * h,
      dx: horizontal ? sign() : 0,
      dy: horizontal ? 0 : sign(),
      speed: 0.5 + Math.random() * 1.1,
      len: 40 + Math.random() * 70,
      age: 0,
      ttl: 260 + Math.random() * 420,
    };
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = rect.width; h = rect.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(8, Math.min(26, Math.round((w * h) / 45000)));
    packets = Array.from({ length: count }, spawn);
  }

  function step(p) {
    const px = p.x, py = p.y;
    p.x += p.dx * p.speed; p.y += p.dy * p.speed; p.age++;
    // At grid intersections, occasionally turn 90°
    const crossedX = p.dx && Math.floor(px / GRID) !== Math.floor(p.x / GRID);
    const crossedY = p.dy && Math.floor(py / GRID) !== Math.floor(p.y / GRID);
    if ((crossedX || crossedY) && Math.random() < 0.18) {
      p.x = Math.round(p.x / GRID) * GRID; p.y = Math.round(p.y / GRID) * GRID;
      const s = Math.random() < 0.5 ? 1 : -1;
      if (p.dx) { p.dy = s; p.dx = 0; } else { p.dx = s; p.dy = 0; }
    }
    const out = p.x < -120 || p.x > w + 120 || p.y < -120 || p.y > h + 120;
    if (out || p.age > p.ttl) Object.assign(p, spawn());
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const rgb = hexToRgb(accent);
    for (const p of packets) {
      step(p);
      const fade = Math.min(1, p.age / 40, (p.ttl - p.age) / 40);
      const tx = p.x - p.dx * p.len, ty = p.y - p.dy * p.len;
      const g = ctx.createLinearGradient(tx, ty, p.x, p.y);
      g.addColorStop(0, `rgba(${rgb},0)`);
      g.addColorStop(1, `rgba(${rgb},${0.55 * fade})`);
      ctx.strokeStyle = g; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.fillStyle = `rgba(${rgb},${0.9 * fade})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2); ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(draw); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });
  resize(); start();
}
initHeroCanvas();

// ── Marquee: duplicate each row once so the loop is seamless ────────────────
document.querySelectorAll('.marquee-track').forEach((track) => {
  [...track.children].forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
});

// ── SVG diagrams: freeze SMIL packets under reduced motion ──────────────────
if (prefersReducedMotion) {
  document.querySelectorAll('svg.arch').forEach((svg) => svg.pauseAnimations?.());
  document.querySelectorAll('.arch-packets').forEach((g) => g.remove());
}

// ── Cursor spotlight on cards ───────────────────────────────────────────────
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.spot').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// ── Scroll-linked: progress bar + timeline fill ─────────────────────────────
const progress = document.getElementById('scroll-progress');
const timeline = document.querySelector('.timeline');
const tlItems = [...document.querySelectorAll('.tl-item')];
let ticking = false;
function onScrollFrame() {
  ticking = false;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress?.style.setProperty('--p', String(max > 0 ? window.scrollY / max : 0));

  if (timeline && !prefersReducedMotion) {
    const r = timeline.getBoundingClientRect();
    const anchor = window.innerHeight * 0.6;
    const t = Math.min(1, Math.max(0, (anchor - r.top) / r.height));
    timeline.style.setProperty('--tl', t.toFixed(4));
    tlItems.forEach((item) => {
      item.classList.toggle('passed', item.getBoundingClientRect().top + 10 < anchor);
    });
  }
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
}, { passive: true });
onScrollFrame();
