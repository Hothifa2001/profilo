/* ===== VIEWER.JS — منطق صفحة العرض العامة ===== */
/* لا يحتوي على أي أدوات تعديل — للزوار فقط */

/* -------------------------------------------------------
   بناء الصفحة من البيانات
------------------------------------------------------- */
function buildPage() {
  const d = APP_DATA;
  buildProfile(d.profile);
  buildSkills(d.skills);
  buildProjects(d.projects);
  buildExperience(d.experience, d.education);
  buildAwards(d.awards);
  buildContact(d.profile);
}

/* --- الملف الشخصي / Hero --- */
function buildProfile(p) {
  // الاسم والعنوان
  setTxt('heroName', p.name);
  setTxt('heroTitle', p.title);
  setTxt('heroBio', p.bio);
  setTxt('aboutName', p.name);
  setTxt('aboutTitle', p.title);
  setTxt('aboutBio', p.bio);
  setTxt('aboutLocation', p.location);

  // الإحصاءات
  setAttr('[data-count="exp"]', 'data-count', p.stats.experience);
  setAttr('[data-count="proj"]', 'data-count', p.stats.projects);
  setAttr('[data-count="aw"]', 'data-count', p.stats.awards);

  // الصور
  if (p.photo) {
    showPhoto('profilePhoto', 'profile-initials', p.photo);
    showPhoto('profilePhoto2', 'profile-initials2', p.photo);
  }
  if (p.aboutPhoto) showAboutPhoto(p.aboutPhoto);
}

function showPhoto(containerId, initialsClass, src) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const init = el.querySelector('.' + initialsClass);
  if (init) init.style.display = 'none';
  let img = el.querySelector('img');
  if (!img) { img = document.createElement('img'); el.insertBefore(img, el.firstChild); }
  img.src = src;
}

function showAboutPhoto(src) {
  const el = document.getElementById('aboutPhotoDisplay');
  if (!el) return;
  el.style.backgroundImage = `url(${src})`;
  el.style.backgroundSize = 'cover';
  el.style.backgroundPosition = 'center';
  const span = el.querySelector('span');
  if (span) span.style.display = 'none';
}

/* --- المهارات --- */
function buildSkills(skills) {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = skills.map((s, i) => `
    <div class="skill-card reveal-up delay-${(i % 4) + 1}">
      <div class="skill-card-icon"><i class="${s.icon}"></i></div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <div class="skill-progress">
        <div class="progress-bar" data-width="${s.pct}"></div>
      </div>
      <span class="skill-pct">${s.pct}%</span>
    </div>
  `).join('');
}

/* --- المشاريع --- */
function buildProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = projects.map((p, i) => {
    const img = p.mainImage
      ? `<img src="${p.mainImage}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" />`
      : `<div class="proj-placeholder"><i class="fas ${p.icon}"></i></div>`;

    const award = p.award
      ? `<div class="project-award-badge"><i class="fas fa-trophy"></i> ${p.award}</div>` : '';

    const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');

    return `
      <article class="project-card reveal-up delay-${(i % 3) + 1}" data-category="${p.category}">
        <div class="project-image-wrapper">
          <div class="project-img">${img}</div>
          <div class="project-overlay">
            <button class="proj-link-btn" onclick="openViewModal('${p.id}')">
              <i class="fas fa-eye"></i> عرض التفاصيل
            </button>
          </div>
          ${award}
        </div>
        <div class="project-body">
          <div class="project-tags">${tags}</div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
        </div>
      </article>`;
  }).join('');

  initProjectFilter();
}

/* --- الخبرات والتعليم --- */
function buildExperience(exp, edu) {
  const timeline = document.getElementById('timelineEl');
  if (timeline) {
    timeline.innerHTML = exp.map(e => {
      const duties = e.duties.map(d => `<li>${d}</li>`).join('');
      const badge = e.current ? `<span class="timeline-status current">الوظيفة الحالية</span>` : '';
      return `
        <div class="timeline-item reveal-up">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <div class="timeline-icon"><i class="fas ${e.icon}"></i></div>
              <div><h3 class="timeline-title">${e.role}</h3>
                <span class="timeline-company">${e.company}</span>
              </div>
              <span class="timeline-date">${e.period}</span>
            </div>
            <ul class="timeline-duties">${duties}</ul>
            ${badge}
          </div>
        </div>`;
    }).join('');
  }

  const eduGrid = document.getElementById('educationGrid');
  if (eduGrid) {
    eduGrid.innerHTML = edu.map((e, i) => `
      <div class="edu-card reveal-up delay-${i + 1}">
        <div class="edu-icon"><i class="fas ${e.icon}"></i></div>
        <div class="edu-body">
          <h3>${e.degree}</h3>
          <p class="edu-inst">${e.institution}</p>
          <span class="edu-date">${e.date}</span>
        </div>
      </div>`).join('');
  }
}

/* --- الجوائز --- */
function buildAwards(awards) {
  const grid = document.getElementById('awardsGrid');
  if (!grid) return;
  grid.innerHTML = awards.map((a, i) => `
    <div class="award-card reveal-up delay-${i + 1}">
      <div class="award-glow"></div>
      <div class="award-icon"><i class="fas ${a.icon}"></i></div>
      <h3>${a.title}</h3>
      <p>${a.org ? a.org + ' | ' : ''}${a.date}</p>
      <span class="award-desc">${a.desc}</span>
    </div>`).join('');
}

/* --- التواصل --- */
function buildContact(p) {
  setTxt('contactEmail', p.email);
  setTxt('contactPhone', p.phone);
  setTxt('contactLocation', p.location);
  setHref('contactEmailLink', `mailto:${p.email}`);
  setHref('contactPhoneLink', `tel:${p.phone}`);
  setHref('contactLinkedIn', `https://linkedin.com/in/${p.linkedin}`);
  setHref('footerLinkedIn', `https://linkedin.com/in/${p.linkedin}`);
  setHref('heroLinkedIn', `https://linkedin.com/in/${p.linkedin}`);
  setHref('heroEmailLink', `mailto:${p.email}`);
  setHref('heroPhoneLink', `tel:${p.phone}`);
  setTxt('footerName', p.name);
  setTxt('footerTitle', p.title);
}

/* -------------------------------------------------------
   مودال تفاصيل المشروع (Viewer - عرض فقط مع معرض صور)
------------------------------------------------------- */
let _galleryIndex = 0;
let _galleryImages = [];

function openViewModal(projId) {
  const p = APP_DATA.projects.find(x => x.id === projId);
  if (!p) return;

  // بناء قائمة الصور (الرئيسية + المعرض)
  _galleryImages = [];
  if (p.mainImage) _galleryImages.push(p.mainImage);
  if (p.gallery && p.gallery.length) _galleryImages.push(...p.gallery);
  _galleryIndex = 0;

  const modal = document.getElementById('viewModal');
  const content = document.getElementById('viewModalContent');

  const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
  const highlights = p.highlights.map(h => `<li>${h}</li>`).join('');
  const award = p.award ? `<div class="project-award-badge" style="position:static;display:inline-flex;margin-bottom:1rem;"><i class="fas fa-trophy"></i> ${p.award}</div>` : '';
  const urlBtn = p.url ? `<a href="${p.url}" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> زيارة المشروع</a>` : '';

  // معرض الصور
  const galleryHTML = buildGalleryHTML(_galleryImages, _galleryIndex);

  content.innerHTML = `
    <div id="gallerySection">${galleryHTML}</div>
    ${award}
    <div class="project-tags" style="margin-bottom:1rem;">${tags}</div>
    <h2 style="font-size:1.5rem;font-weight:800;color:var(--text-primary);margin-bottom:.75rem;">${p.title}</h2>
    <p style="color:var(--text-secondary);line-height:1.8;margin-bottom:1.5rem;">${p.desc}</p>
    ${highlights ? `<h4 style="color:var(--primary);font-size:1rem;font-weight:700;margin-bottom:.75rem;">أبرز المميزات:</h4><ul class="timeline-duties">${highlights}</ul>` : ''}
    <div style="display:flex;align-items:center;gap:1rem;margin-top:1.5rem;flex-wrap:wrap;">
      <span style="background:rgba(14,165,233,0.1);border:1px solid var(--border);color:var(--text-muted);padding:.4rem 1rem;border-radius:var(--radius-full);font-size:.85rem;">
        <i class="fas fa-calendar"></i> ${p.year}
      </span>
      ${urlBtn}
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function buildGalleryHTML(images, activeIdx) {
  if (!images.length) return `<div style="height:200px;background:var(--bg-secondary);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;color:var(--text-muted);font-size:.9rem;margin-bottom:1.5rem;"><i class="fas fa-image" style="font-size:2rem;"></i></div>`;

  const main = `
    <div class="gallery-main" style="position:relative;border-radius:var(--radius-lg);overflow:hidden;margin-bottom:.75rem;background:var(--bg-secondary);">
      <img id="galleryMainImg" src="${images[activeIdx]}" alt="صورة المشروع"
        style="width:100%;height:280px;object-fit:contain;display:block;background:var(--bg-dark);" />
      ${images.length > 1 ? `
        <button onclick="galleryPrev()" style="position:absolute;top:50%;right:12px;transform:translateY(-50%);width:36px;height:36px;background:rgba(0,0,0,.6);border:1px solid var(--border);border-radius:50%;color:white;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;z-index:2;"><i class="fas fa-chevron-right"></i></button>
        <button onclick="galleryNext()" style="position:absolute;top:50%;left:12px;transform:translateY(-50%);width:36px;height:36px;background:rgba(0,0,0,.6);border:1px solid var(--border);border-radius:50%;color:white;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;z-index:2;"><i class="fas fa-chevron-left"></i></button>
        <div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.6);color:white;padding:.2rem .75rem;border-radius:var(--radius-full);font-size:.8rem;">${activeIdx + 1} / ${images.length}</div>
      ` : ''}
    </div>`;

  const thumbs = images.length > 1 ? `
    <div class="gallery-thumbs" style="display:flex;gap:.5rem;overflow-x:auto;padding-bottom:.5rem;margin-bottom:1.5rem;scrollbar-width:thin;">
      ${images.map((img, i) => `
        <img src="${img}" onclick="galleryGoto(${i})"
          style="width:72px;height:52px;object-fit:cover;border-radius:var(--radius-sm);cursor:pointer;border:2px solid ${i === activeIdx ? 'var(--primary)' : 'transparent'};opacity:${i === activeIdx ? '1' : '0.6'};flex-shrink:0;transition:.2s;background:var(--bg-dark);" />
      `).join('')}
    </div>` : '<div style="margin-bottom:1.5rem;"></div>';

  return main + thumbs;
}

function refreshGallery() {
  const section = document.getElementById('gallerySection');
  if (section) section.innerHTML = buildGalleryHTML(_galleryImages, _galleryIndex);
}

function galleryPrev() {
  _galleryIndex = (_galleryIndex - 1 + _galleryImages.length) % _galleryImages.length;
  refreshGallery();
}

function galleryNext() {
  _galleryIndex = (_galleryIndex + 1) % _galleryImages.length;
  refreshGallery();
}

function galleryGoto(i) {
  _galleryIndex = i;
  refreshGallery();
}

function closeViewModal() {
  document.getElementById('viewModal').classList.remove('active');
  document.body.style.overflow = '';
}

/* -------------------------------------------------------
   تصفية المشاريع
------------------------------------------------------- */
function initProjectFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.project-card').forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        card.classList.toggle('hidden', filter !== 'all' && !cat.includes(filter));
      });
    });
  });
}

/* -------------------------------------------------------
   مساعدات DOM
------------------------------------------------------- */
function setTxt(id, val) { const el = document.getElementById(id); if (el) el.textContent = val ?? ''; }
function setAttr(sel, attr, val) { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); }
function setHref(id, val) { const el = document.getElementById(id); if (el) el.href = val; }

/* -------------------------------------------------------
   تهيئة الصفحة
------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  buildPage();

  /* Scroll reveal, skill bars, etc. are in animations.js */
  initLoader();
  initNavbar();
  initSmoothScroll();
  initCursor();
  initScrollReveal();
  initSkillBars();
  initLangBars();
  initCounters();
  initTypingEffect(APP_DATA.profile.roles);
  initBackToTop();

  /* Modal close */
  document.getElementById('viewModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeViewModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeViewModal();
    if (e.key === 'ArrowRight') galleryPrev();
    if (e.key === 'ArrowLeft') galleryNext();
  });
});
