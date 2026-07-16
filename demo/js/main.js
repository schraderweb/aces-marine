/* ── Hamburger ── */
const hamburger = document.getElementById('hamburger');
const overlay   = document.getElementById('overlay');
const drawer    = document.getElementById('drawer');
const closeBtn  = document.getElementById('closeBtn');
const hamIcon   = document.getElementById('hamIcon');

function openDrawer() {
  drawer.classList.add('open'); overlay.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open'); overlay.style.display = 'none';
  document.body.style.overflow = '';
}
hamburger?.addEventListener('click', openDrawer);
closeBtn?.addEventListener('click', closeDrawer);
overlay?.addEventListener('click', closeDrawer);

/* ── Review Carousel ── */
const track      = document.getElementById('reviewTrack');
const prevBtn    = document.getElementById('reviewPrev');
const nextBtn    = document.getElementById('reviewNext');
const dots       = document.getElementById('reviewDots');
let scrollPos = 0;

function updateReviewDots() {
  if (!track || !dots) return;
  const cards  = track.querySelectorAll('.review-card');
  const gap    = 16;
  const visW   = track.clientWidth;
  const cardW  = cards[0]?.offsetWidth + gap || 0;
  const total  = cardW * cards.length - gap;
  const max    = Math.max(0, total - visW + gap);
  scrollPos = Math.max(0, Math.min(scrollPos, max));
  const count  = Math.max(1, Math.ceil((total) / visW));
  dots.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const d = document.createElement('span');
    d.className = 'review-dot' + (i === Math.round(scrollPos / (max || 1) * (count - 1)) ? ' active' : '');
    d.addEventListener('click', () => {
      const frac = i / (count - 1); scrollPos = frac * max;
      track.scrollTo({ left: scrollPos, behavior: 'smooth' });
    });
    dots.appendChild(d);
  }
}
prevBtn?.addEventListener('click', () => {
  const cardW = track.querySelector('.review-card')?.offsetWidth + 16 || 300;
  scrollPos = Math.max(0, scrollPos - cardW * 1);
  track.scrollTo({ left: scrollPos, behavior: 'smooth' });
});
nextBtn?.addEventListener('click', () => {
  const cardW = track.querySelector('.review-card')?.offsetWidth + 16 || 300;
  const max   = track.scrollWidth - track.clientWidth;
  scrollPos = Math.min(max, scrollPos + cardW * 1);
  track.scrollTo({ left: scrollPos, behavior: 'smooth' });
});
track?.addEventListener('scroll', () => { scrollPos = track.scrollLeft; updateReviewDots(); });
window.addEventListener('resize', updateReviewDots);
setTimeout(updateReviewDots, 200);

/* ── Project Carousel ── */
let slideIdx = 0;

function slideCarousel(dir) {
  const wrapper = document.getElementById('carouselWrapper');
  if (!wrapper) return;
  const cards = wrapper.querySelectorAll('.project-card');
  if (!cards.length) return;
  const gap   = 16;
  const cardW = cards[0].offsetWidth + gap;
  const total = cardW * cards.length - gap;
  const visW  = wrapper.clientWidth;
  const max   = Math.max(0, total - visW + gap);
  slideIdx = Math.max(0, Math.min(max, slideIdx + dir * cardW));
  wrapper.scrollTo({ left: slideIdx, behavior: 'smooth' });
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
      closeDrawer();
    }
  });
});
