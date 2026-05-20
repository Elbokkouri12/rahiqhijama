/* ====================================================
   RAHIQ HIJAMA — Main JavaScript
   ==================================================== */

// ========== BOOKING API ==========
// بعد إعداد Google Apps Script، ضع الرابط هنا:
const BOOKING_API = 'https://script.google.com/macros/s/AKfycbyuHMcQv6VeEZDIi-8_Oguf9xPFXnDka-weTGxioRsKDgAi_LGvjvQHLRC287JLulYHnw/exec';

// ========== LOADER ==========
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');

  const hide = () => {
    if (typeof gsap !== 'undefined') {
      gsap.to(loader, {
        opacity: 0, duration: 0.7, ease: 'power2.inOut',
        onComplete: () => { loader.classList.add('hidden'); initAnimations(); }
      });
    } else {
      loader.classList.add('hidden');
      initAnimations();
    }
  };

  setTimeout(hide, 350);
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

// ========== SCROLL PROGRESS BAR ==========
const scrollProgressEl = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  if (!scrollProgressEl) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgressEl.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

// ========== CUSTOM CURSOR ==========
(function() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .package-card, .cert-photo-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
})();

// ========== GSAP ANIMATIONS ==========
function initAnimations() {
  // Fallback: اذا GSAP مش محمّل نستعمل CSS observer
  if (typeof gsap === 'undefined') {
    initCSSAnimations();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ── Hero Timeline ──
  const heroTl = gsap.timeline({ delay: 0.2 });
  heroTl
    .from('.hero-badge', {
      y: -50, opacity: 0, duration: 0.9, ease: 'back.out(2)'
    })
    .from('.hero-word.word-1', {
      y: 80, opacity: 0, duration: 0.8, ease: 'power4.out'
    }, '-=0.4')
    .from('.hero-word.word-2', {
      y: 80, opacity: 0, duration: 0.8, ease: 'power4.out'
    }, '-=0.55')
    .from('.hero-word.word-3', {
      y: 40, opacity: 0, duration: 0.7, ease: 'power3.out'
    }, '-=0.45')
    .from('.hero-desc', {
      y: 30, opacity: 0, duration: 0.7, ease: 'power2.out'
    }, '-=0.4')
    .from('.hero-stats', {
      scale: 0.75, opacity: 0, duration: 0.8, ease: 'back.out(1.8)'
    }, '-=0.35')
    .from('.hero-cta .btn-primary', {
      x: 40, opacity: 0, duration: 0.6, ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-cta .btn-secondary', {
      x: -40, opacity: 0, duration: 0.6, ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-scroll-indicator', {
      y: 20, opacity: 0, duration: 0.6
    }, '-=0.2');

  // ── Hero Parallax (video) ──
  gsap.to('.hero-bg-video', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    },
    y: '28%',
    ease: 'none'
  });

  // ── Hero orbs parallax ──
  gsap.to('.orb-1', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 },
    y: -120, ease: 'none'
  });
  gsap.to('.orb-2', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 3 },
    y: -80, ease: 'none'
  });

  // ── Stats counter with GSAP ──
  ScrollTrigger.create({
    trigger: '.hero-stats',
    start: 'top 88%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.stat-number').forEach(el => {
        const text = el.textContent;
        const match = text.match(/\d+/);
        if (!match) return;
        const target = parseInt(match[0]);
        const prefix = text.slice(0, text.indexOf(match[0]));
        const suffix = text.slice(text.indexOf(match[0]) + match[0].length);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 2.2, ease: 'power2.out',
          onUpdate: () => { el.textContent = prefix + Math.round(obj.val) + suffix; }
        });
      });
    }
  });

  // ── Section Headers ──
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: { trigger: header, start: 'top 88%', once: true },
      y: 60, opacity: 0, duration: 0.9, ease: 'power3.out'
    });
  });

  // ── About Section ──
  gsap.from('.about-visual', {
    scrollTrigger: { trigger: '.about-grid', start: 'top 78%', once: true },
    x: 80, opacity: 0, duration: 1.1, ease: 'power4.out'
  });
  gsap.from('.about-content', {
    scrollTrigger: { trigger: '.about-grid', start: 'top 78%', once: true },
    x: -80, opacity: 0, duration: 1.1, ease: 'power4.out', delay: 0.2
  });
  gsap.from('.feature-item', {
    scrollTrigger: { trigger: '.about-features', start: 'top 85%', once: true },
    x: -30, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out'
  });

  // ── Package Cards — stagger from below ──
  gsap.from('.package-card', {
    scrollTrigger: { trigger: '.packages-grid', start: 'top 82%', once: true },
    y: 100, opacity: 0, duration: 0.8,
    stagger: { each: 0.15, ease: 'power1.in' },
    ease: 'power3.out'
  });

  // ── Service Detail Cards ──
  gsap.from('.service-detail-card', {
    scrollTrigger: { trigger: '.services-grid', start: 'top 82%', once: true },
    y: 60, opacity: 0, scale: 0.92, duration: 0.65,
    stagger: 0.12, ease: 'back.out(1.4)'
  });

  // ── How It Works Steps ──
  gsap.from('.step-item', {
    scrollTrigger: { trigger: '.steps-grid', start: 'top 80%', once: true },
    y: 50, opacity: 0, duration: 0.6,
    stagger: 0.2, ease: 'power2.out'
  });

  // ── Medical Card ──
  gsap.from('.medical-card', {
    scrollTrigger: { trigger: '.medical-card', start: 'top 82%', once: true },
    y: 50, opacity: 0, scale: 0.96, duration: 0.9, ease: 'power3.out'
  });

  // ── Reel Cards ──
  gsap.from('.reel-card', {
    scrollTrigger: { trigger: '.reels-grid', start: 'top 82%', once: true },
    scale: 0.7, opacity: 0, duration: 0.7,
    stagger: 0.15, ease: 'back.out(1.6)'
  });

  // ── Certifications — diagonal cascade ──
  gsap.from('.cert-photo-item', {
    scrollTrigger: { trigger: '.cert-photos-grid', start: 'top 80%', once: true },
    y: 70, opacity: 0, rotation: 4, duration: 0.7,
    stagger: { each: 0.1, from: 'start' },
    ease: 'back.out(1.3)'
  });

  // ── Testimonials — alternating ──
  gsap.utils.toArray('.testi-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', once: true },
      x: i % 2 === 0 ? -60 : 60,
      opacity: 0, duration: 0.8,
      delay: (i % 3) * 0.1,
      ease: 'power3.out'
    });
  });

  // ── Testi stats ──
  gsap.from('.testi-stat', {
    scrollTrigger: { trigger: '.testi-stats', start: 'top 85%', once: true },
    scale: 0.7, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(2)'
  });

  // ── FAQ items ──
  gsap.from('.faq-item', {
    scrollTrigger: { trigger: '.faq-list', start: 'top 82%', once: true },
    x: 50, opacity: 0, duration: 0.5,
    stagger: 0.1, ease: 'power2.out'
  });

  // ── Contact cards ──
  gsap.from('.contact-card', {
    scrollTrigger: { trigger: '.contact-grid', start: 'top 82%', once: true },
    x: 40, opacity: 0, duration: 0.6,
    stagger: 0.12, ease: 'power2.out'
  });
  gsap.from('.contact-map', {
    scrollTrigger: { trigger: '.contact-grid', start: 'top 82%', once: true },
    x: -40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.2
  });

  // ── CTA section ──
  gsap.from('.cta-content > *', {
    scrollTrigger: { trigger: '.cta-section', start: 'top 80%', once: true },
    y: 40, opacity: 0, duration: 0.7,
    stagger: 0.2, ease: 'power3.out'
  });

  // ── Footer ──
  gsap.from('.footer-grid > *', {
    scrollTrigger: { trigger: '.footer-grid', start: 'top 90%', once: true },
    y: 30, opacity: 0, duration: 0.6,
    stagger: 0.12, ease: 'power2.out'
  });

  // ── 3D Card Tilt ──
  document.querySelectorAll('.package-card, .testi-card, .service-detail-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rx = (y - cy) / cy * -7;
      const ry = (x - cx) / cx * 7;
      gsap.to(card, {
        rotationX: rx, rotationY: ry, duration: 0.35,
        ease: 'power1.out', transformPerspective: 900,
        boxShadow: `${-ry * 2}px ${rx * 2}px 40px rgba(10,31,18,0.20)`
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0, rotationY: 0, duration: 0.7,
        ease: 'elastic.out(1, 0.5)',
        boxShadow: '0 4px 16px rgba(10,31,18,0.12)'
      });
    });
  });

  // ── Magnetic Buttons ──
  document.querySelectorAll('.btn-primary, .btn-cta, .btn-book-nav, .fab-book').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.35, y: y * 0.35,
        duration: 0.3, ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });

  // ── Section number counter (testi stats) ──
  ScrollTrigger.create({
    trigger: '.testi-stats',
    start: 'top 88%',
    once: true,
    onEnter: () => {
      document.querySelectorAll('.testi-stat-num').forEach(el => {
        const text = el.textContent;
        const match = text.match(/[\d.]+/);
        if (!match) return;
        const target = parseFloat(match[0]);
        const prefix = text.slice(0, text.indexOf(match[0]));
        const suffix = text.slice(text.indexOf(match[0]) + match[0].length);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.8, ease: 'power2.out',
          onUpdate: () => {
            el.textContent = prefix + (Number.isInteger(target) ? Math.round(obj.val) : obj.val.toFixed(1)) + suffix;
          }
        });
      });
    }
  });
}

// ========== CSS FALLBACK ANIMATIONS ==========
function initCSSAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.animate-fade-up, .reveal, .reveal-left, .reveal-right, .reveal-scale'
  ).forEach(el => observer.observe(el));

  const auto = ['.service-detail-card','.step-item','.faq-item','.contact-card','.cert-photo-item','.testi-stat'];
  document.querySelectorAll(auto.join(', ')).forEach((el, i) => {
    if (!el.classList.contains('reveal') && !el.classList.contains('reveal-scale')) {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 5) * 0.1}s`;
      observer.observe(el);
    }
  });
}

// ========== HERO ANIMATIONS — visible immediately ==========
window.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') {
    setTimeout(() => {
      document.querySelectorAll('.animate-fade-up').forEach(el => el.classList.add('visible'));
    }, 800);
  }
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

// Working hours per day-of-week (0=Sun, 1=Mon, ..., 6=Sat)
const DAY_HOURS = {
  0: { start: 10, end: 15 }, // الأحد
  1: { start: 10, end: 19 }, // الإثنين
  2: { start: 10, end: 19 }, // الثلاثاء
  3: { start: 10, end: 19 }, // الأربعاء
  4: { start: 10, end: 19 }, // الخميس
  5: { start: 15, end: 19 }, // الجمعة
  6: { start: 10, end: 19 }, // السبت
};

async function checkTimeSlots() {
  const dateVal = dateInput.value;
  if (!dateVal) return;

  const slots = document.querySelectorAll('.time-slot');

  // Reset + show loading
  slots.forEach(s => {
    s.classList.remove('booked', 'selected', 'outside-hours');
    s.disabled = true;
    s.classList.add('loading');
  });
  document.getElementById('selectedTime').value = '';

  // Determine which slots are outside this day's working hours
  const [y, m, d] = dateVal.split('-').map(Number);
  const dayOfWeek = new Date(y, m - 1, d).getDay();
  const { start, end } = DAY_HOURS[dayOfWeek];

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
    const hour = parseInt(slot.dataset.time.split(':')[0], 10);
    if (hour < start || hour > end) {
      slot.classList.add('outside-hours');
      slot.disabled = true;
    } else if (booked.includes(slot.dataset.time)) {
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

// Counter animation (CSS fallback when GSAP not available)
function animateCounters() {
  if (typeof gsap !== 'undefined') return; // GSAP handles it
  document.querySelectorAll('.stat-number, .testi-stat-num').forEach(el => {
    const text = el.textContent;
    const match = text.match(/[\d.]+/);
    if (!match) return;
    const target = parseFloat(match[0]);
    const prefix = text.slice(0, text.indexOf(match[0]));
    const suffix = text.slice(text.indexOf(match[0]) + match[0].length);
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

const heroSection = document.getElementById('hero');
if (heroSection) {
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { setTimeout(animateCounters, 400); heroObserver.disconnect(); }
  }, { threshold: 0.4 });
  heroObserver.observe(heroSection);
}

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
