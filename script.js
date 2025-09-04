// Mobile menu toggle and basic accessibility helpers
(function () {
  const hamburger = document.querySelector('.hamburger');
  const menu = document.querySelector('#nav-menu');
  const closeBtn = document.querySelector('.menu-close');
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('#hero');
  const contactOpen = document.querySelector('.contact-open');
  const contactModal = document.querySelector('#contact-modal');
  const contactClose = document.querySelector('.contact-close');

  function openMenu() {
    menu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.style.opacity = '1';
  }

  // Contact dialog
  (function initContactDialog() {
    if (!contactOpen || !contactModal) return;
    function open() {
      contactModal.hidden = false;
      contactOpen.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      contactModal.hidden = true;
      contactOpen.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    contactOpen.addEventListener('click', open);
    contactClose && contactClose.addEventListener('click', close);
    contactModal.addEventListener('click', (e) => { if (e.target === contactModal) close(); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !contactModal.hidden) close(); });
  })();

  function closeMenu() {
    menu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (closeBtn) closeBtn.style.opacity = '';
  }

  function toggleMenu() {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (hamburger && menu) {
    hamburger.addEventListener('click', toggleMenu);

    // Close on escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close when clicking a link in the menu (mobile)
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (menu.classList.contains('open')) closeMenu();
      });
    });

    // Close via explicit close button
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }
  }

  // Desktop: transform header into centered pill after slight scroll
  if (header && hero) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastIsPill = false;

    function updateHeader() {
      const isDesktop = window.matchMedia('(min-width: 901px)').matches;
      const scrolledPast = window.scrollY > 40; // a little scroll
      if (!isDesktop) {
        header.classList.remove('pill', 'hide');
        return;
      }
      if (scrolledPast) {
        header.classList.add('pill');
        header.classList.remove('hide');
      } else {
        header.classList.remove('pill');
        header.classList.remove('hide');
      }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('resize', updateHeader);
    updateHeader();
  }
})();

// Reduce motion preference: remove reveal animations if user prefers reduced motion
(function () {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    document.querySelectorAll('.reveal').forEach((el) => {
      el.style.animation = 'none';
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }
})();

// 3D Tilt for About visual
(function () {
  const scene = document.querySelector('.tilt-scene');
  const card = document.querySelector('.tilt-card');
  if (!scene || !card) return;

  let rect;
  const maxTilt = 12; // degrees

  function setTransform(x, y) {
    const px = (x - rect.left) / rect.width;
    const py = (y - rect.top) / rect.height;
    const rotY = (px - 0.5) * (maxTilt * 2);
    const rotX = (0.5 - py) * (maxTilt * 2);
    card.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  }

  function reset() {
    card.classList.remove('is-tilting');
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }

  function onPointerMove(e) {
    card.classList.add('is-tilting');
    rect = scene.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setTransform(clientX, clientY);
  }

  scene.addEventListener('mousemove', onPointerMove);
  scene.addEventListener('touchmove', onPointerMove, { passive: true });
  scene.addEventListener('mouseleave', reset);
  scene.addEventListener('touchend', reset);
})();

