/* ==========================================================================
   PORTOFOLIO PAGE SCRIPT
   Self-contained on purpose: this page does not have the modal / poll / FAQ
   / gallery-audio elements that script.js expects, so it does NOT reuse
   script.js directly (that would throw on missing elements and break
   everything after it). Only the generic, element-safe pieces are
   reproduced here: preloader, particle field, nav scroll state, mobile
   menu, reveal-on-scroll, card tilt, and the achievements lightbox.
   ========================================================================== */

/* ---- Broken-image fallback (mirrors the main archive page's behaviour) ---- */
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = 'true';
    img.classList.add('img-broken');
  });
});

/* ---- Mobile menu ---- */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('mobileMenuBtn');
  if (menu) menu.classList.toggle('active');
  if (btn) btn.classList.toggle('active');
}

/* ---- Language switcher ---- */
(function initLanguageSwitcher() {
  const switcher = document.querySelector('.pf-language-switch');
  if (!switcher) return;
  const options = switcher.querySelectorAll('[data-language]');
  const content = {
    '.nav-links .nav-link': [['HOME', 'HOME'], ['CHARACTERS', 'CHARACTERS'], ['LORE', 'LORE'], ['GALLERY', 'GALLERY'], ['VOTE', 'VOTE'], ['FAQ', 'FAQ'], ['PORTFOLIO', 'PORTFOLIO'], ['ABOUT', 'ABOUT']],
    '.mobile-menu a': [['HOME', 'HOME'], ['CHARACTERS', 'CHARACTERS'], ['LORE', 'LORE'], ['GALLERY', 'GALLERY'], ['VOTE', 'VOTE'], ['FAQ', 'FAQ'], ['PORTFOLIO', 'PORTFOLIO'], ['ABOUT', 'ABOUT']],
    '.micro-label': [['CREATOR ARCHIVE // PORTFOLIO FILE', 'CREATOR ARCHIVE // PORTFOLIO FILE'], ['PORTFOLIO // 01 — ABOUT', 'PORTFOLIO // 01 — ABOUT'], ['PORTFOLIO // 02 — EDUCATION', 'PORTFOLIO // 02 — EDUCATION'], ['PORTFOLIO // 03 — EXPERIENCE', 'PORTFOLIO // 03 — EXPERIENCE'], ['PORTFOLIO // 04 — SKILLS', 'PORTFOLIO // 04 — SKILLS'], ['PORTFOLIO // 05 — ACHIEVEMENTS', 'PORTFOLIO // 05 — ACHIEVEMENTS'], ['PORTFOLIO // 06 — RESUME', 'PORTFOLIO // 06 — RESUME']],
    '.watermark': [['ABOUT', 'ABOUT'], ['STUDY', 'STUDY'], ['WORK', 'WORK'], ['SKILL', 'SKILLS'], ['AWARDS', 'AWARDS']],
    '.hero-desc': [['Mahasiswa Teknik Multimedia Digital, Politeknik Negeri Jakarta — aktif di ilustrasi karakter, desain visual, dan proyek multimedia kreatif di balik dunia PSYCHORA.', 'Digital Multimedia Engineering student at Politeknik Negeri Jakarta, focused on character illustration, visual design, and creative multimedia projects behind the world of PSYCHORA.']],
    '.hero-buttons .btn-primary': [['LIHAT PENGALAMAN', 'VIEW EXPERIENCE']],
    '.hero-buttons .btn-secondary': [['UNDUH CV', 'DOWNLOAD CV']],
    '#pf-about .section-title': [['ABOUT <span class="italic">ME</span>', 'ABOUT <span class="italic">ME</span>']],
    '#pf-about .pf-about-text': [['Saya adalah <span class="accent">Gerald Rexcia</span>, lahir di Bogor pada 12 Maret 2007. Lulusan SMAN 1 Cileungsi dengan jurusan IPA di kelas 11 dan 12, kini melanjutkan studi di program <span class="accent">Teknik Multimedia Digital</span> dengan ketertarikan tinggi pada desain visual, pengembangan konten multimedia, dan teknologi kreatif. Selama 2 tahun aktif berorganisasi sebagai bagian dari divisi Wakil Ketua Japanese Club.', 'I am <span class="accent">Gerald Rexcia</span>, born in Bogor on March 12, 2007. A graduate of SMAN 1 Cileungsi with a science major in grades 11 and 12, I am now studying <span class="accent">Digital Multimedia Engineering</span> with a strong interest in visual design, multimedia content development, and creative technology. I was active for two years as Vice Chair of the Japanese Club.']],
    '#pf-about .pf-fact-label': [['Program Studi', 'Study Program'], ['Kampus', 'University'], ['Domisili', 'Location'], ['Fokus', 'Focus']],
    '#pf-about .pf-fact-value': [['Teknik Multimedia Digital', 'Digital Multimedia Engineering'], ['Politeknik Negeri Jakarta', 'Politeknik Negeri Jakarta'], ['Pesona Kahuripan 11, Bogor, Jawa Barat 16820', 'Pesona Kahuripan 11, Bogor, West Java 16820'], ['Ilustrasi 2D · Desain Visual · Animasi · Digital Multimedia', '2D Illustration · Visual Design · Animation · Digital Multimedia']],
    '#pf-education .section-title': [['PENDIDIKAN', 'EDUCATION']],
    '#pf-education .pf-timeline-title': [['Teruna Muda Elementary School', 'Teruna Muda Elementary School'], ['Brighton Junior High School', 'Brighton Junior High School'], ['SMAN 1 Cileungsi', 'SMAN 1 Cileungsi'], ['Politeknik Negeri Jakarta', 'Politeknik Negeri Jakarta']],
    '#pf-education .pf-timeline-sub': [['Sekolah Dasar', 'Elementary School'], ['Sekolah Menengah Pertama', 'Junior High School'], ['Sekolah Menengah Atas · Cileungsi, Kab. Bogor, Jawa Barat', 'Senior High School · Cileungsi, Bogor, West Java'], ['Politeknik Negeri Jakarta · Depok, Jawa Barat', 'Politeknik Negeri Jakarta · Depok, West Java']],
    '#pf-education .pf-timeline-desc': [['Pendidikan dasar sebelum melanjutkan ke jenjang sekolah menengah.', 'Primary education before continuing to secondary school.'], ['Pendidikan menengah pertama sebelum melanjutkan ke jenjang SMA.', 'Junior high school education before continuing to senior high school.'], ['Jurusan A (IPA) pada kelas 11 dan 12. Aktif berorganisasi sebagai Wakil Ketua Japanese Club selama 2 tahun.', 'Science major in grades 11 and 12. Active as Vice Chair of the Japanese Club for two years.'], ['Menempuh studi pada program yang berfokus pada desain visual, produksi konten multimedia, dan teknologi kreatif.', 'Studying in a program focused on visual design, multimedia content production, and creative technology.']],
    '#pf-experience .section-title': [['PENGALAMAN', 'EXPERIENCE']],
    '#pf-experience .pf-timeline-title': [['Art Illustrator', 'Art Illustrator'], ['Panitia Acara (Campus EXPO)', 'Event Committee (Campus EXPO)'], ['Graphic Designer', 'Graphic Designer']],
    '#pf-experience .pf-timeline-sub': [['Proyek Kreatif Sekolah — Expo Campus (Columns NEPAL 2026)', 'School Creative Project — Campus Expo (Columns NEPAL 2026)'], ['Panitia Acara Nepal Columns 2026, SMAN 1 Cileungsi', 'Nepal Columns 2026 Event Committee, SMAN 1 Cileungsi'], ['Extracurricular Japanese Club', 'Japanese Club Extracurricular']],
    '#pf-experience .pf-timeline-desc': [['Mengembangkan ilustrasi 2D dan desain karakter untuk proyek Expo Campus, termasuk desain maskot karakter untuk kegiatan Expo. Mengilustrasikan karakter orisinal dengan fokus pada detail, ekspresi, dan daya tarik visual, serta mendukung tim kreatif dengan ide desain dan ilustrasi untuk acara budaya dan proyek multimedia.', 'Developed 2D illustrations and character designs for the Campus Expo project, including a mascot for the event. Created original characters with a focus on detail, expression, and visual appeal while supporting the creative team with design and illustration ideas for cultural events and multimedia projects.'], ['Bergabung sebagai bagian dari kepanitiaan acara Columns NEPAL 2026 Campus Expo, turut mengisi dan menyukseskan rangkaian kegiatan expo di sekolah.', 'Joined the Columns NEPAL 2026 Campus Expo committee and helped deliver the school expo activities successfully.'], ['Merancang poster berbasis visual grafis untuk kegiatan ekstrakurikuler guna meningkatkan minat dan partisipasi siswa SMA. Mendesain materi promosi berupa poster kreatif yang menampilkan identitas ekskul secara menarik dan komunikatif, menggunakan Ibis Paint X dan Krita.', 'Designed graphic posters for extracurricular activities to increase student interest and participation. Created engaging promotional materials that communicated the club identity using Ibis Paint X and Krita.']],
    '#pf-skills .section-title': [['KETERAMPILAN <span class="italic">&amp; BAHASA</span>', 'SKILLS <span class="italic">&amp; LANGUAGE</span>']],
    '#pf-skills .pf-subheading': [['CORE SKILLS', 'CORE SKILLS'], ['CERTIFICATIONS', 'CERTIFICATIONS'], ['LANGUAGE', 'LANGUAGE']],
    '#pf-skills .pf-skill-chip': [['ORGANIZED', 'ORGANIZED'], ['CREATIVITY', 'CREATIVITY'], ['TEAMWORK', 'TEAMWORK'], ['VICE SUPERVISION', 'VICE SUPERVISION'], ['CRITICAL THINKING', 'CRITICAL THINKING']],
    '#pf-skills .pf-cert-item span': [['Certified Fan Art Illustrator', 'Certified Fan Art Illustrator'], ['Expo Committee Certificate', 'Expo Committee Certificate'], ['Wakil Ketua Japanese Club', 'Japanese Club Vice Chair']],
    '#pf-skills .pf-lang-row span:first-child': [['INDONESIA', 'INDONESIAN'], ['ENGLISH', 'ENGLISH'], ['JAPANESE', 'JAPANESE']],
    '#pf-skills .pf-lang-row span:last-child': [['NATIVE', 'NATIVE'], ['PROFICIENT', 'PROFICIENT'], ['INTERMEDIATE', 'INTERMEDIATE']],
    '#pf-gallery .section-title': [['PRESTASI <span class="italic">&amp; SERTIFIKAT</span>', 'ACHIEVEMENTS <span class="italic">&amp; CERTIFICATES</span>']],
    '#pf-gallery .commission-desc': [['Beberapa penghargaan dan sertifikat yang diraih selama masa SMA. Ketuk gambar untuk memperbesar.', 'Awards and certificates earned during high school. Tap an image to enlarge it.']],
    '#pf-resume .section-title': [['CURRICULUM <span class="italic">VITAE</span>', 'CURRICULUM <span class="italic">VITAE</span>']],
    '.pf-resume-sub': [['Riwayat pendidikan, pengalaman, sertifikasi, dan prestasi lengkap dalam satu berkas.', 'A complete record of education, experience, certifications, and achievements in one document.']],
    '.pf-resume-actions .btn-primary': [['<i class="fas fa-download" style="margin-right:0.5rem;"></i>UNDUH CV', '<i class="fas fa-download" style="margin-right:0.5rem;"></i>DOWNLOAD CV']],
    '.pf-resume-actions .btn-secondary': [['<i class="fas fa-arrow-up-right-from-square" style="margin-right:0.5rem;"></i>BUKA TAB BARU', '<i class="fas fa-arrow-up-right-from-square" style="margin-right:0.5rem;"></i>OPEN NEW TAB']],
    '.footer-tagline': [['"Be Glad, Don\'t Regret"', '"Be Glad, Don\'t Regret"']],
    '.footer-copy': [['GERALD REXCIA — PORTFOLIO / 2026', 'GERALD REXCIA — PORTFOLIO / 2026']],
    '.pf-contact-grid .pf-contact-item:nth-child(4) span': [['Pesona Kahuripan 11, Bogor, Jawa Barat 16820', 'Pesona Kahuripan 11, Bogor, West Java 16820']]
  };
  const dates = {
    '#pf-education .pf-timeline-date': [['SD', 'ELEMENTARY'], ['SMP', 'JUNIOR HIGH'], ['2023 — 2025', '2023 — 2025'], ['2025 — Sekarang', '2025 — PRESENT']],
    '#pf-experience .pf-timeline-date': [['2021 — 2026', '2021 — 2026'], ['Januari 2026', 'January 2026'], ['2024 — 2025', '2024 — 2025']]
  };
  const galleryCaptions = [
    ['<span class="tag">NASIONAL // 2025</span>Perak Medali Nasional — OLO Language Olympiad', '<span class="tag">NATIONAL // 2025</span>National Silver Medal — OLO Language Olympiad'],
    ['<span class="tag">ISC // DES 2024</span>Gold Medalist — Indonesian Student Competition', '<span class="tag">ISC // DEC 2024</span>Gold Medalist — Indonesian Student Competition'],
    ['<span class="tag">NASIONAL // MAR 2025</span>Juara Harapan 5 — Lomba Menggambar Nasional', '<span class="tag">NATIONAL // MAR 2025</span>5th Honorable Mention — National Drawing Competition'],
    ['<span class="tag">EXPO // 2026</span>Sertifikat Panitia — Columns NEPAL 2026', '<span class="tag">EXPO // 2026</span>Committee Certificate — Columns NEPAL 2026']
  ];

  function applyContent(language) {
    Object.entries(content).forEach(([selector, values]) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        const translation = values[index];
        if (translation) element.innerHTML = translation[language === 'en' ? 1 : 0];
      });
    });
    Object.entries(dates).forEach(([selector, values]) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        const translation = values[index];
        if (translation) element.textContent = translation[language === 'en' ? 1 : 0];
      });
    });
    document.querySelectorAll('.pf-gallery-caption').forEach((element, index) => {
      if (galleryCaptions[index]) element.innerHTML = galleryCaptions[index][language === 'en' ? 1 : 0];
    });
    document.querySelectorAll('.pf-gallery-card').forEach((card, index) => {
      const captions = [
        ['Perak Medali Nasional — OLO Quarterly Language Olympiad 6.0, Bahasa Jepang', 'National Silver Medal — OLO Quarterly Language Olympiad 6.0, Japanese'],
        ['Gold Medalist — Indonesian Student Competition, Bidang Studi Bahasa Inggris SMA', 'Gold Medalist — Indonesian Student Competition, High School English'],
        ['Juara Harapan 5 — Lomba Menggambar SMA/SMK Tingkat Nasional', '5th Honorable Mention — National High School Drawing Competition'],
        ['Certificate of Participation — Panitia Columns NEPAL 2026 Campus Expo', 'Certificate of Participation — Columns NEPAL 2026 Campus Expo']
      ];
      if (captions[index]) card.dataset.caption = captions[index][language === 'en' ? 1 : 0];
    });
    document.title = language === 'en' ? 'PORTFOLIO — Gerald Rexcia | PSYCHORA Archive' : 'PORTFOLIO — Gerald Rexcia | Arsip PSYCHORA';
  }

  let savedLanguage = 'id';
  try {
    savedLanguage = localStorage.getItem('pf-language') || 'id';
  } catch (error) {
    savedLanguage = 'id';
  }

  function setLanguage(language) {
    document.documentElement.lang = language;
    applyContent(language);
    options.forEach(option => {
      const isActive = option.dataset.language === language;
      option.classList.toggle('is-active', isActive);
      option.setAttribute('aria-pressed', String(isActive));
    });
    try {
      localStorage.setItem('pf-language', language);
    } catch (error) {
    }
  }

  options.forEach(option => {
    option.addEventListener('click', () => setLanguage(option.dataset.language));
  });
  setLanguage(savedLanguage === 'en' ? 'en' : 'id');
})();

/* ---- Nav bar scroll state ---- */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav-bar');
  if (!nav) return;
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

/* ---- Reveal-on-scroll ---- */
const pfObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => pfObserver.observe(el));

/* ---- Particle field (identical behaviour to the main archive page) ---- */
class PfParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouseX = -1000;
    this.mouseY = -1000;
    this.resize();
    this.init();
    window.addEventListener('resize', () => { this.resize(); this.init(); });
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    this.animate();
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  init() {
    this.particles = [];
    const count = Math.min(70, Math.floor(window.innerWidth / 22));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.8 + 0.4,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25 - 0.05,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.62 ? '0, 217, 255' : '176, 38, 255',
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.02
      });
    }
  }
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      const dx = p.x - this.mouseX;
      const dy = p.y - this.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0 && dist < 120) {
        const force = (120 - dist) / 120;
        p.x += (dx / dist) * force * 1.5;
        p.y += (dy / dist) * force * 1.5;
      }
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
      const opacity = Math.max(0, p.opacity * (0.5 + Math.sin(p.pulse) * 0.5));
      const size = Math.max(0.1, p.size);
      const glowRadius = Math.max(0.5, size * 4);
      const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
      gradient.addColorStop(0, 'rgba(' + p.color + ', ' + (opacity * 0.6) + ')');
      gradient.addColorStop(1, 'rgba(' + p.color + ', 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.fillStyle = 'rgba(' + p.color + ', ' + opacity + ')';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    requestAnimationFrame(() => this.animate());
  }
}
const pfParticleCanvas = document.getElementById('particles');
if (pfParticleCanvas) new PfParticleSystem(pfParticleCanvas);

/* ---- Cursor particle trail ---- */
(function initInteractiveCursor() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let mouseX = -100;
  let mouseY = -100;
  let lastSpawnX = -100;
  let lastSpawnY = -100;
  const activeTrails = new Set();
  const maxActiveTrails = 40;
  const colors = [
    { bg: 'radial-gradient(circle, rgba(176, 38, 255, 0.9) 0%, rgba(176, 38, 255, 0) 70%)', shadow: '0 0 15px rgba(176, 38, 255, 0.8)' },
    { bg: 'radial-gradient(circle, rgba(0, 217, 255, 0.9) 0%, rgba(0, 217, 255, 0) 70%)', shadow: '0 0 15px rgba(0, 217, 255, 0.8)' }
  ];
  let colorIdx = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

    const dist = Math.hypot(mouseX - lastSpawnX, mouseY - lastSpawnY);
    if (dist > 12) {
      while (activeTrails.size >= maxActiveTrails) {
        const oldestTrail = activeTrails.values().next().value;
        activeTrails.delete(oldestTrail);
        oldestTrail.remove();
      }

      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      const size = Math.random() * 16 + 18;
      const theme = colors[colorIdx % colors.length];
      colorIdx++;
      trail.style.width = `${size}px`;
      trail.style.height = `${size}px`;
      trail.style.background = theme.bg;
      trail.style.boxShadow = theme.shadow;
      trail.style.left = `${mouseX}px`;
      trail.style.top = `${mouseY}px`;
      document.body.appendChild(trail);
      activeTrails.add(trail);

      setTimeout(() => {
        activeTrails.delete(trail);
        trail.remove();
      }, 650);
      lastSpawnX = mouseX;
      lastSpawnY = mouseY;
    }
  });
})();

/* ---- 3D tilt for cards marked [data-tilt] ---- */
(function initTilt() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
  const cards = document.querySelectorAll('.card-3d[data-tilt]');
  cards.forEach(card => {
    let currentX = 0, currentY = 0, targetX = 0, targetY = 0, isHovered = false, raf = null;
    function render() {
      currentX += (targetX - currentX) * 0.65;
      currentY += (targetY - currentY) * 0.65;
      const zDepth = isHovered ? 30 : 0;
      card.style.transform = `perspective(1200px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translateZ(${zDepth}px)`;
      if (isHovered || Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
        raf = requestAnimationFrame(render);
      } else {
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      }
    }
    card.addEventListener('mouseenter', () => {
      isHovered = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    });
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      targetX = ((y - cy) / cy) * -8;
      targetY = ((x - cx) / cx) * 8;
    });
    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetX = 0; targetY = 0;
    });
  });
})();

/* ---- Achievements lightbox ---- */
function pfOpenLightbox(src, caption, tag) {
  const lb = document.getElementById('pfLightbox');
  const img = document.getElementById('pfLightboxImage');
  const cap = document.getElementById('pfLightboxCaption');
  if (!lb || !img) return;
  img.src = src;
  img.alt = caption || '';
  if (cap) cap.textContent = (tag ? tag + ' — ' : '') + (caption || '');
  lb.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function pfCloseLightbox() {
  const lb = document.getElementById('pfLightbox');
  if (!lb) return;
  lb.classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') pfCloseLightbox();
});
document.addEventListener('DOMContentLoaded', () => {
  const lb = document.getElementById('pfLightbox');
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target.id === 'pfLightbox') pfCloseLightbox();
    });
  }
  document.querySelectorAll('.pf-gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      pfOpenLightbox(card.dataset.full || card.querySelector('img').src, card.dataset.caption, card.dataset.tag);
    });
  });
});

/* ==========================================================================
   Preloader — same circular-progress behaviour as the main archive page.
   Independent copy so this page never depends on script.js loading first.
   ========================================================================== */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const ring = document.getElementById('preloaderRingProgress');
  const percentEl = document.getElementById('preloaderPercentValue');
  const statusEl = document.getElementById('preloaderStatusText');
  if (!preloader || !ring || !percentEl) return;

  const CIRCUMFERENCE = 326.7256;
  const SAFETY_TIMEOUT_MS = 8000;
  const statuses = ['LOADING PORTFOLIO', 'FETCHING CV DATA', 'RENDERING ARCHIVE'];

  let current = 0;
  let finished = false;
  let tickInterval = null;
  let statusInterval = null;

  function render(pct) {
    const clamped = Math.max(0, Math.min(100, pct));
    ring.style.strokeDashoffset = String(CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE);
    percentEl.textContent = String(Math.round(clamped));
  }

  function tick() {
    current += (92 - current) * 0.045 + 0.15;
    if (current > 92) current = 92;
    render(current);
  }

  function finish() {
    if (finished) return;
    finished = true;
    if (tickInterval) clearInterval(tickInterval);
    if (statusInterval) clearInterval(statusInterval);
    if (statusEl) statusEl.textContent = 'READY';

    const from = current;
    const start = performance.now();
    const RUSH_MS = 380;

    function rush(now) {
      const t = Math.min(1, (now - start) / RUSH_MS);
      render(from + (100 - from) * t);
      if (t < 1) {
        requestAnimationFrame(rush);
      } else {
        setTimeout(hidePreloader, 320);
      }
    }
    requestAnimationFrame(rush);
  }

  function hidePreloader() {
    preloader.classList.add('is-hidden');
    document.documentElement.classList.remove('preloader-active');
    document.body.classList.remove('preloader-active');
    preloader.addEventListener('transitionend', () => {
      preloader.style.display = 'none';
    }, { once: true });
  }

  render(0);
  tickInterval = setInterval(tick, 90);

  if (statusEl && statuses.length > 1) {
    let statusIndex = 0;
    statusInterval = setInterval(() => {
      statusIndex = (statusIndex + 1) % statuses.length;
      statusEl.textContent = statuses[statusIndex];
    }, 1400);
  }

  if (document.readyState === 'complete') {
    finish();
  } else {
    window.addEventListener('load', finish, { once: true });
  }

  setTimeout(finish, SAFETY_TIMEOUT_MS);
})();