window.ComponentLoader.loadComponents().then(initializeUi);

function initializeUi() {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      siteNav.classList.toggle('is-open', !isOpen);
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        siteNav.classList.remove('is-open');
      });
    });
  }

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  initializeAnimations();
}

function initializeAnimations() {
  const gsap = window.gsap;
  const scrollTrigger = window.ScrollTrigger;

  if (!gsap || !scrollTrigger) {
    initializeFallbackReveals();
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  gsap.registerPlugin(scrollTrigger);

  const ease = 'power4.in';
  const duration = 0.4;

  gsap.from('.site-header', { y: -60, opacity: 0, duration, ease });
  gsap.from('.hero h1 span', {
    y: 40,
    opacity: 0,
    duration,
    ease,
    stagger: 0.05,
    delay: 0.1,
  });
  gsap.from('.hero', { scale: 1.05, duration: 0.8, ease });

  gsap.from('.about-media', {
    clipPath: 'inset(0 100% 0 0)',
    duration: 0.7,
    ease,
    scrollTrigger: { trigger: '.about', start: 'top 75%' },
  });

  gsap.from('.work-card', {
    y: 30,
    opacity: 0,
    duration,
    ease,
    stagger: 0.06,
    scrollTrigger: { trigger: '.work-grid', start: 'top 80%' },
  });

  gsap.from('.service-list li', {
    x: -20,
    opacity: 0,
    duration: 0.3,
    ease,
    stagger: 0.05,
    scrollTrigger: { trigger: '.service-list', start: 'top 85%' },
  });

  gsap.from('.barber-card', {
    y: 30,
    opacity: 0,
    duration,
    ease,
    stagger: 0.08,
    scrollTrigger: { trigger: '.barber-grid', start: 'top 80%' },
  });

  gsap.from('.quote-grid blockquote', {
    opacity: 0,
    duration,
    ease,
    stagger: 0.08,
    scrollTrigger: { trigger: '.quote-grid', start: 'top 80%' },
  });

  gsap.from('.contact-details', {
    x: 40,
    opacity: 0,
    duration,
    ease,
    scrollTrigger: { trigger: '.contact', start: 'top 75%' },
  });

  gsap.from('.site-footer', {
    opacity: 0,
    duration,
    ease,
    scrollTrigger: { trigger: '.site-footer', start: 'top 90%' },
  });
}

function initializeFallbackReveals() {
  if (!('IntersectionObserver' in window)) {
    return;
  }

  const revealSelector =
    '.about-content, .about-media, .section-heading, .work-card, .services-content, .services-photo, .service-list li, .quote-grid blockquote, .barber-card, .contact-copy, .contact-details';
  const revealElements = document.querySelectorAll(revealSelector);
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => {
    const siblings = Array.from(element.parentElement.children).filter(
      (sibling) => sibling.matches(revealSelector),
    );
    const staggerIndex = siblings.indexOf(element);

    element.style.setProperty(
      '--reveal-delay',
      `${Math.min(staggerIndex, 5) * 90}ms`,
    );
    element.classList.add('reveal');
    observer.observe(element);
  });
}
