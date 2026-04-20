const revealElements = document.querySelectorAll('.reveal');
const progressBars = document.querySelectorAll('.progress-bar');
const counters = document.querySelectorAll('[data-count]');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

const animateProgress = () => {
  progressBars.forEach((bar) => {
    const target = bar.style.getPropertyValue('--progress');
    bar.style.width = target;
  });
};

const animateCount = (el) => {
  const target = Number(el.dataset.count || 0);
  const duration = 1000;
  const startTime = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const hero = document.querySelector('.hero');
const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateProgress();
        counters.forEach((counter) => animateCount(counter));
        heroObserver.disconnect();
      }
    });
  },
  {
    threshold: 0.35,
  }
);

if (hero) {
  heroObserver.observe(hero);
}

const tiltCards = document.querySelectorAll('.tilt-card');

const resetTilt = (card) => {
  card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
};

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 4;
    const rotateX = (0.5 - (y / rect.height)) * 4;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    resetTilt(card);
  });

  card.addEventListener('touchend', () => {
    resetTilt(card);
  });
});

revealElements.forEach((el, index) => {
  el.style.transitionDelay = `${index * 0.08}s`;
});