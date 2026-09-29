/* ============================================================
   GANGAULI TIMES — MAIN JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- 1. LANGUAGE TOGGLE ---- */
  const body = document.body;
  const langBtnEn = document.getElementById('lang-en');
  const langBtnHi = document.getElementById('lang-hi');

  function setLanguage(lang) {
    if (lang === 'en') {
      body.classList.remove('lang-hi');
      body.classList.add('lang-en');
      if (langBtnEn) langBtnEn.classList.add('active');
      if (langBtnHi) langBtnHi.classList.remove('active');
      localStorage.setItem('gt-lang', 'en');
    } else {
      // Default: Hindi
      body.classList.remove('lang-en');
      body.classList.add('lang-hi');
      if (langBtnHi) langBtnHi.classList.add('active');
      if (langBtnEn) langBtnEn.classList.remove('active');
      localStorage.setItem('gt-lang', 'hi');
    }
  }

  // Restore saved language — default to Hindi
  const savedLang = localStorage.getItem('gt-lang') || 'hi';
  setLanguage(savedLang);

  if (langBtnEn) langBtnEn.addEventListener('click', () => setLanguage('en'));
  if (langBtnHi) langBtnHi.addEventListener('click', () => setLanguage('hi'));



  /* ---- 2. HERO SLIDER ---- */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  let currentSlide = 0;
  let sliderTimer = null;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length;
    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startAutoplay() {
    sliderTimer = setInterval(nextSlide, 5000);
  }
  function resetAutoplay() {
    clearInterval(sliderTimer);
    startAutoplay();
  }

  if (slides.length > 0) {
    goToSlide(0);
    startAutoplay();

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoplay(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); resetAutoplay(); });
    });

    // Touch/swipe support
    let touchStartX = 0;
    const sliderEl = document.querySelector('.hero-slider');
    if (sliderEl) {
      sliderEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
      sliderEl.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); resetAutoplay(); }
      });
    }
  }


  /* ---- 3. NAVBAR SCROLL EFFECT ---- */
  const navbar = document.querySelector('.navbar');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 60);
    }
    if (backToTop) {
      backToTop.classList.toggle('visible', scrollY > 400);
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ---- 4. HAMBURGER MOBILE MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    // Close on link click
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }


  /* ---- 5. SCROLL REVEAL ANIMATIONS ---- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    revealElements.forEach(el => el.classList.add('visible'));
  }


  /* ---- 6. COUNTER ANIMATION ---- */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString() + (progress >= 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-target]');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }


  /* ---- 7. ACTIVE NAV LINK ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });


  /* ---- 8. CONTACT FORM HANDLER ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span>&#10003;</span> <span class="en">Message Sent!</span><span class="hi">संदेश भेजा गया!</span>';
      btn.style.background = '#22c55e';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }


  /* ---- 9. GALLERY LIGHTBOX (simple) ---- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    // Create lightbox
    const lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;display:none;align-items:center;justify-content:center;cursor:zoom-out;`;
    lb.innerHTML = `<img id="lb-img" style="max-width:90vw;max-height:90vh;border-radius:8px;object-fit:contain;" /><button id="lb-close" style="position:absolute;top:20px;right:24px;background:none;border:none;color:white;font-size:36px;cursor:pointer;line-height:1;">&times;</button>`;
    document.body.appendChild(lb);

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lb.style.display = 'flex';
          document.getElementById('lb-img').src = img.src;
          document.body.style.overflow = 'hidden';
        }
      });
    });

    lb.addEventListener('click', e => {
      if (e.target === lb || e.target.id === 'lb-close') {
        lb.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- 10. RESPONSIVE FACEBOOK IFRAME WIDTH (No right-side clipping) ---- */
  function updateFbIframeWidth() {
    const frameBox = document.querySelector('.fb-native-frame-box');
    const iframe = document.getElementById('fb-live-iframe');
    if (!frameBox || !iframe) return;
    const boxWidth = Math.floor(frameBox.clientWidth);
    if (!boxWidth) return;
    // Facebook Page plugin width must be between 180 and 500
    const targetWidth = Math.min(500, Math.max(260, boxWidth));
    const currentParam = iframe.getAttribute('data-applied-width');
    if (currentParam !== String(targetWidth)) {
      iframe.setAttribute('data-applied-width', String(targetWidth));
      iframe.src = 'https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fgangaulitimes&tabs=timeline&width=' + targetWidth + '&height=700&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=false';
    }
  }
  updateFbIframeWidth();
  let fbResizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(fbResizeTimeout);
    fbResizeTimeout = setTimeout(updateFbIframeWidth, 250);
  });

});




