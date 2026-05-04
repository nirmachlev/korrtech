(() => {
  const deck = document.getElementById('deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const counterNow = document.querySelector('[data-counter-now]');
  const progress = document.querySelector('[data-progress]');
  const total = slides.length;

  const pad = (n) => String(n).padStart(2, '0');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && e.intersectionRatio > 0.55) {
        const idx = slides.indexOf(e.target);
        slides.forEach((s, i) => s.classList.toggle('--in', i === idx));
        if (counterNow) counterNow.textContent = pad(idx + 1);
        if (progress) progress.style.width = ((idx + 1) / total * 100) + '%';
      }
    });
  }, { root: deck, threshold: [0.55, 0.85] });

  slides.forEach((s) => io.observe(s));

  requestAnimationFrame(() => {
    slides[0]?.classList.add('--in');
    if (counterNow) counterNow.textContent = pad(1);
    if (progress) progress.style.width = (1 / total * 100) + '%';
  });

  // Slide IDs that should snap instantly between each other (no smooth scroll)
  // — used so the two equation slides feel like an in-place reveal, not a scroll.
  const INSTANT_PAIRS = new Set(['s03|s04', 's04|s03']);
  const pairKey = (a, b) => `${slides[a]?.id || ''}|${slides[b]?.id || ''}`;

  const goTo = (idx) => {
    const i = Math.max(0, Math.min(total - 1, idx));
    const cur = currentIndex();
    const behavior = INSTANT_PAIRS.has(pairKey(cur, i)) ? 'instant' : 'smooth';
    slides[i].scrollIntoView({ behavior, block: 'start' });
  };
  const currentIndex = () => Math.round(deck.scrollTop / window.innerHeight);

  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    switch (e.key) {
      case 'ArrowDown': case 'PageDown': case ' ': case 'ArrowRight':
        e.preventDefault(); goTo(currentIndex() + 1); break;
      case 'ArrowUp': case 'PageUp': case 'ArrowLeft':
        e.preventDefault(); goTo(currentIndex() - 1); break;
      case 'Home': e.preventDefault(); goTo(0); break;
      case 'End':  e.preventDefault(); goTo(total - 1); break;
    }
  });
})();
