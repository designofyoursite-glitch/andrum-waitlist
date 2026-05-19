// Particles
(function(){
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let width;
  let height;
  const particles = [];

  function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  const colors = ['rgba(107,136,145,', 'rgba(184,197,204,', 'rgba(196,181,160,'];

  for(let i = 0; i < 55; i++){
    particles.push({
      x: Math.random() * 2000,
      y: Math.random() * 2000,
      r: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.18 - 0.06,
      alpha: Math.random() * 0.45 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.008 + Math.random() * 0.012,
    });
  }

  function draw(){
    ctx.clearRect(0, 0, width, height);
    const scrollY = window.scrollY;

    particles.forEach((particle) => {
      particle.pulse += particle.pulseSpeed;
      const alpha = particle.alpha * (0.7 + 0.3 * Math.sin(particle.pulse));
      ctx.beginPath();
      ctx.arc(particle.x, (particle.y - scrollY * 0.08) % (height + 100), particle.r, 0, Math.PI * 2);
      ctx.fillStyle = particle.color + alpha + ')';
      ctx.fill();
      particle.x += particle.vx;
      particle.y += particle.vy;

      if(particle.x < -10) particle.x = width + 10;
      if(particle.x > width + 10) particle.x = -10;
      if(particle.y < -40) particle.y = height + 40;
      if(particle.y > height + 1200) particle.y = -40;
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

reveals.forEach((element) => observer.observe(element));

document.querySelectorAll('.cards-grid .card').forEach((card, index) => {
  card.style.transitionDelay = `${index * 45}ms`;
});
