// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}
document.getElementById('mobileClose').addEventListener('click', closeMobileMenu);

// ===== SMOOTH SCROLL & ACTIVE LINKS =====
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
  let current = '';
  sections.forEach(s => {
    const sTop = s.offsetTop - 100;
    if (window.scrollY >= sTop) current = s.getAttribute('id');
  });
  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
  });
}
window.addEventListener('scroll', updateActiveLink);

// ===== SCROLL REVEAL ANIMATION =====
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// ===== ANIMATED COUNTER =====
function animateCounter(el) {
  const targetText = el.getAttribute('data-count');
  const target = parseInt(targetText);
  const suffix = el.textContent.replace(/[0-9]/g, '').trim();
  const duration = 1800;
  const step = (target / duration) * 16;
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + (suffix || '');
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ===== HERO MINI CHART =====
function drawHeroMiniChart() {
  const canvas = document.getElementById('heroMiniChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let data = Array.from({ length: 30 }, () => Math.random() * 40 + 30);

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(0, 212, 170, 0.35)');
    grad.addColorStop(1, 'rgba(0, 212, 170, 0)');

    const segW = W / (data.length - 1);
    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const range = maxVal - minVal || 1;

    function getY(v) { return H - ((v - minVal) / range) * (H - 8) - 4; }

    ctx.beginPath();
    ctx.moveTo(0, H);
    data.forEach((v, i) => {
      const x = i * segW;
      const y = getY(v);
      if (i === 0) ctx.lineTo(x, y);
      else {
        const px = (i - 1) * segW;
        const py = getY(data[i - 1]);
        const cx1 = px + segW / 3;
        const cx2 = x - segW / 3;
        ctx.bezierCurveTo(cx1, py, cx2, y, x, y);
      }
    });
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = i * segW;
      const y = getY(v);
      if (i === 0) ctx.moveTo(x, y);
      else {
        const px = (i - 1) * segW;
        const py = getY(data[i - 1]);
        const cx1 = px + segW / 3;
        const cx2 = x - segW / 3;
        ctx.bezierCurveTo(cx1, py, cx2, y, x, y);
      }
    });
    ctx.strokeStyle = '#00d4aa';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  draw();
  // Update live data every 1.5s
  setInterval(() => {
    data.shift();
    data.push(Math.random() * 40 + 30);
    draw();
  }, 1500);
}
drawHeroMiniChart();

// ===== HERO STATS LIVE UPDATE =====
const wattValues = ['3.8 kW', '4.1 kW', '3.6 kW', '4.2 kW', '4.5 kW', '3.9 kW'];
const savedValues = ['₹ 115', '₹ 120', '₹ 132', '₹ 108', '₹ 125', '₹ 142'];
const idleValues = ['2', '3', '4', '2', '5', '3'];
const effValues = ['85%', '87%', '91%', '83%', '89%', '92%'];

let heroIdx = 0;
setInterval(() => {
  heroIdx = (heroIdx + 1) % wattValues.length;
  const w = document.getElementById('heroWatt');
  const s = document.getElementById('heroSaved');
  const id = document.getElementById('heroIdle');
  const e = document.getElementById('heroEff');
  if (w) w.textContent = wattValues[heroIdx];
  if (s) s.textContent = savedValues[heroIdx];
  if (id) id.textContent = idleValues[heroIdx];
  if (e) e.textContent = effValues[heroIdx];
}, 2000);

// ===== CONTACT FORM =====
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✅ Sent!';
    showToast();
    e.target.reset();
    setTimeout(() => {
      btn.innerHTML = '<span>📨</span> Send Message';
      btn.disabled = false;
    }, 3000);
  }, 1200);
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ===== PARTICLE EFFECT FOR HERO (optional subtle) =====
(function() {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:1;opacity:0.4;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 30 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.5 + 0.1
  }));

  function animParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,170,${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(animParticles);
  }
  animParticles();
})();
