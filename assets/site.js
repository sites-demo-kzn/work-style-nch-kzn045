const viewer = document.querySelector('.lightbox');
const photo = viewer.querySelector('img');
let opener;
document.querySelectorAll('[data-full-photo]').forEach(link => {
  link.addEventListener('click', event => {
    if (typeof viewer.showModal !== 'function') return;
    event.preventDefault();
    opener = link;
    photo.src = link.href;
    photo.alt = link.querySelector('img').alt;
    viewer.querySelector('p').textContent = photo.alt;
    viewer.showModal();
    document.documentElement.style.overflow = 'hidden';
  });
});
viewer.querySelector('button').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
viewer.addEventListener('close', () => {
  document.documentElement.style.overflow = '';
  opener?.focus({ preventScroll: true });
});
