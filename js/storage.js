/* ===== STORAGE.JS — نظام التخزين المشترك ===== */
/* يستخدمه كل من index.html و index_manager.html */

const DB_KEY   = 'hothifa_portfolio_data';
const VER_KEY  = 'hothifa_portfolio_version';

/* -------------------------------------------------------
   البيانات الافتراضية (تُحمَّل مرة واحدة فقط)
------------------------------------------------------- */
const DEFAULT_DATA = {
  profile: {
    name:     'حذيفة أحمد الميكي',
    title:    'مهندس تقنية معلومات | مطور حلول برمجية وإدارية',
    bio:      'مهندس تقنية معلومات متحفز يمتلك خبرة عملية في تطوير تطبيقات الويب وتطبيقات الأجهزة الذكية باستخدام Laravel وPHP وMySQL وFlutter. يتمتع بكفاءة في تطوير APIs RESTful وتصميم قواعد البيانات وبناء حلول تركز على تجربة المستخدم. حاصل على درع ابتكارات المستقبل من الجامعة الوطنية.',
    location: 'الرياض – حي النسيم الغربي',
    email:    'hothifaalmolukey@gmail.com',
    phone:    '+966579489858',
    linkedin: 'hothifa-al-molukey-6l73831b4',
    photo:    null,
    aboutPhoto: null,
    roles:    ['مطور ويب محترف', 'مطور Flutter', 'مصمم UI/UX', 'مبدع تقني'],
    stats:    { experience: 4, projects: 6, awards: 3 },
    languages: [
      { name: 'العربية', level: 100, label: 'اللغة الأم' },
      { name: 'الإنجليزية', level: 65, label: 'جيد' },
    ],
  },

  skills: [
    { id: 's1', name: 'Laravel & PHP',   icon: 'fab fa-laravel',     pct: 90, desc: 'بناء تطبيقات ويب متكاملة مع APIs RESTful احترافية' },
    { id: 's2', name: 'Flutter',          icon: 'fas fa-mobile-alt',  pct: 85, desc: 'تطوير تطبيقات موبايل متعددة المنصات' },
    { id: 's3', name: 'MySQL',            icon: 'fas fa-database',    pct: 88, desc: 'تصميم قواعد بيانات علائقية آمنة ومنظمة' },
    { id: 's4', name: 'UI/UX & Figma',   icon: 'fas fa-paint-brush', pct: 80, desc: 'تصميم واجهات استخدام سهلة وملائمة' },
    { id: 's5', name: 'RESTful APIs',    icon: 'fas fa-server',      pct: 87, desc: 'بناء بنية خلفية منظمة لإدارة البيانات' },
    { id: 's6', name: 'HTML & CSS & JS', icon: 'fas fa-laptop-code', pct: 82, desc: 'بناء صفحات ويب احترافية متجاوبة' },
    { id: 's7', name: 'الأمن المعلوماتي', icon: 'fas fa-shield-alt', pct: 70, desc: 'دورة الهاكر الأخلاقي وأساسيات اختبار الاختراق' },
    { id: 's8', name: 'صيانة الأجهزة',  icon: 'fas fa-cogs',        pct: 75, desc: 'دبلوم صيانة وبرمجة الموبايل Hardware & Software' },
  ],

  projects: [
    {
      id: 'p1',
      title: 'نظام الخدمات الأكاديمية',
      desc:  'نظام متكامل لإدارة الخدمات الأكاديمية يشمل إدارة بيانات الطلاب والحضور والدرجات والسجلات المالية. حاصل على درع ابتكارات المستقبل 2025.',
      tags:  ['Laravel', 'PHP', 'MySQL', 'Flutter'],
      category: 'web',
      icon:  'fa-graduation-cap',
      award: 'درع ابتكار المستقبل 2025',
      year:  '2025',
      url:   '',
      highlights: [
        'بناء بنية خلفية منظمة تعتمد على RESTful APIs',
        'تصميم واجهات استخدام سهلة مع التركيز على UX',
        'تنفيذ قواعد بيانات علائقية آمنة ومنظمة بكفاءة',
        'إجراء اختبارات وتحسينات على الأداء',
      ],
      mainImage:  null,
      gallery:    [],   // مصفوفة صور إضافية
    },
    {
      id: 'p2',
      title: 'نظام حلقتي',
      desc:  'نظام متخصص لإدارة حلقات تحفيظ القرآن الكريم يتيح متابعة الطلاب وتتبع حفظهم وإدارة الحلقات بكفاءة.',
      tags:  ['Laravel', 'Flutter', 'MySQL'],
      category: 'web mobile',
      icon:  'fa-quran',
      year:  '2024',
      url:   '',
      highlights: ['إدارة حلقات القرآن وتتبع تقدم الطلاب', 'نظام تقارير دورية للأداء', 'واجهة موبايل سهلة الاستخدام'],
      mainImage: null,
      gallery:   [],
    },
    {
      id: 'p3',
      title: 'نظام كويزماستر',
      desc:  'منصة اختبارات تفاعلية ذكية تتيح للمعلمين إنشاء اختبارات وللطلاب إجراءها مع نتائج فورية.',
      tags:  ['Laravel', 'MySQL', 'JavaScript'],
      category: 'web',
      icon:  'fa-brain',
      year:  '2024',
      url:   '',
      highlights: ['إنشاء اختبارات متعددة الأنواع', 'نتائج فورية مع تحليلات مفصلة', 'لوحة تحكم للمعلمين'],
      mainImage: null,
      gallery:   [],
    },
    {
      id: 'p4',
      title: 'تطبيق مدونتي',
      desc:  'تطبيق موبايل للمدونة الشخصية يمكّن المستخدمين من كتابة المقالات وقراءتها والتفاعل معها.',
      tags:  ['Flutter', 'Laravel', 'REST API'],
      category: 'mobile',
      icon:  'fa-blog',
      year:  '2023',
      url:   '',
      highlights: ['كتابة المقالات ونشرها بسهولة', 'نظام تعليقات وتفاعل', 'واجهة مستخدم سلسة وأنيقة'],
      mainImage: null,
      gallery:   [],
    },
    {
      id: 'p5',
      title: 'تصاميم Figma',
      desc:  'مجموعة تصاميم احترافية لتطبيقات ومواقع متنوعة بتجربة مستخدم مدروسة وواجهات جذابة.',
      tags:  ['Figma', 'UI/UX', 'Prototyping'],
      category: 'design',
      icon:  'fa-figma',
      year:  '2022–2025',
      url:   '',
      highlights: ['تصميم واجهات تطبيقات موبايل', 'تصميم صفحات ويب متجاوبة', 'نماذج أولية تفاعلية'],
      mainImage: null,
      gallery:   [],
    },
  ],

  awards: [
    {
      id: 'a1',
      title: 'درع ابتكار المستقبل',
      org:   'الجامعة الوطنية',
      date:  'نوفمبر 2025',
      desc:  'تقديراً للإبداع والابتكار التقني المتميز في تصميم وتطوير نظام خدمات أكاديمية',
      icon:  'fa-trophy',
    },
    {
      id: 'a2',
      title: 'شهادة تقدير',
      org:   'الجامعة الوطنية',
      date:  '2023',
      desc:  'تقديراً للإسهامات في التميز الأكاديمي ومبادرات الدعم الفني',
      icon:  'fa-medal',
    },
    {
      id: 'a3',
      title: 'شهادات إضافية',
      org:   '',
      date:  'متاحة عند الطلب',
      desc:  'شهادات وتكريمات إضافية في مجالات التقنية والابتكار والريادة',
      icon:  'fa-star',
    },
  ],

  experience: [
    {
      id: 'e1',
      role:    'منسق عمليات مبيعات',
      company: 'شركة عال الكيف',
      period:  'فبراير 2026 – حتى الآن',
      current: true,
      icon:    'fa-store',
      duties:  [
        'إدارة عمليات نقاط البيع اليومية وضمان دقة العمليات المالية',
        'تحسين تجربة العملاء من خلال سرعة الإنجاز ودقة الخدمة',
        'التعامل مع الأنظمة الرقمية لنقاط البيع وإدارة البيانات',
        'المساهمة في تحسين سرعة الخدمة وتقليل الأخطاء التشغيلية',
      ],
    },
    {
      id: 'e2',
      role:    'مدخل ومدقق بيانات',
      company: 'مركز الإمام مالك لتحفيظ القرآن الكريم',
      period:  'يونيو 2021 – ديسمبر 2025',
      current: false,
      icon:    'fa-database',
      duties:  [
        'إدخال وتحديث بيانات طلاب حلقات تحفيظ القرآن بدقة عالية',
        'مراجعة وتدقيق البيانات والتحقق من صحتها واكتمالها',
        'تنظيم وأرشفة السجلات الطلابية الورقية والإلكترونية',
        'إعداد تقارير دورية ورفع البيانات للإدارة',
      ],
    },
  ],

  education: [
    { id: 'ed1', degree: 'بكالوريوس تقنية معلومات', institution: 'الجامعة الوطنية', date: '2021 – 2025', icon: 'fa-university' },
    { id: 'ed2', degree: 'شهادة إتمام حفظ القرآن الكريم', institution: 'مركز الإمام مالك لتحفيظ القرآن', date: '2018', icon: 'fa-book-open' },
    { id: 'ed3', degree: 'دبلوم اللغة الإنجليزية', institution: 'مركز اللغات جامعة إب', date: '2020', icon: 'fa-language' },
    { id: 'ed4', degree: 'دورة الهاكر الأخلاقي (50 ساعة)', institution: 'منصة ساس التعليمية', date: 'أكتوبر – نوفمبر 2022', icon: 'fa-certificate' },
  ],
};

/* -------------------------------------------------------
   API التخزين
------------------------------------------------------- */
const Storage = {

  /** تحميل البيانات من localStorage أو إرجاع الافتراضية */
  load() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
      return JSON.parse(raw);
    } catch {
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  },

  /** حفظ البيانات في localStorage */
  save(data) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      localStorage.setItem(VER_KEY, Date.now().toString());
      return true;
    } catch (e) {
      console.error('Storage save error:', e);
      return false;
    }
  },

  /** إعادة تعيين البيانات للقيم الافتراضية */
  reset() {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(VER_KEY);
  },

  /** الحصول على آخر وقت تحديث */
  lastUpdated() {
    return localStorage.getItem(VER_KEY) || null;
  },
};

/* نسخة البيانات النشطة في الذاكرة */
let APP_DATA = Storage.load();

/* -------------------------------------------------------
   دوال مساعدة للمعرّفات
------------------------------------------------------- */
function genId(prefix = 'x') {
  return prefix + Date.now() + Math.random().toString(36).slice(2, 6);
}
