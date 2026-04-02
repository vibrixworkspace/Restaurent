/* ============================================================
   KADHAMBAM – JAVASCRIPT
   Smooth scroll, navbar, menu filter, animations, counters
   ============================================================ */

/* ---- NAVBAR SCROLL BEHAVIOUR ---- */
const navbar  = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 60);
  scrollTopBtn.classList.toggle('visible', scrollY > 400);
  updateOpenStatus();
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- MOBILE HAMBURGER ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- SMOOTH SCROLL FOR ALL ANCHORS ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- HERO PARALLAX (subtle) ---- */
const heroImg = document.querySelector('.hero-img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero     = document.querySelector('.hero');
    if (scrolled < hero.offsetHeight) {
      heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
}

/* ---- MENU TAB FILTER ---- */
const tabBtns  = document.querySelectorAll('.tab-btn');
const menuGrid = document.getElementById('menuGrid');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active tab
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.dataset.category;
    const cards    = menuGrid.querySelectorAll('.menu-card');
    const labels   = menuGrid.querySelectorAll('.menu-category-label');

    // Animate out then filter
    cards.forEach(card => {
      const match = category === 'all' || card.dataset.category === category;
      card.style.transition = 'opacity 0.2s, transform 0.2s';
      if (!match) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => { card.style.display = 'none'; }, 220);
      } else {
        card.style.display = '';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = '';
        }, 30);
      }
    });

    labels.forEach(label => {
      const match = category === 'all' || label.dataset.category === category;
      label.style.display = match ? '' : 'none';
    });
  });
});

/* ---- INTERSECTION OBSERVER – REVEAL ANIMATIONS ---- */
const revealItems = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .reveal-card, .reveal-gallery'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger based on order in NodeList
      const delay = Array.from(revealItems).indexOf(entry.target) % 4 * 80;
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealItems.forEach(el => revealObserver.observe(el));

/* ---- COUNTER ANIMATION ---- */
const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  if (!counters.length) return;

  const firstCounter = counters[0];
  const rect = firstCounter.getBoundingClientRect();
  if (rect.top > window.innerHeight) return;

  countersStarted = true;
  counters.forEach(counter => {
    const target   = +counter.dataset.count;
    const duration = 1800;
    const step     = target / (duration / 16);
    let current    = 0;

    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };
    requestAnimationFrame(update);
  });
}

window.addEventListener('scroll', startCounters, { passive: true });
// Also try on load
setTimeout(startCounters, 800);

/* ---- OPEN STATUS ---- */
function updateOpenStatus() {
  const statusDot  = document.querySelector('.status-dot');
  const statusText = document.getElementById('statusText');
  if (!statusDot || !statusText) return;

  const now  = new Date();
  const hour = now.getHours();
  const min  = now.getMinutes();
  const time = hour + min / 60;

  const isOpen = time >= 12 && time < 23;

  if (isOpen) {
    statusDot.style.background = '#22c55e';
    statusText.textContent = 'Open Now · Closes at 11:00 PM';
    statusText.style.color  = '#22c55e';
  } else {
    statusDot.style.background = '#ef4444';
    statusText.textContent = 'Closed · Opens at 12:00 PM';
    statusText.style.color  = '#ef4444';
    statusDot.style.animation = 'none';
  }
}
updateOpenStatus();

/* ---- SET MIN DATE FOR RESERVATION ---- */
const guestDate = document.getElementById('guestDate');
if (guestDate) {
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  guestDate.min = `${yyyy}-${mm}-${dd}`;
  guestDate.value = `${yyyy}-${mm}-${dd}`;
}

/* ---- RESERVATION FORM HANDLER ---- */
function handleReservation(e) {
  e.preventDefault();
  const form    = document.getElementById('tableForm');
  const success = document.getElementById('formSuccess');
  const btn     = document.getElementById('submitReservation');

  btn.textContent = 'Processing...';
  btn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'block';
    success.style.animation = 'heroFadeIn 0.6s ease forwards';

    // Auto-scroll to success message
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1200);
}

/* ---- GALLERY LIGHTBOX (simple) ---- */
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    const img  = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay span')?.textContent || '';

    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      background:rgba(10,5,2,0.92);
      display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      cursor:pointer;
      animation:heroFadeIn 0.3s ease forwards;
    `;
    const image = document.createElement('img');
    image.src = img.src;
    image.alt = img.alt;
    image.style.cssText = `
      max-width:90vw;max-height:80vh;
      object-fit:contain;
      border-radius:12px;
      box-shadow:0 20px 60px rgba(0,0,0,0.6);
    `;
    const cap = document.createElement('p');
    cap.textContent = caption;
    cap.style.cssText = `
      font-family:'Playfair Display',serif;
      font-style:italic;color:#f0e0c5;
      margin-top:18px;font-size:1.08rem;letter-spacing:0.04em;
    `;
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      position:fixed;top:24px;right:32px;
      background:none;border:none;color:#c8902e;
      font-size:1.8rem;cursor:pointer;z-index:10000;
    `;
    overlay.appendChild(image);
    overlay.appendChild(cap);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      overlay.remove();
      document.body.style.overflow = '';
    };
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close(); });
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', function escHandler(ev) {
      if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); }
    });
  });
});

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const sections = document.querySelectorAll('section[id]');
const navAnchs = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchs.forEach(a => {
        a.classList.toggle('active-link',
          a.getAttribute('href') === '#' + entry.target.id
        );
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));
