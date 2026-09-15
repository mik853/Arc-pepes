// --- Entry modal ---
(function () {
  const overlay = document.getElementById('entryModal');
  const joinBtn = document.getElementById('modalJoinBtn');
  const closeBtn = document.getElementById('modalCloseBtn');

  function closeModal() {
    overlay.classList.add('closing');
    setTimeout(() => {
      overlay.hidden = true;
    }, 250);
  }

  joinBtn.addEventListener('click', () => {
    closeModal();
    setTimeout(() => {
      document.getElementById('whitelist').scrollIntoView({ behavior: 'smooth' });
    }, 200);
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) closeModal();
  });
})();

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

// --- Whitelist form submit ---
const wlForm = document.getElementById('wlForm');
const submitBtn = document.getElementById('submitBtn');
const wlSuccess = document.getElementById('wlSuccess');

const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw8rFkqKmxuiKtBTU7JreXUVvboI3flT_-Cf_nqqUIe04-z-Irt6x65Htz4-FSe7LqP/exec';

wlForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (submitBtn.classList.contains('launching')) return;

  submitBtn.classList.add('launching');
  submitBtn.disabled = true;

  const payload = {
    twitterUsername: document.getElementById('twitterUsername').value.trim(),
    retweetLink: document.getElementById('retweetLink').value.trim(),
    walletAddress: document.getElementById('walletAddress').value.trim(),
  };

  fetch(SHEET_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  })
    .catch(() => {
      // no-cors means we can't read the response either way, but if the
      // network request itself fails (offline, blocked), log it.
      console.error('Whitelist submission failed to send.');
    })
    .finally(() => {
      setTimeout(() => {
        wlForm.hidden = true;
        wlSuccess.hidden = false;
      }, 500);
    });
});
