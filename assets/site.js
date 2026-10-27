(() => {
  const root = document.documentElement;
  const allowed = root.dataset.themes.split(',');
  const key = 'workshop-theme:' + location.pathname;
  const dialog = document.querySelector('.theme-dialog');
  const opener = document.querySelector('.theme-open');
  const buttons = [...document.querySelectorAll('.theme-choice')];
  const names = Object.fromEntries(buttons.map(b => [b.dataset.choice, b.querySelector('span:nth-child(2)').textContent.replace(/^0\d/, '')]));
  function sync(theme, announce = false) {
    root.dataset.theme = theme;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.choice === theme)));
    const label = document.querySelector('.current-theme');
    if (label) label.textContent = names[theme];
    const link = document.querySelector('.theme-link');
    if (link) {
      const url = new URL(location.href); url.searchParams.set('theme', theme);
      link.href = url.href;
    }
    if (announce) document.querySelector('.theme-status').textContent = 'Выбран вариант «' + names[theme] + '»';
  }
  sync(root.dataset.theme);
  opener?.addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('dialog-open');
    updateBar();
    dialog.querySelector('[aria-pressed="true"]').focus();
  });
  dialog?.querySelector('.theme-close').addEventListener('click', () => dialog.close());
  dialog?.addEventListener('close', () => { document.body.classList.remove('dialog-open'); opener.focus({ preventScroll: true }); });
  dialog?.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll('button,a[href]')];
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  dialog?.addEventListener('click', e => {
    const r = dialog.getBoundingClientRect();
    if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close();
  });
  buttons.forEach(button => button.addEventListener('click', () => {
    const theme = button.dataset.choice;
    if (!allowed.includes(theme)) return;
    sync(theme, true);
    const url = new URL(location.href); url.searchParams.set('theme', theme);
    try { history.replaceState(null, '', url); } catch { /* file:// may restrict history. */ }
    try { localStorage.setItem(key, theme); } catch { /* URL links still work. */ }
  }));
  window.addEventListener('popstate', () => {
    const theme = new URL(location.href).searchParams.get('theme');
    if (allowed.includes(theme)) sync(theme);
  });
  document.querySelectorAll('.mobile-nav a').forEach(link => link.addEventListener('click', () => {
    link.closest('details').open = false;
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !dialog?.open) {
      const menu = document.querySelector('.mobile-nav[open]');
      if (menu) { menu.open = false; menu.querySelector('summary').focus(); }
    }
  });
  // Do not cover the initial heading/action with a duplicate fixed action.
  const action = document.querySelector('.hero-actions .button');
  const bar = document.querySelector('.action-bar');
  function updateBar() {
    const passed = action ? action.getBoundingClientRect().bottom < 0 : scrollY > 200;
    document.body.classList.toggle('show-actions', passed && !dialog?.open);
  }
  addEventListener('scroll', updateBar, { passive: true });
  addEventListener('resize', updateBar);
  dialog?.addEventListener('close', updateBar);
  updateBar();
  document.addEventListener('focusin', event => {
    if (!bar || !document.body.classList.contains('show-actions') || bar.contains(event.target) || dialog?.open) return;
    const r = event.target.getBoundingClientRect(), b = bar.getBoundingClientRect();
    if (r.bottom > b.top && b.height > 0) scrollBy({ top: r.bottom - b.top + 16, behavior: 'instant' });
  });
})();
