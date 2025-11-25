/* -----------------------------
   Craftworld-like JS enhancements
   - Injects background video
   - Hero & heading animations
   - Scroll reveal for sections
   - Smooth nav underline & active link
   - Refined particle cursor (gold + purple)
   - Button micro-interactions
   ----------------------------- */

(() => {
  /* ======= VIDEO HERO SETUP ======= */
  function createHeroVideo() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const video = document.createElement('video');
    // replace with your own mp4 if you want; this is a royalty-free demo clip
    video.src = 'https://v.ftcdn.net/03/67/92/14/700_F_367921429_o1PPnOBVH1LugVW43DZnGw3Y5PBiiSoM_ST.mp4';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.className = 'background-video';
    video.setAttribute('aria-hidden', 'true');
    video.brightness = 100;

    // ensure video sits under overlay and content
    hero.prepend(video);

    // subtle slow zoom
    setTimeout(() => {
      video.style.transform = 'scale(1.06)';
    }, 400);
  }

  /* ======= HERO TEXT SPLIT + STAGGER ======= */
  function animateHeroText() {
    const hero = document.querySelector('.hero');
    const title = document.querySelector('.hero-title');
    const sub = document.querySelector('.hero-sub');

    if (!title) return;

    // wrap each letter in span for stagger effect
    const text = title.textContent.trim();
    title.innerHTML = '';
    text.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'hero-letter';
      span.textContent = ch;
      span.style.display = ch === ' ' ? 'inline-block' : 'inline-block';
      span.style.opacity = 0;
      span.style.transform = 'translateY(18px)';
      span.style.transition = 'all 600ms cubic-bezier(.2,.9,.2,1)';
      title.appendChild(span);
    });

    // after small delay animate letters
    setTimeout(() => {
      document.body.classList.add('show-hero'); // also reveals other hero pieces via css
      const letters = title.querySelectorAll('.hero-letter');
      letters.forEach((span, i) => {
        setTimeout(() => {
          span.style.opacity = 1;
          span.style.transform = 'translateY(0)';
        }, i * 28);
      });
      // fade in subtitle slightly after
      if (sub) sub.style.opacity = 1;
    }, 420);
  }

  /* ======= NAVBAR SCROLL BEHAVIOR + ACTIVE LINK ======= */
  function navbarBehavior() {
    const nav = document.querySelector('.navbar');
    const links = Array.from(document.querySelectorAll('.navbar a'));
    const sections = links.map(l => {
      const id = l.getAttribute('href') || '';
      return document.querySelector(id.startsWith('#') ? id : null);
    });

    function onScroll() {
      const y = window.scrollY;
      if (y > 60) {
        nav.style.background = 'linear-gradient(180deg, rgba(4,4,4,0.98), rgba(4,4,4,0.95))';
        nav.style.boxShadow = '0 6px 30px rgba(0,0,0,0.6)';
      } else {
        nav.style.background = 'linear-gradient(180deg, rgba(5,5,5,0.55), rgba(5,5,5,0.45))';
        nav.style.boxShadow = 'none';
      }

      // active link highlighting
      sections.forEach((sec, idx) => {
        if (!sec) return;
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom > 120) {
          links.forEach(a => a.classList.remove('active'));
          links[idx].classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // smooth scroll for nav links (native already handles, but ensure offset for fixed nav)
    links.forEach(a => {
      a.addEventListener('click', (ev) => {
        const href = a.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        ev.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.scrollY - 68;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ======= SCROLL REVEAL (DELAYED) ======= */
  function initScrollReveal() {
    const toReveal = document.querySelectorAll('.about-content, .card, .gallery-item, .portfolio h2');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.12 });

    toReveal.forEach(el => observer.observe(el));
  }

  /* ======= CURSOR PARTICLES (REFINED) ======= */
  function particleCursor() {
    const canvas = document.createElement('canvas');
    canvas.id = 'cursorCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 900;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;
    const particles = [];

    window.addEventListener('resize', () => {
      w = canvas.width = innerWidth;
      h = canvas.height = innerHeight;
    });

    document.addEventListener('mousemove', (e) => {
      // create a burst of small particles with purple/gold hues
      const count = Math.random() > 0.85 ? 8 : 4;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: e.clientX + (Math.random() - .5) * 6,
          y: e.clientY + (Math.random() - .5) * 6,
          r: Math.random() * 3 + 1,
          vx: (Math.random() - .5) * 1.6,
          vy: (Math.random() - .5) * 1.6 - 0.4,
          life: 1,
          decay: 0.02 + Math.random() * 0.02,
          color: Math.random() > 0.6 ? 'rgba(199,154,59,' : 'rgba(155,89,182,'
        });
      }
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.006; // slight float
        p.life -= p.decay;
        const alpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.fillStyle = p.color + alpha + ')';
        ctx.arc(p.x, p.y, p.r * (0.6 + (1 - alpha)), 0, Math.PI * 2);
        ctx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ======= BUTTON MICRO-RIPPLES ======= */
  function buttonEffects() {
    document.querySelectorAll('.btn, .button-style').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-6px)';
        btn.style.boxShadow = '0 18px 48px rgba(0,0,0,0.6)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.boxShadow = '';
      });

      // click ripple
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height) * 1.6;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.12), rgba(255,255,255,0.02))';
        ripple.style.transform = 'scale(0)';
        ripple.style.transition = 'transform 600ms ease, opacity 600ms ease';
        btn.style.position = 'relative';
        btn.appendChild(ripple);
        requestAnimationFrame(() => ripple.style.transform = 'scale(1)');
        setTimeout(() => {
          ripple.style.opacity = '0';
          setTimeout(()=> ripple.remove(), 650);
        }, 300);
      });
    });
  }

  /* ======= INIT ALL ======= */
  function init() {
    createHeroVideo();
    animateHeroText();
    navbarBehavior();
    initScrollReveal();
    particleCursor();
    buttonEffects();

    // reveal hero after resources ready
    setTimeout(()=> document.documentElement.classList.add('hero-ready'), 700);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
