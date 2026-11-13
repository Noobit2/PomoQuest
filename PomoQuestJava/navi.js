/* ===== NAVIGATION: switch between Timer, Music, Subjects, Themes ===== */
const VIEWS = ['timer', 'music', 'subjects', 'themes'];

function showView(view) {
  if (!VIEWS.includes(view)) view = 'timer';
  document.body.dataset.view = view;

  // Show only the selected page. Music stays loaded off-screen so the song keeps playing.
  document.querySelectorAll('[data-page]').forEach(s => {
    const here = s.dataset.page === view;
    s.hidden = !here && s.dataset.page !== 'music';
    s.classList.toggle('offscreen', !here && s.dataset.page === 'music');
  });

  document.querySelectorAll('#nav button').forEach(b => {
    const on = b.dataset.view === view;
    b.classList.toggle('on', on);
    b.setAttribute('aria-current', on ? 'page' : 'false');
  });
  store.set('pq_view', view);
  window.scrollTo({ top: 0 });
}

// Connect each nav button to its page
document.querySelectorAll('#nav button').forEach(b => {
  b.onclick = () => showView(b.dataset.view);
});


showView(store.get('pq_view', 'timer'));