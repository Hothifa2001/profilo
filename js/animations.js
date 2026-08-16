/* ===== ANIMATIONS.JS ===== */

/* Keyframes أعلى هذا الملف لا تُعرَّف هنا — في CSS */

/** Intersection Observer for scroll reveals */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-right');
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }),
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );
  elements.forEach(el => observer.observe(el));
}

/** Animate skill progress bars */
function initSkillBars() {
  const bars = document.querySelectorAll('.progress-bar');
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.getAttribute('data-width');
        setTimeout(() => { entry.target.style.width = w + '%'; }, 200);
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.3 }
  );
  bars.forEach(b => { b.style.width = '0'; observer.observe(b); });
}

/** Language fill bars */
function initLangBars() {
  const fills = document.querySelectorAll('.lang-fill');
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('animated'); observer.unobserve(entry.target); }
    }),
    { threshold: 0.3 }
  );
  fills.forEach(f => observer.observe(f));
}

/** Count-up numbers */
function animateCount(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + '+'; clearInterval(timer); }
    else el.textContent = Math.floor(start);
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-count')) || 0;
        animateCount(entry.target, target);
        observer.unobserve(entry.target);
      }
    }),
    { threshold: 0.5 }
  );
  counters.forEach(c => observer.observe(c));
}

/** Typing effect — يقبل مصفوفة الأدوار أو يستخدم ROLES العالمية */
function initTypingEffect(roles) {
  const el = document.getElementById('typedText');
  if (!el) return;
  const list = (roles && roles.length) ? roles : (typeof ROLES !== 'undefined' ? ROLES : ['مطور ويب']);
  let roleIdx = 0, charIdx = 0, isDeleting = false, pause = false;

  function type() {
    if (pause) return;
    const current = list[roleIdx];
    if (!isDeleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) { pause = true; setTimeout(() => { pause = false; isDeleting = true; }, 2000); }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) { isDeleting = false; roleIdx = (roleIdx + 1) % list.length; }
    }
    setTimeout(type, isDeleting ? 60 : 100);
  }
  type();
}

/** Custom cursor */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower || window.innerWidth <= 768) return;

  document.addEventListener('mousemove', throttle(e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    setTimeout(() => { follower.style.left = e.clientX + 'px'; follower.style.top = e.clientY + 'px'; }, 80);
  }, 16));

  document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => { follower.style.width = '60px'; follower.style.height = '60px'; });
    el.addEventListener('mouseleave', () => { follower.style.width = '36px'; follower.style.height = '36px'; });
  });
}

/** Loader */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 1600));
}

/** Navbar */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', throttle(() => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNav();
  }, 100));

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  links.forEach(link => link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
  }));

  document.addEventListener('click', e => {
    if (!navbar?.contains(e.target)) {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
    }
  });
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('data-section') === sec.id));
    }
  });
}

/** Smooth scroll */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
    });
  });
}

/** Back to top */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  btn.title = 'العودة للأعلى';
  btn.style.cssText = `position:fixed;bottom:2rem;right:2rem;width:48px;height:48px;background:var(--gradient-primary);color:white;border:none;border-radius:50%;font-size:1rem;cursor:pointer;z-index:999;box-shadow:var(--shadow-glow);opacity:0;transform:translateY(20px);transition:var(--transition);display:flex;align-items:center;justify-content:center;`;
  document.body.appendChild(btn);
  window.addEventListener('scroll', throttle(() => {
    btn.style.opacity = window.scrollY > 400 ? '1' : '0';
    btn.style.transform = window.scrollY > 400 ? 'translateY(0)' : 'translateY(20px)';
  }, 100));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
