const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(returnFocus = false) {
  const wasOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  navigation.classList.remove('open');
  if (returnFocus && wasOpen) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu(true);
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
matchMedia('(min-width: 801px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
