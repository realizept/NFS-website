/* Realize Health Seminars — main.js */

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
  });
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// Active nav link highlight
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(link => {
  const linkPath = new URL(link.href, window.location.origin).pathname;
  if (currentPath === linkPath || (currentPath.startsWith(linkPath) && linkPath !== '/')) {
    link.classList.add('active');
  }
});

// Scroll fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ── Contact form (Formspree AJAX) ──────────────────────────────────────
const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    const formData = new FormData(contactForm);
    const action = contactForm.getAttribute('action');

    // If Formspree ID has been set, submit via fetch
    if (action && !action.includes('REPLACE_FORMSPREE_ID')) {
      try {
        const res = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          contactForm.reset();
          contactForm.style.display = 'none';
          if (contactSuccess) contactSuccess.style.display = 'block';
        } else {
          alert('Something went wrong. Please email us directly at info@realizept.com');
        }
      } catch {
        alert('Could not send message. Please email us directly at info@realizept.com');
      }
    } else {
      // Formspree not yet configured — fall back to mailto
      const name    = formData.get('name') || '';
      const subject = formData.get('subject') || 'Website Inquiry';
      const message = formData.get('message') || '';
      window.location.href =
        `mailto:info@realizept.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent('From: ' + name + '\n\n' + message)}`;
      contactForm.reset();
      if (contactSuccess) contactSuccess.style.display = 'block';
    }

    btn.textContent = originalText;
    btn.disabled = false;
  });
}

// ── Treatment Tips notify form ──────────────────────────────────────────
const notifyForm = document.getElementById('notify-form');
if (notifyForm) {
  notifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = notifyForm.querySelector('input[type="email"]').value;
    // Open mailto as a simple fallback until a mailing list service is connected
    window.location.href = `mailto:info@realizept.com?subject=Notify%20Me%3A%20Treatment%20Tips&body=Please%20add%20me%20to%20the%20Treatment%20Tips%20notification%20list.%0A%0AEmail%3A%20${encodeURIComponent(email)}`;
    const msg = notifyForm.querySelector('.form-success');
    if (msg) msg.style.display = 'block';
    notifyForm.querySelector('input').value = '';
  });
}
