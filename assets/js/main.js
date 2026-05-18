// ── PARTICLES ──
(function(){
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const COLORS = ['rgba(107,136,145,', 'rgba(184,197,204,', 'rgba(196,181,160,'];

  for(let i = 0; i < 55; i++){
    particles.push({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      r: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18 - 0.06,
      alpha: Math.random() * 0.45 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.008 + Math.random() * 0.012,
    });
  }

  function draw(){
    ctx.clearRect(0, 0, W, H);
    const scrollY = window.scrollY;
    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, (p.y - scrollY * 0.08) % (H + 100), p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + a + ')';
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -10) p.x = W + 10;
      if(p.x > W + 10) p.x = -10;
      if(p.y < -40) p.y = H + 40;
      if(p.y > H + 1200) p.y = -40;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('in');
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
reveals.forEach(el => obs.observe(el));

// stagger cards
document.querySelectorAll('.cards-grid .card').forEach((c,i) => c.style.transitionDelay = `${i*55}ms`);

// ── FORM SUBMIT ──
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbz6B7AVHCF14_mUVHSjpda4y9KqNKsj7Ds2nUCwmNxKwZznVKfucSuAKob6Sjxxe7Z90w/exec';

async function submitWaitlist(inputId, consentId) {
  const input = document.getElementById(inputId);
  const consent = document.getElementById(consentId);

  if (!input.value || !input.value.includes('@')) {
    input.style.borderBottom = '1px solid rgba(196,100,80,0.4)';
    input.focus();
    return;
  }

  if (!consent.checked) {
    consent.nextElementSibling.classList.add('error');
    return;
  }

  consent.nextElementSibling.classList.remove('error');
  const btn = input.closest('.waitlist-input-row').querySelector('.waitlist-btn');
  btn.textContent = '...';
  btn.disabled = true;

  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: input.value })
    });
    window.location.href = '/practices';
  } catch {
    btn.textContent = 'Try again';
    btn.disabled = false;
  }
}

document.querySelector('[data-form-submit="primary"]').addEventListener('click', () => {
  submitWaitlist('email-input', 'consent-1');
});

document.querySelector('[data-form-submit="secondary"]').addEventListener('click', () => {
  submitWaitlist('email-input-2', 'consent-2');
});

document.querySelectorAll('.waitlist-input').forEach((input) => {
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const isSecondary = input.id === 'email-input-2';
      submitWaitlist(input.id, isSecondary ? 'consent-2' : 'consent-1');
    }
  });
});
