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
/* ─── 6. CONTACT FORM (Netlify AJAX Submission) ────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm'); // Matches id="contactForm"
  const note = document.getElementById('formNote');    // Matches id="formNote"

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents the default page reload

    const btn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // UI Feedback: Disable button and show "Sending..."
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Send the data to Netlify via a POST request
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then((response) => {
        if (response.ok) {
          form.reset();
          showNote("Message sent! I'll get back to you soon.", true);
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch((error) => {
        showNote("Oops! Something went wrong. Please try again.", false);
      })
      .finally(() => {
        // Re-enable button after 1 second
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.disabled = false;
        }, 1000);
      });
  });

  function showNote(msg, success) {
    note.textContent = msg;
    // Uses your CSS variables for a consistent look
    note.style.color = success ? 'var(--text-muted)' : '#e55a5a';

    // Clear the notification after 5 seconds
    clearTimeout(note._timer);
    note._timer = setTimeout(() => {
      note.textContent = '';
    }, 5000);
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
