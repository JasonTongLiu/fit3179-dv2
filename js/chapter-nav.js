const chapterLinks = [...document.querySelectorAll('[data-chapter-link]')];
const chapterSections = chapterLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function showActiveChapter(id) {
  chapterLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${id}`;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}

chapterLinks.forEach((link) => {
  link.addEventListener('click', () => showActiveChapter(link.hash.slice(1)));
});

if ('IntersectionObserver' in window) {
  const chapterObserver = new IntersectionObserver((entries) => {
    const visibleChapter = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

    if (visibleChapter) showActiveChapter(visibleChapter.target.id);
  }, {
    rootMargin: '-18% 0px -68% 0px',
    threshold: 0
  });

  chapterSections.forEach((section) => chapterObserver.observe(section));
}
