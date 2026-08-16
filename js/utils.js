/* ===== UTILS.JS ===== */

/** Toast notification */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.className = 'toast'; }, 3500);
}

/** Read image file → data URL */
function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) { reject(new Error('ليس صورة')); return; }
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = () => reject(new Error('فشل القراءة'));
    r.readAsDataURL(file);
  });
}

/** Debounce */
function debounce(fn, delay) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

/** Throttle */
function throttle(fn, limit) {
  let inT; return (...args) => { if (!inT) { fn(...args); inT = true; setTimeout(() => inT = false, limit); } };
}

/** Handle contact form */
function handleFormSubmit(e) {
  e.preventDefault();
  showToast('تم إرسال رسالتك بنجاح! سيتم التواصل معك قريباً 🚀', 'success');
  e.target.reset();
}
