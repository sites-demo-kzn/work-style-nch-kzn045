// Run before body paint. Explicit URL wins; saved preference is scoped to this page.
(() => {
  const root = document.documentElement;
  const allowed = root.dataset.themes.split(',');
  const key = 'workshop-theme:' + location.pathname;
  const requested = new URL(location.href).searchParams.get('theme');
  let saved;
  try { saved = localStorage.getItem(key); } catch { /* Storage may be unavailable for local files. */ }
  const chosen = allowed.includes(requested) ? requested : !requested && allowed.includes(saved) ? saved : root.dataset.theme;
  root.dataset.theme = chosen;
  try { localStorage.setItem(key, chosen); } catch { /* Explicit URL remains usable. */ }
})();
