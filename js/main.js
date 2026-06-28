document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initAccordion();
  initSlider();
  initHeaderScroll();
});

/* ---------- Мобильная навигация ---------- */
function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelectorAll('.nav__link');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav_open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav_open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Плавный аккордеон ---------- */
function initAccordion() {
  const items = document.querySelectorAll('.accordion__item');

  items.forEach((item) => {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('accordion__item_open');

      items.forEach((other) => {
        if (other !== item && other.classList.contains('accordion__item_open')) {
          closeItem(other);
        }
      });

      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });

  function openItem(item) {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');
    item.classList.add('accordion__item_open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');
  }

  function closeItem(item) {
    const trigger = item.querySelector('.accordion__trigger');
    const panel = item.querySelector('.accordion__panel');
    item.classList.remove('accordion__item_open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('hidden', '');
  }
}

/* ---------- Слайдер достижений ---------- */
function initSlider() {
  const slider = document.querySelector('.slider');
  if (!slider) return;

  const track = slider.querySelector('.slider__track');
  const slides = Array.from(slider.querySelectorAll('.slider__slide'));
  const prevBtn = slider.querySelector('.slider__arrow--prev');
  const nextBtn = slider.querySelector('.slider__arrow--next');
  const dotsContainer = slider.querySelector('.slider__dots');

  if (!track || slides.length === 0) return;

  let current = 0;
  let autoplayTimer = null;

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'slider__dot';
    dot.type = 'button';
    dot.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
    dot.addEventListener('click', () => goTo(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(slider.querySelectorAll('.slider__dot'));

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, index) => {
      dot.classList.toggle('slider__dot_active', index === current);
    });
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    update();
    resetAutoplay();
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startAutoplay() {
    autoplayTimer = setInterval(next, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
  }, { passive: true });

  update();
  startAutoplay();
}

/* ---------- Тень шапки при скролле ---------- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('header_scrolled', window.scrollY > 8);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
