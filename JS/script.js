const images = {
  sarako: 'assetbio/Sarako-Cell_Sword.png',
  shiro: 'assetbio/Shiro-Baddie.png'
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
  },
  kara: {
    num: 'CHAR.003 // EMERALD/GREEN',
    label: 'CHAR.003 // CHARACTER FILE',
    name: 'KARA SEIRO',
    nameJp: '',
    alias: 'The Emerald Mirage',
    image: 'assetbio/Kara_waterspell.png',
    imageClass: 'emerald',
    voice: 'assetbio/Audio/Kara_tease2.MP3',
    decoWhite: true,
    pos: 'center top',
    quote: '"I already know how this ends. I just like watching you get there."',
    bio: 'A witch of the Mystiara realm, Kara Seiro carries herself with quiet confidence and an almost effortless sense of elegance. Cloaked in emerald, she rarely needs to raise her voice—or even her hand—to make her presence known. Kara prefers observation over confrontation, allowing others to reveal their intentions while she patiently waits for the right moment to act. Beneath her calm demeanor lies a sharp and calculating mind, capable of turning even the smallest detail into an advantage. Her true strength is not found in overwhelming force, but in restraint, precision, and the ability to remain composed when everything around her begins to unravel.',
    personality: 'Placeholder — e.g. Calm · Watchful · Quietly Mischievous',
    weapon: 'Verdantia — Kara\'s signature emerald staff, channeling Mystiara\'s quiet power with precision and restraint.',
    color: 'Emerald Green',
    colorHex: '#00e6a8'
  },
  zairas: {
    num: 'CHAR.004 // YELLOW PSYCHORA',
    label: 'CHAR.004 // CHARACTER FILE',
    name: 'ZAIRAS TAMARO',
    nameJp: '',
    alias: "Zairas's Rose",
    image: 'assetbio/Zai_scene.png',
    imageClass: 'gold',
    pos: 'center top',
    quote: '"A single rose can say what words never could."',
    bio: 'Zairas/Zai-chan offers a rose with a calm smile, turning an ordinary gesture into a scene of quiet charm. Beneath his warm golden presence is someone who understands that gentleness can be deliberate, powerful, and impossible to forget.',
    personality: 'Radiant · Gentle · Quietly Enigmatic',
    weapon: 'Solaric Duskbreaker — A disarming presence that authorizes flames into more influence.',
    color: 'Golden Yellow',
    colorHex: '#ffd447'
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

function openModal(charId, elOrOverrides, maybeOverrides) {
  const base = characterData[charId];
  let el = null;
  let overrides = null;
  if (elOrOverrides instanceof Element) {
    el = elOrOverrides;
    overrides = maybeOverrides || null;
  } else {
    overrides = elOrOverrides || null;
  }
  const data = overrides ? Object.assign({}, base, overrides) : Object.assign({}, base);
  if (!overrides || !('voice' in overrides)) {
    if (el && el.dataset.voice) data.voice = el.dataset.voice;
  }
  const modalImg = document.getElementById('modalImage');
  
  modalImg.classList.remove('img-broken');
  delete modalImg.dataset.fallbackApplied;
  
  modalImg.src = data.image;
  modalImg.alt = data.name;
  modalImg.style.objectPosition = data.pos || 'center top';
  const modalImageDecoEl = document.getElementById('modalImageDeco');
  modalImageDecoEl.textContent = data.num;
  modalImageDecoEl.classList.toggle('deco-white', !!data.decoWhite);
  const modalImageWrap = document.getElementById('modalImageWrap');
  modalImageWrap.className = 'modal-image ' + data.imageClass;
  document.getElementById('modalContent').className = 'modal-content ' + data.imageClass;
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
  const modalMomentWrap = document.getElementById('modalMomentWrap');
  const modalMomentEl = document.getElementById('modalMoment');
  if (data.description) {
    modalMomentEl.textContent = data.description;
    modalMomentWrap.style.display = '';
  } else {
    modalMomentWrap.style.display = 'none';
  }
  const sceneDialogueEl = document.getElementById('sceneDialogue');
  if (sceneDialogueEl) {
    sceneDialogueEl.textContent = data.sceneDialogue || '';
    sceneDialogueEl.hidden = !data.sceneDialogue;
  }
  const modalSections = document.querySelectorAll('.modal-info > .modal-section');
  modalSections.forEach((section, index) => {
    section.style.display = data.sceneOnly && index > 0 ? 'none' : '';
  });
  document.getElementById('modalBio').textContent = data.bio;
  document.getElementById('modalPersonality').textContent = data.personality;
  document.getElementById('modalWeapon').textContent = data.weapon;
  document.getElementById('modalColor').innerHTML = '<span class="color-swatch" style="background:' + data.colorHex + ';color:' + data.colorHex + '"></span>' + data.color;
  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';

  setupSceneAudioControls(!!data.sceneOnly);
  setupVoicePlayer(data.voice);
}

function setupSceneAudioControls(isSceneOnly) {
  const controls = document.getElementById('sceneAudioVolume');
  const slider = document.getElementById('sceneAudioVolumeSlider');
  const audio = document.getElementById('voiceAudio');
  if (!controls || !slider || !audio) return;

  controls.hidden = true;
  controls.classList.remove('is-visible');
  if (!isSceneOnly) return;

  slider.value = '65';
  audio.volume = 0.65;
  slider.oninput = () => {
    audio.volume = Number(slider.value) / 100;
  };
}

function setupVoicePlayer(voiceSrc) {
  const audio = document.getElementById('voiceAudio');
  const btn = document.getElementById('voicePlayBtn');
  const icon = document.getElementById('voicePlayIcon');

  stopVoice();

  if (voiceSrc) {
    audio.src = voiceSrc;
    btn.classList.remove('disabled');
    btn.removeAttribute('disabled');
    btn.style.display = '';
    btn.setAttribute('aria-label', 'Play character voice bio');
  } else {
    audio.removeAttribute('src');
    btn.classList.add('disabled');
    btn.setAttribute('disabled', 'true');
    btn.style.display = 'none';
    btn.setAttribute('aria-label', 'Voice bio not available');
  }
  icon.className = 'fas fa-play';
  btn.classList.remove('playing');
  btn.setAttribute('aria-pressed', 'false');
}

function stopVoice() {
  const audio = document.getElementById('voiceAudio');
  const btn = document.getElementById('voicePlayBtn');
  const icon = document.getElementById('voicePlayIcon');
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  if (icon) icon.className = 'fas fa-play';
  if (btn) {
    btn.classList.remove('playing');
    btn.setAttribute('aria-pressed', 'false');
  }
  const volumeControl = document.getElementById('sceneAudioVolume');
  if (volumeControl) {
    volumeControl.hidden = true;
    volumeControl.classList.remove('is-visible');
  }
}

function toggleVoice(e) {
  if (e) e.stopPropagation();
  const audio = document.getElementById('voiceAudio');
  const btn = document.getElementById('voicePlayBtn');
  const icon = document.getElementById('voicePlayIcon');
  if (!audio || !audio.src || btn.hasAttribute('disabled')) return;

  if (audio.paused) {
    audio.play().catch(() => {});
    icon.className = 'fas fa-pause';
    btn.classList.add('playing');
    btn.setAttribute('aria-pressed', 'true');
    const volumeControl = document.getElementById('sceneAudioVolume');
    if (volumeControl && audio.src.includes('Kara-&-SarakoXmas.MP3')) {
      volumeControl.hidden = false;
      requestAnimationFrame(() => volumeControl.classList.add('is-visible'));
    }
  } else {
    audio.pause();
    icon.className = 'fas fa-play';
    btn.classList.remove('playing');
    btn.setAttribute('aria-pressed', 'false');
    const volumeControl = document.getElementById('sceneAudioVolume');
    if (volumeControl) {
      volumeControl.classList.remove('is-visible');
      window.setTimeout(() => { volumeControl.hidden = true; }, 220);
    }
  }
}

let activeCardAudio = null;

function resetCardAudio(audio) {
  const button = audio.closest('.char-card-image')?.querySelector('.char-audio-btn');
  if (button) {
    button.classList.remove('playing');
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'Play Kara Seiro audio');
    const icon = button.querySelector('i');
    if (icon) icon.className = 'fas fa-play';
  }
}

function toggleCardAudio(e, button) {
  e.stopPropagation();
  const audio = button.closest('.char-card-image')?.querySelector('.char-card-audio');
  if (!audio) return;

  if (activeCardAudio && activeCardAudio !== audio) {
    activeCardAudio.pause();
    activeCardAudio.currentTime = 0;
    resetCardAudio(activeCardAudio);
  }

  if (audio.paused) {
    audio.play().then(() => {
      activeCardAudio = audio;
      button.classList.add('playing');
      button.setAttribute('aria-pressed', 'true');
      button.setAttribute('aria-label', 'Pause Kara Seiro audio');
      const icon = button.querySelector('i');
      if (icon) icon.className = 'fas fa-pause';
    }).catch(() => {});
  } else {
    audio.pause();
    resetCardAudio(audio);
  }
}

let activeGalleryAudio = null;

function resetGalleryAudio(audio) {
  const button = audio.closest('.gallery-item')?.querySelector('.gallery-audio-btn');
  if (button) {
    button.classList.remove('playing');
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'Play Kara Seiro Quiet Hours audio');
    const icon = button.querySelector('i');
    if (icon) icon.className = 'fas fa-play';
  }
  if (activeGalleryAudio === audio) activeGalleryAudio = null;
}

function toggleGalleryAudio(e, button) {
  e.stopPropagation();
  const audio = button.closest('.gallery-item')?.querySelector('.gallery-audio');
  if (!audio) return;

  if (activeGalleryAudio && activeGalleryAudio !== audio) {
    activeGalleryAudio.pause();
    activeGalleryAudio.currentTime = 0;
    resetGalleryAudio(activeGalleryAudio);
  }

  if (audio.paused) {
    audio.play().then(() => {
      activeGalleryAudio = audio;
      button.classList.add('playing');
      button.setAttribute('aria-pressed', 'true');
      button.setAttribute('aria-label', 'Pause Kara Seiro Quiet Hours audio');
      const icon = button.querySelector('i');
      if (icon) icon.className = 'fas fa-pause';
    }).catch(() => {});
  } else {
    audio.pause();
    resetGalleryAudio(audio);
  }
}

document.querySelectorAll('.char-card-audio').forEach((audio) => {
  audio.addEventListener('ended', () => {
    resetCardAudio(audio);
    if (activeCardAudio === audio) activeCardAudio = null;
  });
});

const voiceAudioEl = document.getElementById('voiceAudio');
if (voiceAudioEl) voiceAudioEl.addEventListener('ended', stopVoice);

function closeModal() {
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = '';
  stopVoice();
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
const POLL_CACHE_KEY = 'psychora_poll_cache';

const pollCards = document.querySelectorAll('.poll-card');
const pollStatus = document.getElementById('pollStatus');
const pollTotal = document.getElementById('pollTotal');

function safeStorage(action, key, value) {
  try {
    if (action === 'get') return localStorage.getItem(key);
    if (action === 'set') localStorage.setItem(key, value);
  } catch (e) { /* mode privat / storage penuh: abaikan */ }
  return null;
}

function formatPercent(n) {
  const rounded = Math.round(n * 10) / 10;
  return (Number.isInteger(rounded) ? rounded : rounded.toFixed(1)) + '%';
}

function renderPollResults(counts, total, percentages) {
  counts = counts || {};
  const sum = Object.values(counts).reduce((a, b) => a + (Number(b) || 0), 0);
  total = Number(total) || sum;

  pollCards.forEach((card) => {
    const character = card.dataset.character;
    const votes = Number(counts[character]) || 0;
    // Pakai persentase dari server; kalau tidak ada, hitung sendiri dari jumlah vote.
    const pct = percentages && percentages[character] != null
      ? Number(percentages[character])
      : (total ? (votes / total) * 100 : 0);

    const bar = card.querySelector('.poll-bar');
    const valueEl = card.querySelector('.poll-percent-value');
    const countEl = card.querySelector('.poll-percent-count');
    // scaleX (transform) jauh lebih murah daripada animasi width di HP.
    bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, pct / 100)) + ')';
    valueEl.textContent = formatPercent(pct);
    countEl.textContent = votes + (votes === 1 ? ' vote' : ' votes');
    card.classList.add('has-results');
  });
  pollTotal.textContent = total > 0 ? `${total} total votes` : 'Be the first to vote!';
}

function lockPoll(votedCharacter) {
  pollCards.forEach((card) => {
    card.disabled = true;
    card.classList.toggle('voted', card.dataset.character === votedCharacter);
  });
}

function fetchWithTimeout(url, options, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, Object.assign({}, options, { signal: controller.signal }))
    .finally(() => clearTimeout(timer));
}

let pollLoaded = false;
let pollFetching = false;
let pollLastFetch = 0;

// Server di Railway bisa "tidur" (cold start) sehingga request pertama lambat / gagal.
// Karena itu dicoba beberapa kali dengan jeda yang makin panjang.
async function fetchPollResults() {
  if (pollFetching) return;
  pollFetching = true;
  const delays = [0, 2500, 6000, 12000];
  for (let i = 0; i < delays.length; i++) {
    if (delays[i]) await new Promise((r) => setTimeout(r, delays[i]));
    try {
      const res = await fetchWithTimeout(`${POLL_API_BASE}/results?t=${Date.now()}`, { cache: 'no-store' }, 9000);
      const data = await res.json();
      if (res.ok && data.success) {
        renderPollResults(data.counts, data.total, data.percentages);
        safeStorage('set', POLL_CACHE_KEY, JSON.stringify({ counts: data.counts, total: data.total, percentages: data.percentages }));
        pollLoaded = true;
        pollLastFetch = Date.now();
        pollFetching = false;
        return;
      }
    } catch (err) {
      // timeout / CORS / server offline -> coba lagi
    }
    if (!pollLoaded) pollTotal.textContent = 'Loading live results...';
  }
  pollFetching = false;
  if (!pollLoaded) pollTotal.textContent = 'Live results unavailable right now. Scroll back here to retry.';
}

if (pollCards.length) {
  const alreadyVoted = safeStorage('get', POLL_STORAGE_KEY);
  if (alreadyVoted) {
    lockPoll(alreadyVoted);
    pollStatus.textContent = 'You already voted. Thanks for participating!';
  }

  // Tampilkan hasil terakhir dari cache dulu supaya persentase langsung terlihat.
  try {
    const cached = JSON.parse(safeStorage('get', POLL_CACHE_KEY) || 'null');
    if (cached && cached.counts) renderPollResults(cached.counts, cached.total, cached.percentages);
  } catch (e) { /* cache rusak: abaikan */ }

  // Ambil data terbaru setelah halaman idle, lalu segarkan lagi tiap section vote terlihat.
  const startPollFetch = () => fetchPollResults();
  if ('requestIdleCallback' in window) requestIdleCallback(startPollFetch, { timeout: 2500 });
  else setTimeout(startPollFetch, 800);

  const pollSection = document.getElementById('poll');
  if (pollSection && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && (!pollLoaded || Date.now() - pollLastFetch > 60000)) {
        fetchPollResults();
      }
    }, { threshold: 0.2 }).observe(pollSection);
  }

  // Diagonal slider is hover-driven on desktop (pure CSS). On touch devices
  // there's no hover, so the first tap just expands/previews a card instead
  // of instantly casting a vote — the second tap on an already-expanded
  // card goes through to the real vote handler below.
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) {
    pollCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (card.disabled) return;
        if (!card.classList.contains('is-active')) {
          e.preventDefault();
          e.stopImmediatePropagation();
          pollCards.forEach((c) => c.classList.remove('is-active'));
          card.classList.add('is-active');
        }
      });
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.poll-card')) {
        pollCards.forEach((c) => c.classList.remove('is-active'));
      }
    });
  }

  pollCards.forEach((card) => {
    card.addEventListener('click', async () => {
      if (safeStorage('get', POLL_STORAGE_KEY)) return;
      const character = card.dataset.character;

      pollStatus.textContent = 'Submitting your vote...';
      pollCards.forEach((c) => { c.disabled = true; });

      try {
        const res = await fetchWithTimeout(POLL_API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ character })
        }, 15000);
        const result = await res.json().catch(() => ({}));

        if (res.ok && result.success) {
          safeStorage('set', POLL_STORAGE_KEY, character);
          renderPollResults(result.counts, result.total, result.percentages);
          safeStorage('set', POLL_CACHE_KEY, JSON.stringify({ counts: result.counts, total: result.total, percentages: result.percentages }));
          pollLoaded = true;
          pollLastFetch = Date.now();
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

// Scroll handler: passive + throttled with rAF, and it only touches the DOM when
// the state actually flips (not on every scroll event).
(function initNavScroll() {
  const nav = document.querySelector('.nav-bar');
  if (!nav) return;
  let scrolled = false;
  let ticking = false;
  const update = () => {
    ticking = false;
    const next = window.scrollY > 50;
    if (next !== scrolled) {
      scrolled = next;
      nav.classList.toggle('scrolled', next);
    }
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
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
    this.isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.lastWidth = 0;
    this.lastFrame = 0;
    this.running = false;
    // Phones: ~30fps is plenty for slow drifting dots and halves the CPU/GPU work.
    this.frameInterval = this.isTouch ? 1000 / 30 : 0;
    this.sprites = {};
    this.buildSprites();
    this.resize();
    this.init();

    // Mobile browsers fire "resize" whenever the URL bar shows/hides while scrolling.
    // Re-creating the canvas + particles each time caused visible stutter, so only
    // react when the WIDTH really changes (rotation / window resize), debounced.
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth !== this.lastWidth) { this.resize(); this.init(); }
      }, 200);
    });

    if (!this.isTouch) {
      window.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      }, { passive: true });
    }

    // Stop drawing entirely when the tab is in the background.
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop(); else this.start();
    });
    this.start();
  }
  // Pre-render each glow once; per frame we only drawImage() it instead of
  // creating a new radial gradient for every particle (very expensive).
  buildSprites() {
    ['0, 217, 255', '176, 38, 255'].forEach((color) => {
      const size = 64;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const g = c.getContext('2d');
      const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(' + color + ', 1)');
      grad.addColorStop(1, 'rgba(' + color + ', 0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
      this.sprites[color] = c;
    });
  }
  resize() {
    this.lastWidth = window.innerWidth;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  init() {
    this.particles = [];
    const max = this.isTouch ? 22 : 70;
    const count = Math.min(max, Math.floor(window.innerWidth / (this.isTouch ? 18 : 22)));
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
    if (this.reduceMotion) this.draw(); // one static frame, no loop
  }
  start() {
    if (this.running || this.reduceMotion) return;
    this.running = true;
    requestAnimationFrame((t) => this.animate(t));
  }
  stop() { this.running = false; }
  animate(now) {
    if (!this.running) return;
    requestAnimationFrame((t) => this.animate(t));
    if (this.frameInterval && now - this.lastFrame < this.frameInterval) return;
    this.lastFrame = now;
    this.draw();
  }
  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!this.isTouch) {
        const dx = p.x - this.mouseX;
        const dy = p.y - this.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0 && dist < 120) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }
      }
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      const opacity = Math.max(0, p.opacity * (0.5 + Math.sin(p.pulse) * 0.5));
      const size = Math.max(0.1, p.size);
      const glowRadius = Math.max(0.5, size * 4);
      ctx.globalAlpha = opacity * 0.6;
      ctx.drawImage(this.sprites[p.color], p.x - glowRadius, p.y - glowRadius, glowRadius * 2, glowRadius * 2);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = 'rgb(' + p.color + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
new ParticleSystem(document.getElementById('particles'));

const galleryItems = [
  { img: 'assetbio/Shiro-Baddie-2.jpg', name: 'SHIRO MIAZAKI', tag: 'STORMDUST FORM', charId: 'shiro', pos: 'center top', accent: 'cyan' },
  { img: 'assetbio/DuoBaddie.png', name: 'SARAKO & SHIRO', nameJp: 'サラコとシロ', tag: 'DUO PSYCHORA RIVALS ', description: 'They read the threat together, then locked the field by figuring out a strategy to start fighting.', charId: 'shiro', pos: 'center', accent: 'cyan', nameJpWhite: true, num: 'CHAR.EXEC // DUO AGENTS', decoWhite: true },
  { img: 'assetbio/SarakoRage1.png', name: "SARAKO'S WRATH", tag: 'ENRAGED VOID', charId: 'sarako', pos: 'center', accent: 'purple' },
  { img: 'assetbio/Sarako_Mad.png', name: 'IMMOVABLE DESPAIR', tag: 'SHADOW MODE', charId: 'sarako', pos: 'right center', accent: 'purple' },
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
  { img: 'assetbio/Sarako-Cell-Action.png', name: 'SARAKO KYOGA', nameJp: 'サラコ・キョウガ', tag: 'VIOLET ABYSS SURGE', charId: 'sarako', pos: 'center top', accent: 'purple' },
  {
    img: 'assetbio/Kara_room2.jpg',
    name: 'KARA SEIRO',
    tag: 'QUIET HOURS',
    label: 'CHAR.003 // CHARACTER FILE',
    description: 'Off duty and unguarded — hat set aside on the pillow, coat loosened. Even at rest her smile stays sharp, like she is already three moves ahead.',
    charId: 'kara',
    pos: 'center top',
    accent: 'emerald'
  },
  {
    img: 'assetbio/Kara_think.jpeg',
    name: "WITCH'S GAZE",
    tag: 'SUNLIT REVERIE',
    label: 'CHAR.003 // CHARACTER FILE',
    description: 'A stolen, sunlit moment by the poolside — one eye closed, her thoughts seemingly elsewhere. Beneath her playful expression, Kara remains quietly observant, calculating every detail around her. She appears relaxed, but her composure never truly slips.',
    charId: 'kara',
    pos: '70% top',
    accent: 'emerald'
  },
  {
    img: 'assetbio/Kara_cast.png',
    name: 'SHIVERING EMERATIA',
    tag: 'ARCANE CAST',
    label: 'CHAR.003 // CHARACTER FILE',
    description: 'A focused spell takes shape in Kara\'s hands, illuminating the quiet confidence behind her measured control.',
    charId: 'kara',
    pos: '65% center',
    accent: 'emerald'
  },
  {
    img: 'assetbio/Kara_cute.png',
    name: 'TEASE TIME',
    tag: 'PLAYFUL GLANCE',
    label: 'CHAR.003 // CHARACTER FILE',
    description: 'A rare playful moment from the Emerald Mirage — bright, teasing, and still impossible to read completely.',
    charId: 'kara',
    pos: 'center center',
    accent: 'emerald'
  },
  {
    img: 'assetbio/Sarako-Enraged.png',
    name: 'SCORCHING DASH',
    tag: 'ENRAGED DARKFLAMES',
    label: 'CHAR.001 // CHARACTER FILE',
    description: 'Sarako draws her blade through a storm of violet darkness, her fury burning brighter than the shadows that surround her. Every movement feels like a warning that restraint has finally been abandoned.',
    sceneDialogue: 'SARAKO: "You mistook my silence for hesitation."\nOPPONENT: "Those flames will consume you too."\nSARAKO: "Then stay close. You will be the first to find out."',
    charId: 'sarako',
    pos: 'center center',
    accent: 'purple'
  },
  {
    img: 'assetbio/Zai_scene.png',
    name: 'ZAIRAS TAMARO',
    tag: 'SOLAR PSYCHORA',
    label: 'CHAR.004 // CHARACTER FILE',
    description: 'Bathed in warm light, Zairas extends a crimson rose with an easy smile. The gesture feels welcoming and intimate, as if the world has briefly paused for a quiet promise.',
    charId: 'zairas',
    pos: 'center top',
    accent: 'gold'
  },
  {
    img: 'assetbio/Xmas-Sarako_and_Kara.jpg',
    name: 'KARA & SARAKO',
    tag: 'WINTER MISCHIEF',
    label: 'SCENE FILE // WINTER EVENING',
    quote: '"Even Sarako cannot escape a little Christmas teasing."',
    description: 'During a warm Christmas evening, Kara playfully reaches toward Sarako while Sarako tries to maintain her usual composure. The decorated cabin, glowing tree, and falling snow turn their teasing exchange into a rare moment of quiet friendship.',
    sceneDialogue: 'KARA: "Hold still, Sarako. You look almost festive."\nSARAKO: "Touch me with that ornament and you will be decorating the tree alone."\nKARA: "There is the holiday spirit."',
    charId: 'kara',
    pos: 'center center',
    accent: 'gold',
    sceneOnly: true,
    voice: 'assetbio/Audio/Kara-&-SarakoXmas.MP3'
  },
  {
    img: 'assetbio/Shiro-cafe.png',
    name: 'SHIRO - BAR ENCOUNTER',
    tag: 'MIDNIGHT REFLECTION',
    label: 'SCENE FILE // AFTER HOURS',
    description: 'A quiet night at the bar gives Shiro a rare moment to lower her guard. Beneath the warm lights and the sharp sweetness of her drink, she watches the city outside as if waiting for the next instinct to speak first.',
    sceneDialogue: 'SHIRO: "The city looks softer from here."\nOPPONENT: "You are unusually quiet tonight."\nSHIRO: "Do not mistake quiet for harmless. I am still watching you."',
    charId: 'shiro',
    pos: 'center center',
    accent: 'cyan',
    sceneOnly: true
  },
  {
    img: 'assetbio/Sarako-raged.webp',
    name: 'SILENT FURY',
    nameJp: 'サラコ・キョウガ',
    tag: 'RAGED STARE',
    label: 'CHAR.001 // CHARACTER FILE',
    description: 'Violet darkflames coil around Sarako as she thrusts her blade forward and locks her glare onto her target. Sparks drift through the night air and her expression stays ice-cold, but the aura surging behind her says her restraint is already gone.',
    sceneDialogue: 'OPPONENT: "Why are you not saying anything?"\nSARAKO: "Because anger does not need words."\nSARAKO: "Run. It is the last kindness I will offer you."',
    charId: 'sarako',
    pos: '80% center',
    accent: 'purple'
  },
  {
    img: 'assetbio/Sarako-preview.png',
    name: 'DARKFLAME VOW',
    nameJp: 'サラコ・キョウガ',
    tag: 'BLADE PREVIEW',
    label: 'CHAR.001 // CHARACTER FILE',
    description: 'Crouched low on a moonlit rooftop under a sea of stars, Sarako raises one arm while her blade burns with black-violet flames. Her coat whips behind her in the wind, and her sharp gaze stays fixed on the fight ahead.',
    sceneDialogue: 'SARAKO: "The night is quiet. Let us see how long it stays that way."\nOPPONENT: "That blade... it is burning with your rage."\nSARAKO: "No. It is burning with my patience running out."',
    charId: 'sarako',
    pos: 'center center',
    accent: 'purple'
  }
];

const galleryGrid = document.getElementById('galleryGrid');
galleryItems.forEach((item, i) => {
  const accentClass = item.accent === 'cyan' ? ' cyan-accent' : item.accent === 'emerald' ? ' emerald-accent' : item.accent === 'gold' ? ' gold-accent' : '';
  const div = document.createElement('div');
  div.className = 'gallery-item reveal' + accentClass;
  div.style.transitionDelay = (i * 0.08) + 's';
  const hasQuietHoursAudio = item.name === 'KARA SEIRO' && item.tag === 'QUIET HOURS';
  div.innerHTML =
    '<img src="' + item.img + '" alt="' + item.name + ' — ' + item.tag + '" loading="lazy" decoding="async" style="object-position: ' + item.pos + '">' +
    (hasQuietHoursAudio ? '<button class="gallery-audio-btn" type="button" onclick="toggleGalleryAudio(event, this)" aria-label="Play Kara Seiro Quiet Hours audio" aria-pressed="false"><i class="fas fa-play" aria-hidden="true"></i></button><audio class="gallery-audio" src="assetbio/Audio/Kara_tease2.MP3" preload="metadata"></audio>' : '') +
    '<div class="gallery-overlay">' +
      '<div class="gallery-name">' + item.name + '</div>' +
      (item.nameJp ? '<div class="gallery-name-jp">' + item.nameJp + '</div>' : '') +
      '<div class="gallery-view">' + item.tag + ' — VIEW →</div>' +
    '</div>';
  const galleryImg = div.querySelector('img');
  galleryImg.addEventListener('error', () => handleImgError(galleryImg), { once: true });
  div.addEventListener('click', () => {
    const base = characterData[item.charId] || {};
    openModal(item.charId, {
      image: item.img,
      imageClass: item.accent === 'cyan' ? 'cyan' : (item.accent === 'emerald' ? 'emerald' : (item.accent === 'gold' ? 'gold' : '')),
      name: item.name,
      label: item.label || base.label || '',
      nameJp: item.nameJp || base.nameJp || '',
      nameJpWhite: !!item.nameJpWhite,
      alias: item.tag,
      quote: item.quote || base.quote || '',
      pos: item.pos || 'center top',
      description: item.description || null,
      sceneDialogue: item.sceneDialogue || null,
      sceneOnly: !!item.sceneOnly,
      num: item.num || base.num || '',
      decoWhite: !!item.decoWhite,
      voice: item.voice || (hasQuietHoursAudio ? 'assetbio/Audio/Kara_tease2.MP3' : null)
    });
  });
  galleryGrid.appendChild(div);
  if (hasQuietHoursAudio) {
    const galleryAudio = div.querySelector('.gallery-audio');
    galleryAudio.addEventListener('ended', () => resetGalleryAudio(galleryAudio));
  }
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
  const activeTrails = new Set();
  const maxActiveTrails = 40;

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
    while (activeTrails.size >= maxActiveTrails) {
      const oldestTrail = activeTrails.values().next().value;
      activeTrails.delete(oldestTrail);
      oldestTrail.remove();
    }

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
    activeTrails.add(circle);

    setTimeout(() => {
      activeTrails.delete(circle);
      circle.remove();
    }, 650);
  }
})();

(function initSmooth3DEngine() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('.card-3d[data-tilt]');

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
/* ==========================================================================
   Ambient BGM Toggle
   - Pure front-end: remembers on/off via localStorage, no server involved.
   - Respects browser autoplay rules (never forces sound before a gesture).
   - Fades volume smoothly and automatically ducks under character voice bios.
   ========================================================================== */
(function initBgmToggle() {
  const STORAGE_KEY = 'psychora-bgm-on';
  const VOLUME_KEY = 'psychora-bgm-volume';
  const DEFAULT_VOLUME = 0.45;
  const FADE_MS = 700;

  const btn = document.getElementById('bgmToggle');
  const audio = document.getElementById('bgmAudio');
  const label = document.getElementById('bgmToggleLabel');
  const volumeSlider = document.getElementById('bgmVolumeSlider');
  const volumeValue = document.getElementById('bgmVolumeValue');
  if (!btn || !audio) return;

  // The volume the user actually wants — separate from whatever the audio
  // element is set to right now (which may be mid-fade or ducked).
  let targetVolume = DEFAULT_VOLUME;
  const savedVolume = parseFloat(window.localStorage.getItem(VOLUME_KEY));
  if (!isNaN(savedVolume) && savedVolume >= 0 && savedVolume <= 1) {
    targetVolume = savedVolume;
  }

  let fadeFrame = null;
  let isPlaying = false;
  let duckedByVoice = false;

  function setVolumeUI(vol) {
    const pct = Math.round(vol * 100);
    if (volumeSlider) volumeSlider.value = String(pct);
    if (volumeValue) volumeValue.textContent = `${pct}%`;
    document.documentElement.style.setProperty('--bgm-vol', `${pct}%`);
  }

  setVolumeUI(targetVolume);

  function fadeTo(target, onDone) {
    if (fadeFrame) cancelAnimationFrame(fadeFrame);
    const start = audio.volume;
    const startTime = performance.now();

    function step(now) {
      const t = Math.min(1, (now - startTime) / FADE_MS);
      audio.volume = start + (target - start) * t;
      if (t < 1) {
        fadeFrame = requestAnimationFrame(step);
      } else {
        fadeFrame = null;
        if (onDone) onDone();
      }
    }
    fadeFrame = requestAnimationFrame(step);
  }

  function updateUI(playing) {
    btn.classList.toggle('playing', playing);
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
    if (label) label.textContent = playing ? 'PAUSE MUSIC' : 'PLAY MUSIC';
  }

  function start() {
    audio.volume = 0;
    audio.play()
      .then(() => {
        isPlaying = true;
        fadeTo(targetVolume);
        updateUI(true);
        window.localStorage.setItem(STORAGE_KEY, 'true');
      })
      .catch(() => {
        // Blocked by autoplay policy — will retry on next user gesture.
      });
  }

  function stop() {
    fadeTo(0, () => {
      audio.pause();
      isPlaying = false;
    });
    updateUI(false);
    window.localStorage.setItem(STORAGE_KEY, 'false');
  }

  btn.addEventListener('click', () => {
    if (isPlaying) {
      stop();
    } else {
      start();
    }
  });

  // Volume slider — direct, immediate control. Cancels any in-flight fade
  // so a manual drag can never fight with the fade-in/fade-out animation.
  if (volumeSlider) {
    volumeSlider.addEventListener('input', () => {
      const vol = Number(volumeSlider.value) / 100;
      targetVolume = vol;
      setVolumeUI(vol);
      window.localStorage.setItem(VOLUME_KEY, String(vol));

      if (fadeFrame) {
        cancelAnimationFrame(fadeFrame);
        fadeFrame = null;
      }
      // While ducked for a voice bio, leave the audible level alone —
      // the new target is remembered and applied once the duck ends.
      if (!duckedByVoice) {
        audio.volume = vol;
      }
    });
  }

  // Resume a previously-enabled session as soon as the visitor interacts
  // anywhere on the page (satisfies autoplay restrictions gracefully).
  if (window.localStorage.getItem(STORAGE_KEY) === 'true') {
    const resumeOnGesture = () => {
      if (!isPlaying) start();
      window.removeEventListener('pointerdown', resumeOnGesture);
      window.removeEventListener('keydown', resumeOnGesture);
    };
    window.addEventListener('pointerdown', resumeOnGesture, { once: true });
    window.addEventListener('keydown', resumeOnGesture, { once: true });
  }

  // Duck the ambient track under character voice bios instead of overlapping them.
  const voiceAudio = document.getElementById('voiceAudio');
  if (voiceAudio) {
    voiceAudio.addEventListener('play', () => {
      if (!isPlaying) return;
      duckedByVoice = true;
      fadeTo(Math.min(0.08, targetVolume));
    });
    const restoreFromDuck = () => {
      if (!duckedByVoice || !isPlaying) return;
      duckedByVoice = false;
      fadeTo(targetVolume);
    };
    voiceAudio.addEventListener('pause', restoreFromDuck);
    voiceAudio.addEventListener('ended', restoreFromDuck);
  }
})();
/* ==========================================================================
   Preloader — circular progress + percentage
   - Eases toward ~92% while real assets are still loading, then completes
     to 100% on window 'load' and fades out.
   - Has a hard safety timeout so the site is never stuck behind the
     loader even if the 'load' event is delayed or JS partly fails.
   ========================================================================== */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const ring = document.getElementById('preloaderRingProgress');
  const percentEl = document.getElementById('preloaderPercentValue');
  const statusEl = document.getElementById('preloaderStatusText');
  if (!preloader || !ring || !percentEl) return;

  const CIRCUMFERENCE = 326.7256;
  const SAFETY_TIMEOUT_MS = 8000;
  const statuses = ['INITIALIZING ARCHIVE', 'LOADING CHARACTER DATA', 'SYNCING VISUALS'];

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
    // Ease toward 92%, never quite reaching it until the real load fires.
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

  // Never let the loader trap the visitor, even on a slow/broken load event.
  setTimeout(finish, SAFETY_TIMEOUT_MS);
})();