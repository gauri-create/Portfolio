/* ============================================================
   PORTFOLIO — script.js
   Handles: dark mode, nav scroll, mobile menu,
            scroll-reveal animations, active nav link,
            contact form feedback
   ============================================================ */

/* ─── 1. THEME TOGGLE (dark / light) ───────────────────────── */
(function initTheme() {
  const html       = document.documentElement;
  const toggleBtn  = document.getElementById('themeToggle');
  const icon       = document.getElementById('themeIcon');

  // Read saved preference or fallback to system preference
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');

  applyTheme(initial);

  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    icon.textContent = theme === 'dark' ? '☾' : '☀';
    localStorage.setItem('theme', theme);
  }
})();


/* ─── 2. NAVBAR — scroll shadow + hide/show ─────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    // Add border/background when scrolled past 20px
    if (current > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = current;
  }, { passive: true });
})();


/* ─── 3. MOBILE MENU ─────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
})();


/* ─── 4. ACTIVE NAV LINK on scroll ──────────────────────────── */
(function initActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  // Use IntersectionObserver to track which section is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, {
    rootMargin: `-${64}px 0px -50% 0px`, // offset for fixed nav height
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
})();


/* ─── 5. SCROLL REVEAL (fade-in on scroll) ───────────────────── */
(function initScrollReveal() {
  // Target both hero fade-ins and section scroll-reveals
  const elements = document.querySelectorAll('.fade-in, .scroll-reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once visible, no need to keep observing
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,         // trigger when 12% of element is visible
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* ─── 6. CONTACT FORM (UI feedback only — no backend) ────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // no backend

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Simple validation
    if (!name || !email || !message) {
      showNote('Please fill in all fields.', false);
      return;
    }

    // Crude email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNote('Please enter a valid email address.', false);
      return;
    }

    // Simulate submission
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
      showNote('Message sent! I\'ll get back to you soon.', true);
    }, 1000);
  });

  function showNote(msg, success) {
    note.textContent = msg;
    note.style.color = success
      ? 'var(--text-muted)'
      : '#e55a5a';

    // Clear after 5s
    clearTimeout(note._timer);
    note._timer = setTimeout(() => { note.textContent = ''; }, 5000);
  }
})();


/* ─── 7. SMOOTH SCROLL for anchor links ─────────────────────── */
/* (Handled natively via `scroll-behavior: smooth` in CSS,
    but this JS version adds offset for the fixed navbar.)    */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navHeight = document.getElementById('navbar').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});
