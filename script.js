// --- Starfield background ---
(function () {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.15 + 0.02,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const twinkle = reduceMotion ? 1 : 0.55 + 0.45 * Math.sin(t / 900 + s.phase);
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = '#d9cdea';
      ctx.fillRect(s.x, s.y, s.r, s.r);
      if (!reduceMotion) {
        s.y += s.speed;
        if (s.y > h) s.y = 0;
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

// --- Mobile nav toggle ---
const navToggle = document.getElementById('navToggle');
const nav = document.querySelector('.nav');
navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});
document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// --- Scroll down arrow ---
document.getElementById('scrollDown').addEventListener('click', () => {
  document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

// --- Copy CA ---
const caCopy = document.getElementById('caCopy');
const caValue = document.getElementById('caValue');
caCopy.addEventListener('click', async () => {
  const text = caValue.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
    const original = caValue.textContent;
    caValue.textContent = 'Copied!';
    setTimeout(() => { caValue.textContent = original; }, 1400);
  } catch (e) {
    // clipboard unavailable; silently ignore
  }
});

// --- Whitelist form submit ---
const wlForm = document.getElementById('wlForm');
const submitBtn = document.getElementById('submitBtn');
const wlSuccess = document.getElementById('wlSuccess');

wlForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (submitBtn.classList.contains('launching')) return;

  submitBtn.classList.add('launching');
  submitBtn.disabled = true;

  setTimeout(() => {
    wlForm.hidden = true;
    wlSuccess.hidden = false;
  }, 700);
});
