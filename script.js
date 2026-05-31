(function () {
  const canvas = document.getElementById('snow-canvas');
  const ctx = canvas.getContext('2d');
  let flakes = [];
  let stars = [];
  let warmEmbers = [];
  let animId;
  let width, height;
  let snowSpeed = parseFloat(localStorage.getItem('zspeedx-snow')) || 1;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Star {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.r = Math.random() * 1.5 + 0.3;
      this.baseAlpha = Math.random() * 0.6 + 0.2;
      this.alpha = this.baseAlpha;
      this.twinkleSpeed = Math.random() * 0.012 + 0.004;
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.alpha = this.baseAlpha + Math.sin(this.phase) * (this.baseAlpha * 0.4);
      this.phase += this.twinkleSpeed;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.05, this.alpha)})`;
      ctx.fill();

      if (this.r > 1) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.alpha * 0.08)})`;
        ctx.fill();
      }
    }
  }

  class Flake {
    constructor() { this.reset(true); }

    reset(init) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : -10;
      this.r = Math.random() * 2.5 + 0.6;
      this.baseSpeed = Math.random() * 0.4 + 0.15;
      this.speed = this.baseSpeed * snowSpeed;
      this.opacity = Math.random() * 0.35 + 0.1;
      this.swing = Math.random() * 25 + 10;
      this.swingSpeed = Math.random() * 0.008 + 0.002;
      this.phase = Math.random() * Math.PI * 2;
    }

    update() {
      this.y += this.speed;
      this.x += Math.sin(this.phase) * 0.15;
      this.phase += this.swingSpeed;
      if (this.y > height + 10) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  class WarmEmber {
    constructor() { this.reset(true); }

    reset(init) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : -8;
      this.r = Math.random() * 1.8 + 0.4;
      this.baseSpeed = Math.random() * 0.25 + 0.08;
      this.speed = this.baseSpeed * snowSpeed;
      this.opacity = Math.random() * 0.2 + 0.04;
      this.swing = Math.random() * 40 + 15;
      this.swingSpeed = Math.random() * 0.004 + 0.001;
      this.phase = Math.random() * Math.PI * 2;
      this.shade = Math.random() > 0.5 ? 255 : 200;
    }

    update() {
      this.y += this.speed;
      this.x += Math.sin(this.phase) * 0.2;
      this.phase += this.swingSpeed;
      if (this.y > height + 10) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.shade}, 0, 0, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const area = width * height;
    const starCount = Math.min(180, Math.floor(area / 8000));
    const flakeCount = Math.min(80, Math.floor(area / 14000));
    const emberCount = Math.min(30, Math.floor(area / 40000));

    stars = Array.from({ length: starCount }, () => new Star());
    flakes = Array.from({ length: flakeCount }, () => new Flake());
    warmEmbers = Array.from({ length: emberCount }, () => new WarmEmber());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (const s of stars) { s.update(); s.draw(); }
    for (const e of warmEmbers) { e.update(); e.draw(); }
    for (const f of flakes) { f.update(); f.draw(); }

    animId = requestAnimationFrame(animate);
  }

  function applySnowSpeed() {
    for (const f of flakes) f.speed = f.baseSpeed * snowSpeed;
    for (const e of warmEmbers) e.speed = e.baseSpeed * snowSpeed;
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });

  resize();
  initParticles();
  animate();

  window.updateSnowSpeed = function(val) {
    snowSpeed = Math.max(0, Math.min(10, val));
    applySnowSpeed();
    localStorage.setItem('zspeedx-snow', snowSpeed);
    const display = document.getElementById('snow-display');
    if (display) display.textContent = snowSpeed.toFixed(2).replace(/\.?0+$/, '') + 'x';
    document.querySelectorAll('.snow-preset').forEach(b => {
      const v = parseFloat(b.textContent);
      b.classList.toggle('active', !isNaN(v) && Math.abs(v - snowSpeed) < 0.01);
    });
  };
})();

/* ─── Copy IP ─── */
function copyIP() {
  const ip = 'raven-mc.net';
  const toast = document.getElementById('toast');

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(ip).then(() => showToast(toast));
  } else {
    const ta = document.createElement('textarea');
    ta.value = ip;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(toast);
  }
}

function showToast(el) {
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1800);
}

/* ─── Nav Toggle ─── */
function toggleNav() {
  const links = document.getElementById('nav-links');
  const overlay = document.getElementById('nav-overlay');
  const hamburger = document.getElementById('nav-hamburger');
  links.classList.toggle('open');
  overlay.classList.toggle('show');
  hamburger.classList.toggle('active');
  document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
}

function closeNav() {
  const links = document.getElementById('nav-links');
  const overlay = document.getElementById('nav-overlay');
  const hamburger = document.getElementById('nav-hamburger');
  links.classList.remove('open');
  overlay.classList.remove('show');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

/* ─── Theme Switcher ─── */
const themes = {
  red:    { accent: '#FF0000', light: '#FF0000', dark: '#C30000', g1: '#FF0000', g2: '#C30000', g3: '#FF0000', r: '255, 0, 0', lr: '255, 0, 0' },
  blue:   { accent: '#3B82F6', light: '#60A5FA', dark: '#1D4ED8', g1: '#1D4ED8', g2: '#7C3AED', g3: '#1D4ED8', r: '59, 130, 246', lr: '96, 165, 250' },
  purple: { accent: '#8B5CF6', light: '#A78BFA', dark: '#5B21B6', g1: '#6D28D9', g2: '#A78BFA', g3: '#6D28D9', r: '139, 92, 246', lr: '167, 139, 250' },
  green:  { accent: '#22C55E', light: '#4ADE80', dark: '#15803D', g1: '#059669', g2: '#22C55E', g3: '#059669', r: '34, 197, 94', lr: '74, 222, 128' },
  orange: { accent: '#F97316', light: '#FB923C', dark: '#C2410C', g1: '#EA580C', g2: '#FBBF24', g3: '#EA580C', r: '249, 115, 22', lr: '251, 146, 60' },
  cyan:   { accent: '#06B6D4', light: '#22D3EE', dark: '#0E7490', g1: '#0E7490', g2: '#22D3EE', g3: '#0E7490', r: '6, 182, 212', lr: '34, 211, 238' },
  pink:   { accent: '#EC4899', light: '#F472B6', dark: '#BE185D', g1: '#BE185D', g2: '#F472B6', g3: '#BE185D', r: '236, 72, 153', lr: '244, 114, 182' },
};

function setTheme(name) {
  const t = themes[name];
  if (!t) return;
  const root = document.documentElement;
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--accent-light', t.light);
  root.style.setProperty('--accent-dark', t.dark);
  root.style.setProperty('--gradient-1', t.g1);
  root.style.setProperty('--gradient-2', t.g2);
  root.style.setProperty('--gradient-3', t.g3);
  root.style.setProperty('--accent-r', t.r);
  root.style.setProperty('--accent-light-r', t.lr);

  document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
  const dot = document.querySelector(`.theme-dot[data-theme="${name}"]`);
  if (dot) dot.classList.add('active');

  const btnDot = document.getElementById('theme-btn-dot');
  if (btnDot) btnDot.style.background = `linear-gradient(135deg,${t.g1},${t.g2},${t.g3})`;

  localStorage.setItem('zspeedx-theme', name);
}

/* ─── Theme Dropdown ─── */
function toggleTheme(e) {
  e.stopPropagation();
  document.getElementById('theme-dropdown').classList.toggle('open');
  document.querySelector('.theme-arrow').classList.toggle('open');
}

document.addEventListener('click', function(e) {
  const wrap = document.getElementById('theme-wrap');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('theme-dropdown').classList.remove('open');
    document.querySelector('.theme-arrow')?.classList.remove('open');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('zspeedx-theme') || 'red';
  setTheme(saved);

  document.querySelectorAll('.theme-dot').forEach(dot => {
    dot.addEventListener('click', function(e) {
      e.stopPropagation();
      setTheme(this.dataset.theme);
      document.getElementById('theme-dropdown').classList.remove('open');
      document.querySelector('.theme-arrow')?.classList.remove('open');
    });
  });

  const savedSnow = parseFloat(localStorage.getItem('zspeedx-snow'));
  if (savedSnow && window.updateSnowSpeed) {
    window.updateSnowSpeed(savedSnow);
  }

  fetchServerStatus();
  setInterval(fetchServerStatus, 10000);
});

function fetchServerStatus() {
  const proxy = '193.34.77.42:25565';
  fetch(`https://api.mcsrvstat.us/3/${proxy}`)
    .then(r => r.json())
    .then(data => {
      const el = document.getElementById('online-count');
      if (data.online) {
        el.textContent = data.players?.online ?? '?';
        const status = document.querySelector('.hero-server-status');
        if (status) {
          status.style.removeProperty('color');
          status.style.removeProperty('border-color');
          status.style.removeProperty('background');
          status.style.removeProperty('--dot-color');
          status.style.removeProperty('--dot-glow');
        }
      } else {
        el.textContent = '0';
        const status = document.querySelector('.hero-server-status');
        if (status) {
          status.style.setProperty('color', '#ef4444');
          status.style.setProperty('border-color', 'rgba(239,68,68,0.2)');
          status.style.setProperty('background', 'rgba(239,68,68,0.08)');
          status.style.setProperty('--dot-color', '#ef4444');
          status.style.setProperty('--dot-glow', 'rgba(239,68,68,0.5)');
        }
      }
    })
    .catch(() => {
      document.getElementById('online-count').textContent = '?';
    });
}

/* ─── Snow Panel ─── */
function toggleSnowPanel() {
  document.getElementById('snow-panel').classList.toggle('open');
  document.getElementById('snow-overlay').classList.toggle('open');
}

function closeSnowPanel() {
  document.getElementById('snow-panel').classList.remove('open');
  document.getElementById('snow-overlay').classList.remove('open');
}

function increaseSnowSpeed() {
  const current = parseFloat(localStorage.getItem('zspeedx-snow')) || 1;
  const steps = current < 1 ? 0.25 : current < 3 ? 0.5 : 1;
  const next = Math.round((current + steps) * 100) / 100;
  window.updateSnowSpeed(Math.min(next, 10));
}

function decreaseSnowSpeed() {
  const current = parseFloat(localStorage.getItem('zspeedx-snow')) || 1;
  const steps = current <= 1 ? 0.25 : current <= 3 ? 0.5 : 1;
  const next = Math.round((current - steps) * 100) / 100;
  window.updateSnowSpeed(Math.max(next, 0));
}

function setSnowSpeed(val) {
  window.updateSnowSpeed(val);
}

/* ─── Scroll Reveal ─── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.setProperty('--i', i);
      requestAnimationFrame(() => entry.target.classList.add('revealed'));
    } else {
      entry.target.classList.remove('revealed');
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
