document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Footer year
  --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Mobile nav toggle
  --------------------------------------------------------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------
     Typing effect headline
  --------------------------------------------------------- */
  const roleEl = document.getElementById('typing-role');
  const roles = [
    'AI & Data Science Student',
    'Machine Learning Enthusiast',
    'Turning Data Into Decisions',
    'Aspiring Data Analyst'
  ];

  if (roleEl) {
    if (prefersReducedMotion) {
      roleEl.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let charIndex = 0;
      let deleting = false;

      const tick = () => {
        const current = roles[roleIndex];

        if (!deleting) {
          charIndex++;
          roleEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1600);
            return;
          }
        } else {
          charIndex--;
          roleEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        setTimeout(tick, deleting ? 35 : 60);
      };
      tick();
    }
  }

  /* ---------------------------------------------------------
     Scroll reveal
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------
     Skill bar fill on scroll into view
  --------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar span');

  if (!('IntersectionObserver' in window)) {
    skillBars.forEach(bar => bar.style.width = bar.dataset.width + '%');
  } else {
    const barObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.dataset.width + '%';
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });

    skillBars.forEach(bar => barObserver.observe(bar));
  }

  /* ---------------------------------------------------------
     Contact form -> mailto (client-side validation, no backend)
  --------------------------------------------------------- */
  const form = document.getElementById('contact-form');

  if (form) {
    const nameInput = document.getElementById('cf-name');
    const emailInput = document.getElementById('cf-email');
    const messageInput = document.getElementById('cf-message');
    const noteEl = document.getElementById('form-note');

    const errors = {
      name: document.getElementById('err-name'),
      email: document.getElementById('err-email'),
      message: document.getElementById('err-message')
    };

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      Object.values(errors).forEach(el => el.textContent = '');

      if (!nameInput.value.trim()) {
        errors.name.textContent = 'Please enter your name.';
        valid = false;
      }
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        errors.email.textContent = 'Please enter a valid email address.';
        valid = false;
      }
      if (!messageInput.value.trim()) {
        errors.message.textContent = 'Please enter a message.';
        valid = false;
      }

      if (!valid) return;

      const subject = encodeURIComponent(`Portfolio contact from ${nameInput.value.trim()}`);
      const body = encodeURIComponent(
        `${messageInput.value.trim()}\n\n— ${nameInput.value.trim()} (${emailInput.value.trim()})`
      );

      window.location.href = `mailto:shubham.landge@example.com?subject=${subject}&body=${body}`;

      if (noteEl) {
        noteEl.textContent = 'Your email client should have opened with the message ready to send.';
      }
      form.reset();
    });
  }

  /* ---------------------------------------------------------
     Hero constellation canvas (signature visual)
  --------------------------------------------------------- */
  const canvas = document.getElementById('constellation');

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.closest('.hero');
    const colors = ['#F2B84B', '#2DD4BF', '#A78BFA'];

    let width, height, nodes;
    const NODE_COUNT = 46;
    const LINK_DIST = 130;

    function resize() {
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }

    function makeNodes() {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = 'rgba(138, 151, 168,' + (0.18 * (1 - dist / LINK_DIST)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = n.color;
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(step);
    }

    resize();
    makeNodes();
    step();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        makeNodes();
      }, 200);
    });
  }
});
