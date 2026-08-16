/* ===== PROJECTS.JS ===== */

/** Open project detail modal */
function openProjectModal(index) {
  const project = PROJECTS_DATA[index];
  if (!project) return;

  const modal = document.getElementById('projectModal');
  const content = document.getElementById('modalContent');

  // Get stored image if available
  const storedImg = localStorage.getItem(`proj_img_${project.id}`);
  const imgHTML = storedImg
    ? `<img src="${storedImg}" alt="${project.title}" style="width:100%;height:240px;object-fit:cover;border-radius:var(--radius-lg);margin-bottom:1.5rem;" />`
    : `<div style="height:160px;background:var(--bg-secondary);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;font-size:3rem;color:var(--primary);margin-bottom:1.5rem;"><i class="fas ${project.icon}"></i></div>`;

  const tagsHTML = project.tags.map(t => `<span class="tag">${t}</span>`).join('');

  const highlightsHTML = project.highlights
    .map(h => `<li>${h}</li>`)
    .join('');

  const awardHTML = project.award
    ? `<div class="project-award-badge" style="position:static;display:inline-flex;margin-bottom:1rem;">
        <i class="fas fa-trophy"></i> ${project.award}
       </div>`
    : '';

  const urlHTML = project.url
    ? `<a href="${project.url}" target="_blank" class="btn btn-primary" style="margin-top:1.5rem;">
        <i class="fas fa-external-link-alt"></i> زيارة المشروع
       </a>`
    : '';

  content.innerHTML = `
    ${imgHTML}
    ${awardHTML}
    <div class="project-tags" style="margin-bottom:1rem;">${tagsHTML}</div>
    <h2 style="font-size:1.5rem;font-weight:800;color:var(--text-primary);margin-bottom:0.75rem;">${project.title}</h2>
    <p style="color:var(--text-secondary);line-height:1.8;margin-bottom:1.5rem;">${project.desc}</p>
    <h4 style="color:var(--primary);font-size:1rem;font-weight:700;margin-bottom:0.75rem;">أبرز المميزات:</h4>
    <ul class="timeline-duties">${highlightsHTML}</ul>
    <div style="display:flex;align-items:center;gap:1rem;margin-top:1.5rem;">
      <span style="background:rgba(14,165,233,0.1);border:1px solid var(--border);color:var(--text-muted);padding:0.4rem 1rem;border-radius:var(--radius-full);font-size:0.85rem;">
        <i class="fas fa-calendar"></i> ${project.year}
      </span>
      ${urlHTML}
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  document.getElementById('projectModal').classList.remove('active');
  document.body.style.overflow = '';
}

/** Open add project modal */
function openAddProjectModal() {
  document.getElementById('addProjectModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAddProjectModal() {
  document.getElementById('addProjectModal').classList.remove('active');
  document.body.style.overflow = '';
}

/** Handle adding a new project */
async function handleAddProject(e) {
  e.preventDefault();

  const name = document.getElementById('newProjName').value.trim();
  const desc = document.getElementById('newProjDesc').value.trim();
  const tagsRaw = document.getElementById('newProjTags').value.trim();
  const cat = document.getElementById('newProjCat').value;
  const imgFile = document.getElementById('newProjImg').files[0];
  const url = document.getElementById('newProjUrl').value.trim();

  if (!name || !desc) {
    showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
    return;
  }

  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const newId = Date.now();

  let imgSrc = null;
  if (imgFile) {
    try { imgSrc = await readImageFile(imgFile); }
    catch { showToast('فشل تحميل الصورة', 'error'); return; }
  }

  // Add to data array
  const newProject = { id: newId, title: name, desc, tags, category: cat, icon: 'fa-code', year: new Date().getFullYear().toString(), highlights: [], url: url || null };
  PROJECTS_DATA.push(newProject);

  // Save image
  if (imgSrc) localStorage.setItem(`proj_img_${newId}`, imgSrc);

  // Build card HTML
  renderNewProjectCard(newProject, imgSrc);

  // Reset & close
  e.target.reset();
  closeAddProjectModal();
  showToast(`تمت إضافة المشروع "${name}" بنجاح! 🚀`, 'success');
}

/** Render a new project card dynamically */
function renderNewProjectCard(project, imgSrc) {
  const grid = document.getElementById('projectsGrid');
  const addCard = document.getElementById('addProjectCard');

  const tagsHTML = project.tags.map(t => `<span class="tag">${t}</span>`).join('');

  const imgContent = imgSrc
    ? `<img src="${imgSrc}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" />`
    : `<div class="proj-placeholder"><i class="fas ${project.icon}"></i></div>`;

  const card = document.createElement('article');
  card.className = 'project-card reveal-up';
  card.setAttribute('data-category', project.category);
  card.innerHTML = `
    <div class="project-image-wrapper">
      <div class="project-img" id="proj-img-${project.id}">
        ${imgContent}
        <label class="proj-img-upload" title="رفع صورة المشروع">
          <i class="fas fa-camera"></i>
          <input type="file" accept="image/*" class="proj-img-input" data-proj="${project.id}" hidden />
        </label>
      </div>
      <div class="project-overlay">
        <div class="project-links">
          <button class="proj-link-btn" onclick="openProjectModal(${PROJECTS_DATA.length - 1})">
            <i class="fas fa-eye"></i> عرض التفاصيل
          </button>
        </div>
      </div>
    </div>
    <div class="project-body">
      <div class="project-tags">${tagsHTML}</div>
      <h3 class="project-title">${project.title}</h3>
      <p class="project-desc">${project.desc}</p>
    </div>
  `;

  grid.insertBefore(card, addCard);

  // Bind image upload for new card
  bindProjectImageUploads();

  // Trigger animation
  requestAnimationFrame(() => {
    setTimeout(() => card.classList.add('visible'), 50);
  });
}

/** Project filter */
function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card:not(.project-add)');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/** Bind image upload events for project cards */
function bindProjectImageUploads() {
  document.querySelectorAll('.proj-img-input').forEach(input => {
    // Avoid double-binding
    if (input._bound) return;
    input._bound = true;

    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      const projId = input.getAttribute('data-proj');
      const container = document.getElementById(`proj-img-${projId}`);

      if (!file || !container) return;

      try {
        const src = await readImageFile(file);
        localStorage.setItem(`proj_img_${projId}`, src);

        // Remove placeholder
        const placeholder = container.querySelector('.proj-placeholder');
        if (placeholder) placeholder.remove();

        setImageInContainer(container, src);
        showToast('تم رفع صورة المشروع بنجاح!', 'success');
      } catch {
        showToast('فشل تحميل الصورة', 'error');
      }
    });
  });
}

/** Load saved project images from localStorage */
function loadSavedProjectImages() {
  PROJECTS_DATA.forEach(project => {
    const saved = localStorage.getItem(`proj_img_${project.id}`);
    const container = document.getElementById(`proj-img-${project.id}`);
    if (saved && container) {
      const placeholder = container.querySelector('.proj-placeholder');
      if (placeholder) placeholder.remove();
      setImageInContainer(container, saved);
    }
  });
}
