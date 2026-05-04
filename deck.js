(() => {
  const deck = document.getElementById('deck');
  const slides = Array.from(document.querySelectorAll('.slide'));
  const counterNow = document.querySelector('[data-counter-now]');
  const progress = document.querySelector('[data-progress]');
  const total = slides.length;

  const pad = (n) => String(n).padStart(2, '0');

  // IntersectionObserver: track active slide, fire reveal animations
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

  // Initial reveal on first paint
  requestAnimationFrame(() => {
    slides[0]?.classList.add('--in');
    if (counterNow) counterNow.textContent = pad(1);
    if (progress) progress.style.width = (1 / total * 100) + '%';
  });

  // Keyboard navigation
  const goTo = (idx) => {
    const i = Math.max(0, Math.min(total - 1, idx));
    slides[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const currentIndex = () => {
    const top = deck.scrollTop;
    const h = window.innerHeight;
    return Math.round(top / h);
  };

  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        goTo(currentIndex() + 1);
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        goTo(currentIndex() - 1);
        break;
      case 'Home':
        e.preventDefault();
        goTo(0);
        break;
      case 'End':
        e.preventDefault();
        goTo(total - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        goTo(currentIndex() + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        goTo(currentIndex() - 1);
        break;
    }
  });
})();
