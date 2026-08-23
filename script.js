const images = {
  sarako: 'assetbio/Sarako-Cell_Sword.png',
  shiro: 'assetbio/Shiro-Baddie.png',
  shiroAlt: 'assetbio/shiro-alt.png',
  shiroBaddie2: 'assetbio/shiro-baddie2.jpg',
  sarakoTrans: 'assetbio/sarako-trans.png'
};

const characterData = {
  sarako: {
    num: 'CHAR.001 // VIOLET/PURPLE',
    label: 'CHAR.001 // CHARACTER FILE',
    name: 'SARAKO KYOGA',
    nameJp: 'サラコ・キョウガ',
    alias: 'The Violet AbyssBlade',
    image: images.sarako,
    imageClass: '',
    pos: 'center top',
    quote: '"You will not hear me arrive. You will only see me leave."',
    bio: 'Last heir of the Violet Court, Sarako walks the line between memory and vengeance. Trained in the silent arts since childhood, she speaks rarely and strikes without hesitation. Her blade carries the weight of a fallen kingdom — and the promise of a debt yet unpaid.',
    personality: 'Composed · Observant · Quietly Merciless',
    weapon: 'Hush — A spirit-bound katana that absorbs sound around it, leaving only silence in its wake.',
    color: 'Neon Violet',
    colorHex: '#b026ff'
  },
  shiro: {
    num: 'CHAR.002 // CYAN-WHITE',
    label: 'CHAR.002 // CHARACTER FILE',
    name: 'SHIRO MIAZAKI',
    nameJp: '宮崎 シロ',
    alias: 'The Ice Fang Wolf',
    image: images.shiro,
    imageClass: 'cyan',
    pos: 'center top',
    quote: '"Smile first. They never expect the second move."',
    bio: 'Born in the neon underbelly of Psychora, Shiro dances between chaos and precision. A street-fighter turned elite, she hides a tactical mind beneath a playful exterior. Every laugh is a calculation. Every glance, a threat assessment dressed as charm.',
    personality: 'Playful · Sharp · Dangerously Unpredictable',
    weapon: 'Chain Lightning — An electric whip-blade pulsing with storm energy, linked to her neural signature.',
    color: 'Electric Cyan/White',
    colorHex: '#00d9ff'
  }
};

function handleImgError(img) {
  if (img.id === 'modalImage' && !img.src) return;
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = 'true';
  img.classList.add('img-broken');
}

document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => handleImgError(img));
});

function openModal(charId, overrides) {
  const base = characterData[charId];
  const data = overrides ? Object.assign({}, base, overrides) : base;
  const modalImg = document.getElementById('modalImage');
  
  modalImg.classList.remove('img-broken');
  delete modalImg.dataset.fallbackApplied;
  
  modalImg.src = data.image;
  modalImg.alt = data.name;
  modalImg.style.objectPosition = data.pos || 'center top';
  document.getElementById('modalImageDeco').textContent = data.num;
  const modalImageWrap = document.getElementById('modalImageWrap');
  modalImageWrap.className = 'modal-image ' + data.imageClass;
  modalImageWrap.style.setProperty('--modal-bg', 'url("' + data.image + '")');
  document.getElementById('modalLabel').textContent = data.label;
  document.getElementById('modalName').textContent = data.name;
  document.getElementById('modalNameJp').textContent = data.nameJp;
  const modalNameJpEl = document.getElementById('modalNameJp');
  if (data.nameJpWhite) {
    modalNameJpEl.style.color = '#ffffff';
    modalNameJpEl.style.textShadow = '0 0 9px rgba(255, 255, 255, 0.75), 0 0 20px rgba(255, 255, 255, 0.3)';
  } else {
    modalNameJpEl.style.color = '';
    modalNameJpEl.style.textShadow = '';
  }
  document.getElementById('modalAlias').textContent = data.alias;
  document.getElementById('modalQuote').textContent = data.quote;
  document.getElementById('modalBio').textContent = data.bio;
  document.getElementById('modalPersonality').textContent = data.personality;
  document.getElementById('modalWeapon').textContent = data.weapon;
  document.getElementById('modalColor').innerHTML = '<span class="color-swatch" style="background:' + data.colorHex + ';color:' + data.colorHex + '"></span>' + data.color;
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

function switchSynopsis(lang, btn) {
  document.querySelectorAll('.synopsis-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.synopsis-body').forEach(b => b.classList.remove('active'));
  document.getElementById('synopsis-' + lang).classList.add('active');
}

function toggleMobileMenu() {
  document.getElementById('mobileMenu').classList.toggle('active');
  document.getElementById('mobileMenuBtn').classList.toggle('active');
}

// Character Poll / Vote -> Flask backend
// GANTI URL ini kalau backend-nya sudah online / dideploy (bukan lagi localhost).
const POLL_API_BASE = 'https://psychora-bio-production.up.railway.app/api/vote';
const POLL_STORAGE_KEY = 'psychora_voted_character';

const pollCards = document.querySelectorAll('.poll-card');
const pollStatus = document.getElementById('pollStatus');
const pollTotal = document.getElementById('pollTotal');

function renderPollResults(counts, total, percentages) {
  pollCards.forEach((card) => {
    const character = card.dataset.character;
    const bar = card.querySelector('.poll-bar');
    const percentEl = card.querySelector('.poll-percent');
    const pct = (percentages && percentages[character]) || 0;
    bar.style.width = pct + '%';
    percentEl.textContent = pct + '% (' + ((counts && counts[character]) || 0) + ' votes)';
  });
  pollTotal.textContent = total > 0 ? `${total} total votes` : 'Be the first to vote!';
}

function lockPoll(votedCharacter) {
  pollCards.forEach((card) => {
    card.disabled = true;
    card.classList.toggle('voted', card.dataset.character === votedCharacter);
  });
}

async function fetchPollResults() {
  try {
    const res = await fetch(`${POLL_API_BASE}/results`);
    const data = await res.json();
    if (data.success) renderPollResults(data.counts, data.total, data.percentages);
  } catch (err) {
    // Server belum online / offline: biarkan bar tetap di 0%, tidak perlu ganggu tampilan.
  }
}

if (pollCards.length) {
  const alreadyVoted = localStorage.getItem(POLL_STORAGE_KEY);
  if (alreadyVoted) {
    lockPoll(alreadyVoted);
    pollStatus.textContent = 'You already voted. Thanks for participating!';
  }
  fetchPollResults();

  pollCards.forEach((card) => {
    card.addEventListener('click', async () => {
      if (localStorage.getItem(POLL_STORAGE_KEY)) return;
      const character = card.dataset.character;

      pollStatus.textContent = 'Submitting your vote...';
      pollCards.forEach((c) => { c.disabled = true; });

      try {
        const res = await fetch(POLL_API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ character })
        });
        const result = await res.json().catch(() => ({}));

        if (res.ok && result.success) {
          localStorage.setItem(POLL_STORAGE_KEY, character);
          renderPollResults(result.counts, result.total, result.percentages);
          lockPoll(character);
          pollStatus.textContent = 'Thanks for voting!';
        } else {
          pollStatus.textContent = result.error || 'Failed to submit vote. Please try again.';
          pollCards.forEach((c) => { c.disabled = false; });
        }
      } catch (err) {
        pollStatus.textContent = 'Could not reach the server. Please try again later.';
        pollCards.forEach((c) => { c.disabled = false; });
      }
    });
  });
}

// Interactive FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    const isActive = item.classList.contains('active');

    // Tutup item lain (accordion style: hanya satu jawaban terbuka sekaligus)
    faqItems.forEach((other) => {
      other.classList.remove('active');
      other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    if (!isActive) {
      item.classList.add('active');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav-bar');
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

class ParticleSystem {
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
      if (dist < 120) {
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
new ParticleSystem(document.getElementById('particles'));

const galleryItems = [
  { img: 'assetbio/Shiro-Baddie-2.jpg', name: 'SHIRO MIAZAKI', tag: 'STORMDUST FORM', charId: 'shiro', pos: 'center top', accent: 'cyan' },
  { img: 'assetbio/DuoBaddie.png', name: 'SARAKO & SHIRO', nameJp: 'サラコとシロ', tag: 'DUO PSYCHORA RIVALS ', description: 'They read the threat together, then locked the field by figuring out a strategy to start fighting.', charId: 'shiro', pos: 'center', accent: 'cyan', nameJpWhite: true },
  { img: 'assetbio/SarakoRage1.png', name: 'SARAKO KYOGA', tag: 'ENRAGED VOID', charId: 'sarako', pos: 'center', accent: 'purple' },
  { img: 'assetbio/SarakoTrans.png', name: 'SARAKO KYOGA', tag: 'SHADOW MODE', charId: 'sarako', pos: 'center', accent: 'purple' },
  { 
    img: 'assetbio/SparringPSYCHORA.jpeg', 
    name: 'PSYCHORA DUEL', 
    nameJp: 'サイコラ決闘', 
    tag: 'SPARRING TIME', 
    label: 'PSYCHORA RECORDS // BATTLE', 
    charId: 'shiro', 
    pos: 'center', 
    accent: 'cyan', 
    nameJpWhite: true 
  },
  { img: 'assetbio/Sarako-Cell-Action.png', name: 'SARAKO KYOGA', nameJp: 'サラコ・キョウガ', tag: 'VIOLET ABYSS SURGE', charId: 'sarako', pos: 'center top', accent: 'purple' }
];

const galleryGrid = document.getElementById('galleryGrid');
galleryItems.forEach((item, i) => {
  const div = document.createElement('div');
  div.className = 'gallery-item reveal' + (item.accent === 'cyan' ? ' cyan-accent' : '');
  div.style.transitionDelay = (i * 0.08) + 's';
  div.innerHTML =
    '<img src="' + item.img + '" alt="' + item.name + ' — ' + item.tag + '" loading="lazy" decoding="async" style="object-position: ' + item.pos + '">' +
    '<div class="gallery-overlay">' +
      '<div class="gallery-name">' + item.name + '</div>' +
      (item.nameJp ? '<div class="gallery-name-jp">' + item.nameJp + '</div>' : '') +
      '<div class="gallery-view">' + item.tag + ' — VIEW →</div>' +
      (item.description ? '<div class="gallery-info">' + item.description + '</div>' : '') +
    '</div>';
  const galleryImg = div.querySelector('img');
  galleryImg.addEventListener('error', () => handleImgError(galleryImg), { once: true });
  div.addEventListener('click', () => openModal(item.charId, {
    image: item.img,
    imageClass: item.accent === 'cyan' ? 'cyan' : '',
    name: item.name,
    label: item.label || characterData[item.charId].label,
    nameJp: item.nameJp || characterData[item.charId].nameJp,
    nameJpWhite: !!item.nameJpWhite,
    alias: item.tag,
    pos: item.pos || 'center top'
  }));
  galleryGrid.appendChild(div);
  observer.observe(div);
});

document.addEventListener('gesturestart', function (e) {
  e.preventDefault();
});

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

(function initInteractiveCursor() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  let mouseX = -100;
  let mouseY = -100;
  let lastSpawnX = -100;
  let lastSpawnY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

    const dist = Math.hypot(mouseX - lastSpawnX, mouseY - lastSpawnY);
    if (dist > 12) {
      spawnTrail(mouseX, mouseY);
      lastSpawnX = mouseX;
      lastSpawnY = mouseY;
    }
  });

  const colors = [
    { bg: 'radial-gradient(circle, rgba(176, 38, 255, 0.9) 0%, rgba(176, 38, 255, 0) 70%)', shadow: '0 0 15px rgba(176, 38, 255, 0.8)' },
    { bg: 'radial-gradient(circle, rgba(0, 217, 255, 0.9) 0%, rgba(0, 217, 255, 0) 70%)', shadow: '0 0 15px rgba(0, 217, 255, 0.8)' }
  ];
  let colorIdx = 0;

  function spawnTrail(x, y) {
    const circle = document.createElement('div');
    circle.className = 'cursor-trail';
    
    const size = Math.random() * 16 + 18; 
    const currentTheme = colors[colorIdx % colors.length];
    colorIdx++;

    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.background = currentTheme.bg;
    circle.style.boxShadow = currentTheme.shadow;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    document.body.appendChild(circle);

    setTimeout(() => {
      circle.remove();
    }, 650);
  }
})();

(function initSmooth3DEngine() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.card-3d');

  cards.forEach(card => {
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovered = false;
    let animationFrameId = null;

    function render() {
      currentX += (targetX - currentX) * 0.65;
      currentY += (targetY - currentY) * 0.65;

      const zDepth = isHovered ? 40 : 0;
      card.style.transform = `perspective(1200px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translateZ(${zDepth}px)`;

      if (isHovered || Math.abs(currentX) > 0.05 || Math.abs(currentY) > 0.05) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      }
    }

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(render);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      targetX = ((y - centerY) / centerY) * -11;
      targetY = ((x - centerX) / centerX) * 11;
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
    });
  });
})();
