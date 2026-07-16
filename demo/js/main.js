(function() {

  /* ── Mobile Drawer ── */
  const hamburger = document.getElementById('hamburger');
  const hamIcon   = document.getElementById('hamIcon');
  const drawer    = document.getElementById('drawer');
  const overlay   = document.getElementById('overlay');
  const closeBtn  = document.getElementById('closeBtn');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('active');
    hamIcon.className = 'bi bi-x-lg';
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    hamIcon.className = 'bi bi-list';
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
  }
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay)  overlay.addEventListener('click', closeDrawer);

  /* Close drawer on nav link click */
  document.querySelectorAll('.m-nav-btn').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ── Review Carousel ── */
  (function() {
    const track    = document.getElementById('reviewTrack');
    const dotsWrap = document.getElementById('reviewDots');
    const prevBtn  = document.getElementById('reviewPrev');
    const nextBtn  = document.getElementById('reviewNext');
    if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.review-card');
    let current = 0;
    let autoTimer = null;
    let visibleCount = getVisible();
    const total = cards.length;

    function getVisible() {
      return window.innerWidth < 576 ? 1 : window.innerWidth < 992 ? 2 : 3;
    }

    function buildDots() {
      visibleCount = getVisible();
      dotsWrap.innerHTML = '';
      const pages = total - visibleCount + 1;
      for (let i = 0; i < pages; i++) {
        const d = document.createElement('span');
        d.className = 'review-dot' + (i === current ? ' active' : '');
        d.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsWrap.appendChild(d);
      }
    }

    function goTo(index) {
      visibleCount = getVisible();
      const pages = total - visibleCount + 1;
      current = Math.max(0, Math.min(index, pages - 1));
      const cardW = cards[0].offsetWidth + 20;
      track.scrollTo({ left: cardW * current, behavior: 'smooth' });
      dotsWrap.querySelectorAll('.review-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function next() { goTo(current + 1 < total - visibleCount + 1 ? current + 1 : 0); }
    function prev() { goTo(current > 0 ? current - 1 : total - visibleCount); }

    function startAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(next, 3500);
    }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
    nextBtn.addEventListener('click', () => { next(); resetAuto(); });

    track.addEventListener('scroll', () => {
      const cardW = cards[0].offsetWidth + 20;
      current = Math.round(track.scrollLeft / cardW);
      dotsWrap.querySelectorAll('.review-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    });

    track.addEventListener('touchstart', () => clearInterval(autoTimer));
    track.addEventListener('touchend', startAuto);

    window.addEventListener('resize', () => { buildDots(); goTo(0); });

    buildDots();
    startAuto();
  })();

  /* ── Projects Carousel ── */
  (function() {
    let currentSlide = 0;
    let autoPlayTimer = null;
    let isDragging = false;
    let dragStartX = 0;
    let scrollStart = 0;
    let hasDragged = false;

    const wrapper = document.getElementById('carouselWrapper');
    const dots    = document.querySelectorAll('.dot');
    if (!wrapper || !dots.length) return;

    const cards   = wrapper.querySelectorAll('.project-card');
    const total   = cards.length;

    function isMobile() { return window.innerWidth <= 991; }

    function updateDots() {
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    function goToSlide(index) {
      currentSlide = ((index % total) + total) % total;
      const cardWidth = cards[0].offsetWidth + 16;
      wrapper.scrollTo({ left: cardWidth * currentSlide, behavior: 'smooth' });
      updateDots();
    }

    window.slideCarousel = function(dir) { goToSlide(currentSlide + dir); resetAutoPlay(); };
    window.goToSlide = goToSlide;

    wrapper.addEventListener('scroll', () => {
      const cardWidth = cards[0].offsetWidth + 16;
      currentSlide = Math.round(wrapper.scrollLeft / cardWidth);
      updateDots();
    });

    wrapper.addEventListener('mousedown', (e) => {
      isDragging  = true;
      hasDragged  = false;
      dragStartX  = e.pageX;
      scrollStart = wrapper.scrollLeft;
      wrapper.style.cursor = 'grabbing';
      wrapper.style.userSelect = 'none';
      clearInterval(autoPlayTimer);
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const delta = dragStartX - e.pageX;
      if (Math.abs(delta) > 5) hasDragged = true;
      wrapper.scrollLeft = scrollStart + delta;
    });

    window.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      wrapper.style.cursor = '';
      wrapper.style.userSelect = '';
      const cardWidth = cards[0].offsetWidth + 16;
      currentSlide = Math.round(wrapper.scrollLeft / cardWidth);
      goToSlide(currentSlide);
      startAutoPlay();
      if (hasDragged) e.stopPropagation();
    });

    wrapper.addEventListener('touchstart', () => clearInterval(autoPlayTimer), { passive: true });
    wrapper.addEventListener('touchend', startAutoPlay, { passive: true });

    function startAutoPlay() {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(() => goToSlide(currentSlide + 1), 3000);
    }
    function resetAutoPlay() { clearInterval(autoPlayTimer); startAutoPlay(); }

    function toggleControls() {
      document.querySelectorAll('.carousel-arrow, .carousel-dots').forEach(el => {
        el.style.display = isMobile() ? '' : 'none';
      });
    }

    toggleControls();
    window.addEventListener('resize', toggleControls);
    startAutoPlay();
  })();

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
