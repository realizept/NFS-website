/* Realize Health Seminars — main.js */

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const expanded = navLinks.classList.contains('open');
    navToggle.setAttribute('aria-expanded', expanded);
  });
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });
}

// Active nav link
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
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Testimonial carousel (home page)
const carousel = document.querySelector('.testimonial-carousel');
if (carousel) {
  const slides = carousel.querySelectorAll('.testimonial-slide');
  const dots   = carousel.querySelectorAll('.carousel-dot');
  let current  = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function autoPlay() {
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  if (slides.length) {
    slides[0].classList.add('active');
    dots[0]?.classList.add('active');
    autoPlay();

    carousel.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => { clearInterval(timer); goTo(i); autoPlay(); });
    });
    carousel.querySelector('.carousel-prev')?.addEventListener('click', () => { clearInterval(timer); goTo(current - 1); autoPlay(); });
    carousel.querySelector('.carousel-next')?.addEventListener('click', () => { clearInterval(timer); goTo(current + 1); autoPlay(); });
  }
}

// Email form (blog page)
const emailForm = document.getElementById('notify-form');
if (emailForm) {
  emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = emailForm.querySelector('.form-success');
    if (msg) msg.style.display = 'block';
    emailForm.querySelector('input').value = '';
  });
}

// Contact form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = document.getElementById('contact-success');
    if (msg) msg.style.display = 'block';
    contactForm.reset();
  });
}
