/* ===== MANAGER.JS — لوحة التحكم الكاملة ===== */

/* -------------------------------------------------------
   حالة التعديل
------------------------------------------------------- */
let _editingProjId  = null;   // null = إضافة جديدة
let _editingSkillId = null;
let _editingAwardId = null;
let _editingExpId   = null;
let _editingEduId   = null;
let _mgr_galleryImages = [];
let _mgr_galleryIndex  = 0;
let _viewProjId     = null;   // للعرض في المودال

/* -------------------------------------------------------
   بناء الصفحة (نفس viewer + أزرار التحكم)
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

/* --- الملف الشخصي --- */
function buildProfile(p) {
  setTxt('heroName', p.name);
  setTxt('heroTitle', p.title);
  setTxt('heroBio', p.bio);
  setTxt('aboutName', p.name);
  setTxt('aboutTitle', p.title);
  setTxt('aboutBio', p.bio);
  setTxt('aboutLocation', p.location);
  setAttr('[data-count="exp"]', 'data-count', p.stats.experience);
  setAttr('[data-count="proj"]', 'data-count', p.stats.projects);
  setAttr('[data-count="aw"]', 'data-count', p.stats.awards);

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
  let img = el.querySelector('img.user-photo');
  if (!img) {
    img = document.createElement('img');
    img.className = 'user-photo';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;inset:0;border-radius:50%;';
    el.insertBefore(img, el.firstChild);
  }
  img.src = src;
}

function showAboutPhoto(src) {
  const el = document.getElementById('aboutPhotoDisplay');
  if (!el) return;
  el.style.cssText = `background:url(${src}) center/cover; height:320px;`;
  const span = el.querySelector('span');
  if (span) span.style.display = 'none';
  const btn = el.querySelector('.photo-upload-sm');
  if (btn) btn.style.zIndex = '2';
}

/* --- المهارات --- */
function buildSkills(skills) {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = skills.map((s, i) => `
    <div class="skill-card reveal-up delay-${(i % 4) + 1}" data-skill-id="${s.id}">
      <div class="mgr-card-actions">
        <button class="mgr-action-btn edit" onclick="openSkillForm('${s.id}')" title="تعديل"><i class="fas fa-pen"></i></button>
        <button class="mgr-action-btn delete" onclick="deleteSkill('${s.id}')" title="حذف"><i class="fas fa-trash"></i></button>
      </div>
      <div class="skill-card-icon"><i class="${s.icon}"></i></div>
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <div class="skill-progress"><div class="progress-bar" data-width="${s.pct}"></div></div>
      <span class="skill-pct">${s.pct}%</span>
    </div>
  `).join('') + `
    <div class="project-card project-add" onclick="openSkillForm(null)">
      <div class="add-project-inner">
        <div class="add-icon"><i class="fas fa-plus"></i></div>
        <h3>إضافة مهارة</h3>
      </div>
    </div>`;
}

/* --- المشاريع --- */
function buildProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = projects.map((p, i) => {
    const img = p.mainImage
      ? `<img src="${p.mainImage}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" />`
      : `<div class="proj-placeholder"><i class="fas ${p.icon}"></i></div>`;
    const award = p.award ? `<div class="project-award-badge"><i class="fas fa-trophy"></i> ${p.award}</div>` : '';
    const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
    const galCount = (p.gallery || []).length;
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
          ${galCount ? `<div class="gal-count-badge"><i class="fas fa-images"></i> ${galCount + (p.mainImage ? 1 : 0)}</div>` : ''}
        </div>
        <div class="project-body">
          <div class="project-tags">${tags}</div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
        </div>
      </article>`;
  }).join('') + `
    <article class="project-card project-add" id="addProjectCard" onclick="openProjectForm(null)">
      <div class="add-project-inner">
        <div class="add-icon"><i class="fas fa-plus"></i></div>
        <h3>أضف مشروعاً جديداً</h3>
        <p>اضغط لإضافة مشروع جديد</p>
      </div>
    </article>`;

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
          <div class="timeline-content" style="position:relative;">
            <div class="mgr-card-actions">
              <button class="mgr-action-btn edit" onclick="openExpForm('${e.id}')" title="تعديل"><i class="fas fa-pen"></i></button>
              <button class="mgr-action-btn delete" onclick="deleteExp('${e.id}')" title="حذف"><i class="fas fa-trash"></i></button>
            </div>
            <div class="timeline-header">
              <div class="timeline-icon"><i class="fas ${e.icon}"></i></div>
              <div><h3 class="timeline-title">${e.role}</h3><span class="timeline-company">${e.company}</span></div>
              <span class="timeline-date">${e.period}</span>
            </div>
            <ul class="timeline-duties">${duties}</ul>${badge}
          </div>
        </div>`;
    }).join('') + `
      <div style="text-align:center;margin-top:1.5rem;">
        <button class="btn btn-outline" onclick="openExpForm(null)"><i class="fas fa-plus"></i> إضافة خبرة</button>
      </div>`;
  }

  const eduGrid = document.getElementById('educationGrid');
  if (eduGrid) {
    eduGrid.innerHTML = edu.map((e, i) => `
      <div class="edu-card reveal-up delay-${i + 1}" style="position:relative;">
        <div class="mgr-card-actions">
          <button class="mgr-action-btn edit" onclick="openEduForm('${e.id}')" title="تعديل"><i class="fas fa-pen"></i></button>
          <button class="mgr-action-btn delete" onclick="deleteEdu('${e.id}')" title="حذف"><i class="fas fa-trash"></i></button>
        </div>
        <div class="edu-icon"><i class="fas ${e.icon}"></i></div>
        <div class="edu-body"><h3>${e.degree}</h3><p class="edu-inst">${e.institution}</p><span class="edu-date">${e.date}</span></div>
      </div>`).join('') + `
      <div style="margin-top:.5rem;">
        <button class="btn btn-outline" onclick="openEduForm(null)" style="width:100%;"><i class="fas fa-plus"></i> إضافة شهادة / دورة</button>
      </div>`;
  }
}

/* --- الجوائز --- */
function buildAwards(awards) {
  const grid = document.getElementById('awardsGrid');
  if (!grid) return;
  grid.innerHTML = awards.map((a, i) => `
    <div class="award-card reveal-up delay-${i + 1}" style="position:relative;">
      <div class="mgr-card-actions">
        <button class="mgr-action-btn edit" onclick="openAwardForm('${a.id}')" title="تعديل"><i class="fas fa-pen"></i></button>
        <button class="mgr-action-btn delete" onclick="deleteAward('${a.id}')" title="حذف"><i class="fas fa-trash"></i></button>
      </div>
      <div class="award-glow"></div>
      <div class="award-icon"><i class="fas ${a.icon}"></i></div>
      <h3>${a.title}</h3>
      <p>${a.org ? a.org + ' | ' : ''}${a.date}</p>
      <span class="award-desc">${a.desc}</span>
    </div>`).join('') + `
    <div class="award-card" style="display:flex;align-items:center;justify-content:center;cursor:pointer;border-style:dashed;" onclick="openAwardForm(null)">
      <div style="text-align:center;"><div class="add-icon" style="margin:0 auto 1rem;"><i class="fas fa-plus"></i></div><h3>إضافة جائزة</h3></div>
    </div>`;
}

/* --- التواصل --- */
function buildContact(p) {
  setTxt('contactEmail', p.email);
  setTxt('contactPhone', p.phone);
  setTxt('contactLocation', p.location);
  setHref('contactEmailLink', `mailto:${p.email}`);
  setHref('heroEmailLink',    `mailto:${p.email}`);
  setHref('contactPhoneLink', `tel:${p.phone}`);
  setHref('heroPhoneLink',    `tel:${p.phone}`);
  setHref('contactLinkedIn',  `https://linkedin.com/in/${p.linkedin}`);
  setHref('footerLinkedIn',   `https://linkedin.com/in/${p.linkedin}`);
  setHref('heroLinkedIn',     `https://linkedin.com/in/${p.linkedin}`);
  if (p.github) {
    const ghUrl = `https://github.com/${p.github}`;
    document.querySelectorAll('a[href*="github.com"]').forEach(a => a.href = ghUrl);
  }
  setTxt('footerName', p.name);
  setTxt('footerTitle', p.title);
}

/* -------------------------------------------------------
   مودال عرض تفاصيل المشروع (مع معرض صور)
------------------------------------------------------- */
let _viewGalleryImages = [];
let _viewGalleryIndex  = 0;

function openViewModal(projId) {
  _viewProjId = projId;
  const p = APP_DATA.projects.find(x => x.id === projId);
  if (!p) return;

  _viewGalleryImages = [];
  if (p.mainImage) _viewGalleryImages.push(p.mainImage);
  if (p.gallery?.length) _viewGalleryImages.push(...p.gallery);
  _viewGalleryIndex = 0;

  const modal = document.getElementById('viewModal');
  const content = document.getElementById('viewModalContent');

  const tags = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
  const highlights = p.highlights.map(h => `<li>${h}</li>`).join('');
  const award = p.award ? `<div class="project-award-badge" style="position:static;display:inline-flex;margin-bottom:1rem;"><i class="fas fa-trophy"></i> ${p.award}</div>` : '';
  const urlBtn = p.url ? `<a href="${p.url}" target="_blank" class="btn btn-primary"><i class="fas fa-external-link-alt"></i> زيارة المشروع</a>` : '';

  content.innerHTML = `
    <div id="viewGallerySection">${buildViewGalleryHTML()}</div>
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
    <div style="display:flex;gap:.75rem;margin-top:1.75rem;padding-top:1.25rem;border-top:1px solid var(--border);">
      <button onclick="closeViewModal();openProjectForm('${p.id}')"
        style="flex:1;display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1rem;border-radius:var(--radius-md);background:rgba(14,165,233,.12);border:1px solid rgba(14,165,233,.35);color:var(--primary-light);font-family:Cairo,sans-serif;font-size:.95rem;font-weight:700;cursor:pointer;transition:.25s;"
        onmouseover="this.style.background='var(--primary)';this.style.color='white';"
        onmouseout="this.style.background='rgba(14,165,233,.12)';this.style.color='var(--primary-light)';">
        <i class="fas fa-pen"></i> تعديل المشروع
      </button>
      <button onclick="if(confirm('هل أنت متأكد من حذف هذا المشروع؟')){closeViewModal();deleteProject('${p.id}')}"
        style="flex:1;display:flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1rem;border-radius:var(--radius-md);background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);color:#f87171;font-family:Cairo,sans-serif;font-size:.95rem;font-weight:700;cursor:pointer;transition:.25s;"
        onmouseover="this.style.background='var(--danger)';this.style.color='white';"
        onmouseout="this.style.background='rgba(239,68,68,.08)';this.style.color='#f87171';">
        <i class="fas fa-trash"></i> حذف المشروع
      </button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function buildViewGalleryHTML() {
  const images = _viewGalleryImages;
  const idx = _viewGalleryIndex;

  if (!images.length) return `<div style="height:200px;background:var(--bg-secondary);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;color:var(--text-muted);margin-bottom:1.5rem;font-size:.9rem;gap:.5rem;"><i class="fas fa-image" style="font-size:2rem;opacity:.4;"></i></div>`;

  const arrows = images.length > 1 ? `
    <button onclick="viewGalleryPrev()" style="position:absolute;top:50%;right:10px;transform:translateY(-50%);width:36px;height:36px;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.2);border-radius:50%;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:3;"><i class="fas fa-chevron-right"></i></button>
    <button onclick="viewGalleryNext()" style="position:absolute;top:50%;left:10px;transform:translateY(-50%);width:36px;height:36px;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.2);border-radius:50%;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:3;"><i class="fas fa-chevron-left"></i></button>
    <div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.6);color:white;padding:.2rem .75rem;border-radius:999px;font-size:.8rem;z-index:3;">${idx + 1} / ${images.length}</div>` : '';

  const thumbs = images.length > 1 ? `
    <div style="display:flex;gap:.5rem;overflow-x:auto;padding:.25rem .25rem .75rem;scrollbar-width:thin;margin-bottom:1.5rem;">
      ${images.map((img, i) => `<img src="${img}" onclick="viewGalleryGoto(${i})" style="width:72px;height:52px;object-fit:cover;border-radius:8px;cursor:pointer;border:2px solid ${i === idx ? 'var(--primary)' : 'transparent'};opacity:${i === idx ? '1' : '.55'};flex-shrink:0;transition:.2s;background:var(--bg-dark);" />`).join('')}
    </div>` : '<div style="margin-bottom:1.5rem;"></div>';

  return `
    <div style="position:relative;border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-dark);margin-bottom:.75rem;">
      <img id="viewMainImg" src="${images[idx]}" style="width:100%;height:280px;object-fit:contain;display:block;" />
      ${arrows}
    </div>
    ${thumbs}`;
}

function refreshViewGallery() {
  const s = document.getElementById('viewGallerySection');
  if (s) s.innerHTML = buildViewGalleryHTML();
}
function viewGalleryPrev() { _viewGalleryIndex = (_viewGalleryIndex - 1 + _viewGalleryImages.length) % _viewGalleryImages.length; refreshViewGallery(); }
function viewGalleryNext() { _viewGalleryIndex = (_viewGalleryIndex + 1) % _viewGalleryImages.length; refreshViewGallery(); }
function viewGalleryGoto(i) { _viewGalleryIndex = i; refreshViewGallery(); }

function closeViewModal() {
  document.getElementById('viewModal').classList.remove('active');
  document.body.style.overflow = '';
}

/* -------------------------------------------------------
   فورم المشروع (إضافة / تعديل + رفع صور)
------------------------------------------------------- */
let _formGallery    = [];  // صور المعرض المؤقتة
let _formMainImg    = null;

function openProjectForm(projId) {
  _editingProjId = projId;
  const isEdit = projId !== null;
  const p = isEdit ? APP_DATA.projects.find(x => x.id === projId) : null;

  _formMainImg = p?.mainImage || null;
  _formGallery = p ? [...(p.gallery || [])] : [];

  const modal = document.getElementById('projectFormModal');
  document.getElementById('projFormTitle').textContent = isEdit ? 'تعديل المشروع' : 'إضافة مشروع جديد';
  document.getElementById('pfName').value       = p?.title || '';
  document.getElementById('pfDesc').value       = p?.desc || '';
  document.getElementById('pfTags').value       = p?.tags?.join(', ') || '';
  document.getElementById('pfCat').value        = p?.category || 'web';
  document.getElementById('pfYear').value       = p?.year || new Date().getFullYear();
  document.getElementById('pfUrl').value        = p?.url || '';
  document.getElementById('pfAward').value      = p?.award || '';
  document.getElementById('pfHighlights').value = p?.highlights?.join('\n') || '';

  renderFormMainImg();
  renderFormGallery();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectForm() {
  document.getElementById('projectFormModal').classList.remove('active');
  document.body.style.overflow = '';
}

function renderFormMainImg() {
  const el = document.getElementById('pfMainImgPreview');
  if (!el) return;
  el.innerHTML = _formMainImg
    ? `<div style="position:relative;display:inline-block;">
        <img src="${_formMainImg}" style="width:120px;height:90px;object-fit:cover;border-radius:var(--radius-sm);border:2px solid var(--primary);" />
        <button type="button" onclick="removeFormMainImg()" style="position:absolute;top:-6px;left:-6px;width:22px;height:22px;background:var(--danger);border-radius:50%;color:white;border:none;cursor:pointer;font-size:.7rem;display:flex;align-items:center;justify-content:center;"><i class="fas fa-times"></i></button>
       </div>`
    : `<label class="gallery-add-btn" style="width:120px;height:90px;cursor:pointer;border:2px dashed var(--border);border-radius:var(--radius-sm);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.3rem;color:var(--text-muted);font-size:.8rem;">
         <i class="fas fa-camera" style="font-size:1.5rem;"></i><span>الصورة الرئيسية</span>
         <input type="file" accept="image/*" hidden onchange="handleFormMainImg(this)" />
       </label>`;
}

function renderFormGallery() {
  const el = document.getElementById('pfGalleryPreview');
  if (!el) return;
  const items = _formGallery.map((src, i) => `
    <div style="position:relative;display:inline-block;">
      <img src="${src}" style="width:80px;height:60px;object-fit:cover;border-radius:var(--radius-sm);border:1px solid var(--border);" />
      <button type="button" onclick="removeFormGalleryImg(${i})" style="position:absolute;top:-5px;left:-5px;width:18px;height:18px;background:var(--danger);border-radius:50%;color:white;border:none;cursor:pointer;font-size:.6rem;display:flex;align-items:center;justify-content:center;"><i class="fas fa-times"></i></button>
    </div>`).join('');

  el.innerHTML = items + `
    <label class="gallery-add-btn" style="width:80px;height:60px;cursor:pointer;border:2px dashed var(--border);border-radius:var(--radius-sm);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2rem;color:var(--text-muted);font-size:.7rem;">
      <i class="fas fa-plus" style="font-size:1.2rem;"></i><span>إضافة</span>
      <input type="file" accept="image/*" hidden multiple onchange="handleFormGalleryImgs(this)" />
    </label>`;
}

async function handleFormMainImg(input) {
  const file = input.files[0];
  if (!file) return;
  try {
    _formMainImg = await readImageFile(file);
    renderFormMainImg();
  } catch { showToast('فشل تحميل الصورة', 'error'); }
}

async function handleFormGalleryImgs(input) {
  const files = Array.from(input.files);
  for (const file of files) {
    try {
      const src = await readImageFile(file);
      _formGallery.push(src);
    } catch { /* skip */ }
  }
  renderFormGallery();
}

function removeFormMainImg() { _formMainImg = null; renderFormMainImg(); }
function removeFormGalleryImg(i) { _formGallery.splice(i, 1); renderFormGallery(); }

async function saveProjectForm(e) {
  e.preventDefault();
  const name = document.getElementById('pfName').value.trim();
  const desc = document.getElementById('pfDesc').value.trim();
  if (!name || !desc) { showToast('يرجى ملء الاسم والوصف', 'error'); return; }

  const tags = document.getElementById('pfTags').value.split(',').map(t => t.trim()).filter(Boolean);
  const highlights = document.getElementById('pfHighlights').value.split('\n').map(h => h.trim()).filter(Boolean);

  const projData = {
    title:     name,
    desc,
    tags,
    category:  document.getElementById('pfCat').value,
    year:      document.getElementById('pfYear').value,
    url:       document.getElementById('pfUrl').value.trim(),
    award:     document.getElementById('pfAward').value.trim(),
    highlights,
    mainImage: _formMainImg,
    gallery:   [..._formGallery],
    icon:      'fa-code',
  };

  if (_editingProjId) {
    // تعديل
    const idx = APP_DATA.projects.findIndex(p => p.id === _editingProjId);
    if (idx !== -1) APP_DATA.projects[idx] = { ...APP_DATA.projects[idx], ...projData };
    showToast('تم تحديث المشروع بنجاح ✅', 'success');
  } else {
    // إضافة
    APP_DATA.projects.push({ id: genId('p'), ...projData });
    showToast('تمت إضافة المشروع بنجاح 🚀', 'success');
  }

  Storage.save(APP_DATA);
  closeProjectForm();
  buildProjects(APP_DATA.projects);
  initScrollReveal();
  initSkillBars();
}

function deleteProject(projId) {
  if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
  APP_DATA.projects = APP_DATA.projects.filter(p => p.id !== projId);
  Storage.save(APP_DATA);
  buildProjects(APP_DATA.projects);
  showToast('تم حذف المشروع', 'success');
}

/* -------------------------------------------------------
   فورم المهارات
------------------------------------------------------- */
function openSkillForm(skillId) {
  _editingSkillId = skillId;
  const s = skillId ? APP_DATA.skills.find(x => x.id === skillId) : null;
  document.getElementById('sfTitle').textContent = s ? 'تعديل المهارة' : 'إضافة مهارة جديدة';
  document.getElementById('sfName').value  = s?.name || '';
  document.getElementById('sfDesc').value  = s?.desc || '';
  document.getElementById('sfIcon').value  = s?.icon || 'fas fa-code';
  document.getElementById('sfPct').value   = s?.pct  || 80;
  document.getElementById('skillFormModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSkillForm() {
  document.getElementById('skillFormModal').classList.remove('active');
  document.body.style.overflow = '';
}

function saveSkillForm(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('sfName').value.trim(),
    desc: document.getElementById('sfDesc').value.trim(),
    icon: document.getElementById('sfIcon').value.trim(),
    pct:  parseInt(document.getElementById('sfPct').value),
  };
  if (!data.name) { showToast('اسم المهارة مطلوب', 'error'); return; }

  if (_editingSkillId) {
    const idx = APP_DATA.skills.findIndex(s => s.id === _editingSkillId);
    if (idx !== -1) APP_DATA.skills[idx] = { ...APP_DATA.skills[idx], ...data };
    showToast('تم تحديث المهارة ✅', 'success');
  } else {
    APP_DATA.skills.push({ id: genId('s'), ...data });
    showToast('تمت إضافة المهارة 🚀', 'success');
  }
  Storage.save(APP_DATA);
  closeSkillForm();
  buildSkills(APP_DATA.skills);
  initSkillBars();
}

function deleteSkill(skillId) {
  if (!confirm('حذف هذه المهارة؟')) return;
  APP_DATA.skills = APP_DATA.skills.filter(s => s.id !== skillId);
  Storage.save(APP_DATA);
  buildSkills(APP_DATA.skills);
  showToast('تم الحذف', 'success');
}

/* -------------------------------------------------------
   فورم الجوائز
------------------------------------------------------- */
function openAwardForm(awardId) {
  _editingAwardId = awardId;
  const a = awardId ? APP_DATA.awards.find(x => x.id === awardId) : null;
  document.getElementById('afTitle').textContent = a ? 'تعديل الجائزة' : 'إضافة جائزة جديدة';
  document.getElementById('afName').value  = a?.title || '';
  document.getElementById('afOrg').value   = a?.org   || '';
  document.getElementById('afDate').value  = a?.date  || '';
  document.getElementById('afDesc').value  = a?.desc  || '';
  document.getElementById('afIcon').value  = a?.icon  || 'fa-award';
  document.getElementById('awardFormModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAwardForm() {
  document.getElementById('awardFormModal').classList.remove('active');
  document.body.style.overflow = '';
}

function saveAwardForm(e) {
  e.preventDefault();
  const data = {
    title: document.getElementById('afName').value.trim(),
    org:   document.getElementById('afOrg').value.trim(),
    date:  document.getElementById('afDate').value.trim(),
    desc:  document.getElementById('afDesc').value.trim(),
    icon:  document.getElementById('afIcon').value.trim(),
  };
  if (!data.title) { showToast('اسم الجائزة مطلوب', 'error'); return; }

  if (_editingAwardId) {
    const idx = APP_DATA.awards.findIndex(a => a.id === _editingAwardId);
    if (idx !== -1) APP_DATA.awards[idx] = { ...APP_DATA.awards[idx], ...data };
    showToast('تم تحديث الجائزة ✅', 'success');
  } else {
    APP_DATA.awards.push({ id: genId('a'), ...data });
    showToast('تمت إضافة الجائزة 🚀', 'success');
  }
  Storage.save(APP_DATA);
  closeAwardForm();
  buildAwards(APP_DATA.awards);
}

function deleteAward(awardId) {
  if (!confirm('حذف هذه الجائزة؟')) return;
  APP_DATA.awards = APP_DATA.awards.filter(a => a.id !== awardId);
  Storage.save(APP_DATA);
  buildAwards(APP_DATA.awards);
  showToast('تم الحذف', 'success');
}

/* -------------------------------------------------------
   فورم الخبرة
------------------------------------------------------- */
function openExpForm(expId) {
  _editingExpId = expId;
  const e = expId ? APP_DATA.experience.find(x => x.id === expId) : null;
  document.getElementById('efTitle').textContent   = e ? 'تعديل الخبرة' : 'إضافة خبرة جديدة';
  document.getElementById('efRole').value          = e?.role    || '';
  document.getElementById('efCompany').value       = e?.company || '';
  document.getElementById('efPeriod').value        = e?.period  || '';
  document.getElementById('efCurrent').checked     = e?.current || false;
  document.getElementById('efIcon').value          = e?.icon    || 'fa-briefcase';
  document.getElementById('efDuties').value        = e?.duties?.join('\n') || '';
  document.getElementById('expFormModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeExpForm() {
  document.getElementById('expFormModal').classList.remove('active');
  document.body.style.overflow = '';
}

function saveExpForm(e) {
  e.preventDefault();
  const data = {
    role:    document.getElementById('efRole').value.trim(),
    company: document.getElementById('efCompany').value.trim(),
    period:  document.getElementById('efPeriod').value.trim(),
    current: document.getElementById('efCurrent').checked,
    icon:    document.getElementById('efIcon').value.trim(),
    duties:  document.getElementById('efDuties').value.split('\n').map(d => d.trim()).filter(Boolean),
  };
  if (!data.role) { showToast('المسمى الوظيفي مطلوب', 'error'); return; }

  if (_editingExpId) {
    const idx = APP_DATA.experience.findIndex(x => x.id === _editingExpId);
    if (idx !== -1) APP_DATA.experience[idx] = { ...APP_DATA.experience[idx], ...data };
    showToast('تم التحديث ✅', 'success');
  } else {
    APP_DATA.experience.push({ id: genId('e'), ...data });
    showToast('تمت الإضافة 🚀', 'success');
  }
  Storage.save(APP_DATA);
  closeExpForm();
  buildExperience(APP_DATA.experience, APP_DATA.education);
}

function deleteExp(expId) {
  if (!confirm('حذف هذه الخبرة؟')) return;
  APP_DATA.experience = APP_DATA.experience.filter(x => x.id !== expId);
  Storage.save(APP_DATA);
  buildExperience(APP_DATA.experience, APP_DATA.education);
  showToast('تم الحذف', 'success');
}

/* -------------------------------------------------------
   فورم التعليم
------------------------------------------------------- */
function openEduForm(eduId) {
  _editingEduId = eduId;
  const e = eduId ? APP_DATA.education.find(x => x.id === eduId) : null;
  document.getElementById('edTitle').textContent  = e ? 'تعديل الشهادة' : 'إضافة شهادة / دورة';
  document.getElementById('edDegree').value       = e?.degree      || '';
  document.getElementById('edInst').value         = e?.institution || '';
  document.getElementById('edDate').value         = e?.date        || '';
  document.getElementById('edIcon').value         = e?.icon        || 'fa-graduation-cap';
  document.getElementById('eduFormModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEduForm() {
  document.getElementById('eduFormModal').classList.remove('active');
  document.body.style.overflow = '';
}

function saveEduForm(e) {
  e.preventDefault();
  const data = {
    degree:      document.getElementById('edDegree').value.trim(),
    institution: document.getElementById('edInst').value.trim(),
    date:        document.getElementById('edDate').value.trim(),
    icon:        document.getElementById('edIcon').value.trim(),
  };
  if (!data.degree) { showToast('اسم الشهادة مطلوب', 'error'); return; }

  if (_editingEduId) {
    const idx = APP_DATA.education.findIndex(x => x.id === _editingEduId);
    if (idx !== -1) APP_DATA.education[idx] = { ...APP_DATA.education[idx], ...data };
    showToast('تم التحديث ✅', 'success');
  } else {
    APP_DATA.education.push({ id: genId('ed'), ...data });
    showToast('تمت الإضافة 🚀', 'success');
  }
  Storage.save(APP_DATA);
  closeEduForm();
  buildExperience(APP_DATA.experience, APP_DATA.education);
}

function deleteEdu(eduId) {
  if (!confirm('حذف هذه الشهادة؟')) return;
  APP_DATA.education = APP_DATA.education.filter(x => x.id !== eduId);
  Storage.save(APP_DATA);
  buildExperience(APP_DATA.experience, APP_DATA.education);
  showToast('تم الحذف', 'success');
}

/* -------------------------------------------------------
   تعديل الملف الشخصي
------------------------------------------------------- */
function openProfileForm() {
  const p = APP_DATA.profile;
  document.getElementById('prfName').value     = p.name;
  document.getElementById('prfTitle').value    = p.title;
  document.getElementById('prfBio').value      = p.bio;
  document.getElementById('prfLocation').value = p.location;
  document.getElementById('prfEmail').value    = p.email;
  document.getElementById('prfPhone').value    = p.phone;
  document.getElementById('prfLinkedin').value = p.linkedin;
  document.getElementById('prfGithub').value   = p.github || '';
  document.getElementById('prfExpStat').value  = p.stats.experience;
  document.getElementById('prfProjStat').value = p.stats.projects;
  document.getElementById('prfAwStat').value   = p.stats.awards;
  document.getElementById('prfRoles').value    = p.roles.join('\n');
  document.getElementById('profileFormModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProfileForm() {
  document.getElementById('profileFormModal').classList.remove('active');
  document.body.style.overflow = '';
}

async function saveProfileForm(e) {
  e.preventDefault();
  const p = APP_DATA.profile;
  p.name     = document.getElementById('prfName').value.trim();
  p.title    = document.getElementById('prfTitle').value.trim();
  p.bio      = document.getElementById('prfBio').value.trim();
  p.location = document.getElementById('prfLocation').value.trim();
  p.email    = document.getElementById('prfEmail').value.trim();
  p.phone    = document.getElementById('prfPhone').value.trim();
  p.linkedin = document.getElementById('prfLinkedin').value.trim();
  p.github   = document.getElementById('prfGithub').value.trim();
  p.stats.experience = parseInt(document.getElementById('prfExpStat').value) || 0;
  p.stats.projects   = parseInt(document.getElementById('prfProjStat').value) || 0;
  p.stats.awards     = parseInt(document.getElementById('prfAwStat').value)   || 0;
  p.roles = document.getElementById('prfRoles').value.split('\n').map(r => r.trim()).filter(Boolean);

  // الصورة الشخصية
  const photoFile = document.getElementById('prfPhotoInput').files[0];
  if (photoFile) {
    try { p.photo = await readImageFile(photoFile); } catch { /* skip */ }
  }
  const aboutFile = document.getElementById('prfAboutPhotoInput').files[0];
  if (aboutFile) {
    try { p.aboutPhoto = await readImageFile(aboutFile); } catch { /* skip */ }
  }

  Storage.save(APP_DATA);
  closeProfileForm();
  buildPage();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initTypingEffect(APP_DATA.profile.roles);
  showToast('تم حفظ الملف الشخصي ✅', 'success');
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
      document.querySelectorAll('.project-card:not(.project-add)').forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        card.classList.toggle('hidden', filter !== 'all' && !cat.includes(filter));
      });
    });
  });
}

/* -------------------------------------------------------
   إعادة ضبط البيانات
------------------------------------------------------- */
function resetAllData() {
  if (!confirm('⚠️ سيتم حذف جميع البيانات وإعادة ضبط الموقع للقيم الافتراضية.\nهل أنت متأكد؟')) return;
  Storage.reset();
  APP_DATA = Storage.load();
  buildPage();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initTypingEffect(APP_DATA.profile.roles);
  showToast('تم إعادة الضبط للقيم الافتراضية', 'success');
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

  // إغلاق المودالات
  ['viewModal','projectFormModal','skillFormModal','awardFormModal','expFormModal','eduFormModal','profileFormModal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', e => { if (e.target === el) el.classList.remove('active'), document.body.style.overflow = ''; });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    if (e.key === 'ArrowRight') viewGalleryPrev();
    if (e.key === 'ArrowLeft')  viewGalleryNext();
  });
});
