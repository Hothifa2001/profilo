/* ===== MAIN.JS ===== */

/** ============================
 *  LOADER
 * ============================ */
function initLoader() {
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1800);
  });
}

/** ============================
 *  NAVBAR
 * ============================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  // Scroll behavior
  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  }, 100));

  // Hamburger
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

/** Update active nav link based on scroll position */
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === id) {
          link.classList.add('active');
        }
      });
    }
  });
}

/** ============================
 *  PROFILE PHOTO UPLOADS
 * ============================ */
function initPhotoUploads() {
  // Hero profile photo
  const heroInput = document.getElementById('profilePhotoInput');
  const heroPhoto = document.getElementById('profilePhoto');

  if (heroInput && heroPhoto) {
    // Load saved
    const saved = localStorage.getItem('profile_photo');
    if (saved) {
      const initials = heroPhoto.querySelector('.profile-initials');
      if (initials) initials.style.display = 'none';
      setImageInContainer(heroPhoto, saved);
    }

    heroInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const src = await readImageFile(file);
        localStorage.setItem('profile_photo', src);
        const initials = heroPhoto.querySelector('.profile-initials');
        if (initials) initials.style.display = 'none';
        setImageInContainer(heroPhoto, src);
        showToast('تم رفع الصورة الشخصية بنجاح! 📸', 'success');
      } catch { showToast('فشل تحميل الصورة', 'error'); }
    });
  }

  // About photo
  const aboutInput = document.getElementById('aboutPhotoInput');
  const aboutPhoto = document.getElementById('aboutPhoto');

  if (aboutInput && aboutPhoto) {
    const savedAbout = localStorage.getItem('about_photo');
    if (savedAbout) {
      const span = aboutPhoto.querySelector('span');
      if (span) span.style.display = 'none';
      setImageInContainer(aboutPhoto, savedAbout);
    }

    aboutInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const src = await readImageFile(file);
        localStorage.setItem('about_photo', src);
        const span = aboutPhoto.querySelector('span');
        if (span) span.style.display = 'none';
        setImageInContainer(aboutPhoto, src);
        showToast('تم رفع الصورة بنجاح! 📸', 'success');
      } catch { showToast('فشل تحميل الصورة', 'error'); }
    });
  }
}

/** ============================
 *  MODAL CLOSE ON OVERLAY CLICK
 * ============================ */
function initModalClose() {
  document.getElementById('projectModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeProjectModal();
  });
  document.getElementById('addProjectModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeAddProjectModal();
  });

  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeAddProjectModal();
    }
  });
}

/** ============================
 *  SMOOTH SCROLL
 * ============================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/** ============================
 *  BACK TO TOP
 * ============================ */
function initBackToTop() {
  // Dynamically create button
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  btn.title = 'العودة للأعلى';
  btn.style.cssText = `
    position:fixed; bottom:2rem; right:2rem; width:48px; height:48px;
    background:var(--gradient-primary); color:white; border:none;
    border-radius:50%; font-size:1rem; cursor:pointer; z-index:999;
    box-shadow:var(--shadow-glow); opacity:0; transform:translateY(20px);
    transition:var(--transition); display:flex; align-items:center; justify-content:center;
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 400) {
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
    } else {
      btn.style.opacity = '0';
      btn.style.transform = 'translateY(20px)';
    }
  }, 100));

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/** ============================
 *  INIT ALL
 * ============================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initSmoothScroll();
  initCursor();
  initScrollReveal();
  initSkillBars();
  initLangBars();
  initCounters();
  initTypingEffect();
  initProjectFilter();
  bindProjectImageUploads();
  loadSavedProjectImages();
  initPhotoUploads();
  initModalClose();
  initBackToTop();
});
