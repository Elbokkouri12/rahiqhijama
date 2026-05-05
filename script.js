/* ====================================================
   RAHIQ HIJAMA — Main JavaScript
   ==================================================== */

// ========== BOOKING API ==========
// بعد إعداد Google Apps Script، ضع الرابط هنا:
const BOOKING_API = 'https://script.google.com/macros/s/AKfycbyuHMcQv6VeEZDIi-8_Oguf9xPFXnDka-weTGxioRsKDgAi_LGvjvQHLRC287JLulYHnw/exec';

// ========== LOADER ==========
// DOMContentLoaded يشتغل فور اكتمال HTML — لا ينتظر الفيديوهات والصور
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    initAnimations();
  }, 300);
});

// ========== PARTICLES ==========
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  // صفر على الهاتف لتوفير الأداء
  const count = window.innerWidth < 768 ? 0 : 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 20 + 15}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// throttle بـ rAF — يمنع تشغيل 60 حسابات/ثانية على الـ scroll
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      updateActiveNav();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Close nav clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

// ========== SCROLL ANIMATIONS ==========
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.animate-fade-up, .reveal').forEach(el => observer.observe(el));

  // Add reveal class to section children
  const revealTargets = document.querySelectorAll(
    '.package-card, .cert-card, .service-detail-card, .step-item, .faq-item, .contact-card, .about-content'
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    observer.observe(el);
  });
}

// ========== HERO ANIMATIONS — ALREADY VISIBLE ==========
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.animate-fade-up').forEach(el => {
      el.classList.add('visible');
    });
  }, 1300);
});

// ========== DATE SETUP ==========
const dateInput = document.getElementById('bookingDate');
if (dateInput) {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 1);
  dateInput.min = minDate.toISOString().split('T')[0];

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 60);
  dateInput.max = maxDate.toISOString().split('T')[0];

  dateInput.addEventListener('change', checkTimeSlots);
}

async function checkTimeSlots() {
  const dateVal = dateInput.value;
  if (!dateVal) return;

  const slots = document.querySelectorAll('.time-slot');

  // Reset + show loading
  slots.forEach(s => {
    s.classList.remove('booked', 'selected');
    s.disabled = true;
    s.classList.add('loading');
  });
  document.getElementById('selectedTime').value = '';

  let booked = [];

  if (BOOKING_API) {
    try {
      const res = await fetch(`${BOOKING_API}?action=getSlots&date=${dateVal}`);
      const data = await res.json();
      booked = data.booked || [];
    } catch (e) {
      booked = getLocalBookedSlots(dateVal);
    }
  } else {
    booked = getLocalBookedSlots(dateVal);
  }

  slots.forEach(slot => {
    slot.classList.remove('loading');
    if (booked.includes(slot.dataset.time)) {
      slot.classList.add('booked');
      slot.disabled = true;
    } else {
      slot.disabled = false;
    }
  });
}

function getLocalBookedSlots(dateStr) {
  const bookings = JSON.parse(localStorage.getItem('rahiqBookings') || '[]');
  return bookings.filter(b => b.date === dateStr).map(b => b.time);
}

// ========== TIME SLOTS ==========
document.querySelectorAll('.time-slot').forEach(slot => {
  slot.addEventListener('click', () => {
    if (slot.classList.contains('booked')) return;
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
    document.getElementById('selectedTime').value = slot.dataset.time;
  });
});

// ========== PACK SELECT CARDS ==========
document.querySelectorAll('.pack-select-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.pack-select-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const radio = card.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  });
});

// ========== PACK FROM SERVICES SECTION ==========
function selectPack(num) {
  const section = document.getElementById('booking');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      document.querySelectorAll('.pack-select-card').forEach(card => {
        const pack = card.dataset.pack;
        if (parseInt(pack) === num) {
          card.click();
        }
      });
    }, 600);
  }
}

// ========== MULTI-STEP FORM ==========
let currentStep = 1;
const totalSteps = 4;

const PACK_NAMES = {
  1: 'باك 1 — العلاج (حجامة جافة + حجامة رطبة)',
  2: 'باك 2 — الإسترخاء (مساج رياضي + فوطة نارية)',
  3: 'باك 3 — الراحة (مساج استرخائي + فوطة نارية + حجامة جافة + حجامة رطبة)',
  4: 'باك VIP — رحيق بيو (مساج + فوطة نارية + حجامة جافة + حجامة رطبة + موكسا)'
};
const PACK_PRICES = { 1: 100, 2: 150, 3: 200, 4: 250 };

function nextStep(step) {
  if (!validateStep(step)) return;
  goToStep(step + 1);
}

function prevStep(step) {
  goToStep(step - 1);
}

function goToStep(step) {
  document.getElementById(`form-step-${currentStep}`).classList.remove('active');
  document.getElementById(`step-indicator-${currentStep}`).classList.remove('active');
  document.getElementById(`step-indicator-${currentStep}`).classList.add('completed');

  currentStep = step;
  document.getElementById(`form-step-${currentStep}`).classList.add('active');
  document.getElementById(`step-indicator-${currentStep}`).classList.add('active');
  document.getElementById(`step-indicator-${currentStep}`).classList.remove('completed');

  // Update step lines
  document.querySelectorAll('.step-line').forEach((line, i) => {
    line.classList.toggle('completed', i < currentStep - 1);
  });

  if (step === 4) buildSummary();

  const formEl = document.getElementById('bookingForm');
  if (formEl) {
    formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function validateStep(step) {
  clearErrors();
  if (step === 1) {
    const selected = document.querySelector('input[name="selectedPack"]:checked');
    if (!selected) {
      showError('error-pack');
      return false;
    }
  }
  if (step === 2) {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('selectedTime').value;
    if (!date || !time) {
      showError('error-datetime');
      return false;
    }
  }
  if (step === 3) {
    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const allMedical = ['q_tension','q_sugar','q_heart','q_meds'].every(q =>
      document.querySelector(`input[name="${q}"]:checked`)
    );
    if (!name || !phone || !allMedical) {
      showError('error-personal');
      return false;
    }
    checkMedicalWarning();
  }
  return true;
}

function showError(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 4000);
  }
}

function clearErrors() {
  document.querySelectorAll('.step-error').forEach(e => e.classList.remove('visible'));
}

function checkMedicalWarning() {
  const hasRisk = ['q_tension','q_sugar','q_heart','q_meds'].some(q => {
    const checked = document.querySelector(`input[name="${q}"]:checked`);
    return checked && checked.value === 'yes';
  });
  const warning = document.getElementById('mq-warning');
  if (warning) warning.style.display = hasRisk ? 'flex' : 'none';
}

// React to medical answers
['q_tension','q_sugar','q_heart','q_meds'].forEach(name => {
  document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
    radio.addEventListener('change', checkMedicalWarning);
  });
});

function buildSummary() {
  const packVal = document.querySelector('input[name="selectedPack"]:checked')?.value;
  const date = document.getElementById('bookingDate').value;
  const time = document.getElementById('selectedTime').value;
  const name = document.getElementById('clientName').value;
  const phone = document.getElementById('clientPhone').value;

  const dateFormatted = date ? new Date(date).toLocaleDateString('ar-MA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  }) : '';

  const rows = [
    { label: 'الاسم', value: name },
    { label: 'الهاتف', value: phone },
    { label: 'الباك المختار', value: PACK_NAMES[packVal] || '', highlight: true },
    { label: 'التاريخ', value: dateFormatted },
    { label: 'الوقت', value: formatTime(time) },
  ];

  const container = document.getElementById('confirmationSummary');
  if (!container) return;

  container.innerHTML = `
    ${rows.map(r => `
      <div class="summary-row">
        <span class="summary-label">${r.label}</span>
        <span class="summary-value ${r.highlight ? 'highlight' : ''}">${r.value}</span>
      </div>
    `).join('')}
    <div class="summary-total">
      <span>المبلغ الإجمالي</span>
      <span>${PACK_PRICES[packVal] || 0} درهم</span>
    </div>
  `;
}

function formatTime(time24) {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'م' : 'ص';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

// ========== SUBMIT BOOKING ==========
async function submitBooking() {
  const termsCheck = document.getElementById('termsCheck');
  if (!termsCheck.checked) {
    showError('error-terms');
    return;
  }

  const packVal = document.querySelector('input[name="selectedPack"]:checked')?.value;
  const date    = document.getElementById('bookingDate').value;
  const time    = document.getElementById('selectedTime').value;
  const name    = document.getElementById('clientName').value;
  const phone   = document.getElementById('clientPhone').value;
  const tension = document.querySelector('input[name="q_tension"]:checked')?.value || '-';
  const sugar   = document.querySelector('input[name="q_sugar"]:checked')?.value   || '-';
  const heart   = document.querySelector('input[name="q_heart"]:checked')?.value   || '-';
  const meds    = document.querySelector('input[name="q_meds"]:checked')?.value    || '-';

  const booking = {
    id: Date.now(),
    pack: PACK_NAMES[packVal],
    price: PACK_PRICES[packVal],
    date, time, name, phone,
    createdAt: new Date().toISOString(),
    medical: { tension, sugar, heart, meds }
  };

  // Save locally (instant, works offline)
  const local = JSON.parse(localStorage.getItem('rahiqBookings') || '[]');
  local.push(booking);
  localStorage.setItem('rahiqBookings', JSON.stringify(local));

  // Send to Google Sheets if API configured
  if (BOOKING_API) {
    const params = new URLSearchParams({
      action: 'book', name, phone, date, time,
      pack: PACK_NAMES[packVal],
      price: PACK_PRICES[packVal],
      tension, sugar, heart, meds
    });
    fetch(`${BOOKING_API}?${params}`).catch(() => {});
  }

  // Show success
  const formEl    = document.getElementById('bookingForm');
  const successEl = document.getElementById('bookingSuccess');
  if (formEl) formEl.style.display = 'none';
  if (successEl) {
    successEl.style.display = 'block';
    const dateFormatted = new Date(date).toLocaleDateString('ar-MA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('successDetails').textContent =
      `${name}، تم تسجيل موعدك يوم ${dateFormatted} الساعة ${formatTime(time)} — ${PACK_NAMES[packVal]} — ${PACK_PRICES[packVal]} درهم`;
  }

  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  document.querySelector('.booking-steps').style.opacity = '0';
}

function resetBooking() {
  currentStep = 1;
  document.getElementById('bookingForm').style.display = 'block';
  document.getElementById('bookingForm').reset();
  document.getElementById('bookingSuccess').style.display = 'none';
  document.querySelector('.booking-steps').style.opacity = '1';

  // Reset steps
  for (let i = 1; i <= totalSteps; i++) {
    const step = document.getElementById(`form-step-${i}`);
    const indicator = document.getElementById(`step-indicator-${i}`);
    if (step) step.classList.toggle('active', i === 1);
    if (indicator) {
      indicator.classList.remove('active', 'completed');
      if (i === 1) indicator.classList.add('active');
    }
  }

  document.querySelectorAll('.pack-select-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
  document.querySelectorAll('.step-line').forEach(l => l.classList.remove('completed'));
}

// ========== FAQ ==========
function toggleFaq(btn) {
  const item = btn.parentElement;
  const answer = item.querySelector('.faq-answer');
  const isOpen = answer.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-answer.open').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question.open').forEach(b => b.classList.remove('open'));

  if (!isOpen) {
    answer.classList.add('open');
    btn.classList.add('open');
  }
}

// ========== TESTIMONIALS (static grid — no slider needed) ==========

// ========== GALLERY LIGHTBOX ==========
document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ========== SMOOTH SCROLL FOR NAV ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ========== STATS COUNTER ANIMATION ==========
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const text = el.textContent;
    const match = text.match(/\d+/);
    if (!match) return;
    const target = parseInt(match[0]);
    const prefix = text.slice(0, text.indexOf(match[0]));
    const suffix = text.slice(text.indexOf(match[0]) + match[0].length);
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = prefix + Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    setTimeout(animateCounters, 400);
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });

const heroSection = document.getElementById('hero');
if (heroSection) heroObserver.observe(heroSection);

// Certificate slider
(function() {
  const slider = document.querySelector('.cert-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.cert-slide');
  const dots = slider.querySelectorAll('.cert-dot');
  let current = 0;
  let timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), 3500);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  slider.querySelector('.cert-next').addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  slider.querySelector('.cert-prev').addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetAuto(); }));

  startAuto();
})();

// Cert photo lightbox
document.querySelectorAll('.cert-photo-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    if (!lightbox || !lbImg || !img) return;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.classList.add('active');
  });
});

// ========== REELS GALLERY ==========
document.querySelectorAll('.reel-card').forEach(card => {
  const video = card.querySelector('.reel-video');
  const muteBtn = card.querySelector('.reel-mute-btn');
  const bar = card.querySelector('.reel-bar');

  // Progress bar — فقط على الأجهزة غير الهاتف
  if (window.innerWidth >= 768) {
    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      bar.style.width = (video.currentTime / video.duration * 100) + '%';
    }, { passive: true });
  }
  video.addEventListener('ended', () => { bar.style.width = '0%'; });

  // Mute / unmute toggle
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted
      ? '<i class="fas fa-volume-mute"></i>'
      : '<i class="fas fa-volume-up"></i>';
    muteBtn.classList.toggle('unmuted', !video.muted);
  });
});

// Lazy load + autoplay reels
const reelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target.querySelector('.reel-video');
    if (entry.isIntersecting) {
      if (video.dataset.src && !video.getAttribute('src')) {
        // تحميل الفيديو + تشغيل فور توفر بيانات كافية
        video.setAttribute('src', video.dataset.src);
        video.load();
        video.addEventListener('canplay', () => {
          video.play().catch(() => {});
        }, { once: true });
      } else {
        video.play().catch(() => {});
      }
    } else {
      video.pause();
    }
  });
// rootMargin كبير = يبدأ التحميل 600px قبل وصول المستخدم للقسم
}, { threshold: 0.01, rootMargin: '600px 0px' });

document.querySelectorAll('.reel-card').forEach(card => reelObserver.observe(card));

// iOS: autoplay blocked until user gesture — play visible reels on first touch
document.addEventListener('touchstart', function reelUnlock() {
  document.querySelectorAll('.reel-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    const video = card.querySelector('.reel-video');
    if (rect.top < window.innerHeight + 600 && rect.bottom > -600) {
      if (video.dataset.src && !video.getAttribute('src')) {
        video.setAttribute('src', video.dataset.src);
        video.load();
        video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true });
      } else if (video.paused) {
        video.play().catch(() => {});
      }
    }
  });
  document.removeEventListener('touchstart', reelUnlock);
}, { once: true, passive: true });

// إيقاف الريلز عند إخفاء الصفحة (توفير بطارية + CPU)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    document.querySelectorAll('.reel-video, .hero-bg-video').forEach(v => v.pause());
  }
}, { passive: true });

// ========== HERO VIDEO — mid-speech loop + sound toggle ==========
(function () {
  const VIDEO_START = 0;
  const VIDEO_END   = 46;

  const vid = document.querySelector('.hero-bg-video');
  const btn = document.getElementById('heroSoundBtn');
  if (!vid) return;

  function jumpToStart() {
    vid.currentTime = VIDEO_START;
    vid.play().catch(() => {});
  }

  vid.addEventListener('loadedmetadata', () => {
    vid.currentTime = VIDEO_START;
    vid.play().catch(() => {});
  });

  // بدء تحميل الفيديو فور اكتمال HTML — لا ينتظر الـ load event
  document.addEventListener('DOMContentLoaded', () => {
    if (!vid.getAttribute('src')) {
      const source = vid.querySelector('source');
      if (source) vid.setAttribute('src', source.getAttribute('src'));
    }
    vid.load();
  });

  // throttle timeupdate — فحص 4 مرات/ثانية بدل 30
  let lastCheck = 0;
  vid.addEventListener('timeupdate', () => {
    const now = Date.now();
    if (now - lastCheck < 250) return;
    lastCheck = now;
    if (vid.currentTime >= VIDEO_END) {
      vid.currentTime = VIDEO_START;
    }
  }, { passive: true });

  vid.addEventListener('ended', jumpToStart);

  // iOS: retry play on first user touch in case autoplay was blocked
  document.addEventListener('touchstart', function heroUnlock() {
    if (vid.paused) vid.play().catch(() => {});
    document.removeEventListener('touchstart', heroUnlock);
  }, { once: true, passive: true });

  // Sound toggle button
  if (btn) {
    btn.addEventListener('click', () => {
      vid.muted = !vid.muted;
      const icon = btn.querySelector('i');
      const label = btn.querySelector('span');
      if (vid.muted) {
        icon.className = 'fas fa-volume-mute';
        label.textContent = 'صوت';
        btn.classList.remove('sound-on');
      } else {
        icon.className = 'fas fa-volume-up';
        label.textContent = 'كتم';
        btn.classList.add('sound-on');
      }
    });
  }
})();
