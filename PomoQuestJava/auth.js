let signup = false;   
let me = null;        
let data = null;    

async function hash(text) {
  if (!crypto.subtle) return btoa(unescape(encodeURIComponent(text)));
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(x => x.toString(16).padStart(2, '0')).join('');
}

$('authSwap').onclick = () => {
  signup = !signup;
  $('authBtn').textContent = signup ? 'Create account' : 'Log in';
  $('authSwap').textContent = signup ? 'Have an account? Log in' : 'No account? Sign up';
  $('authErr').textContent = '';
};

$('authForm').onsubmit = async e => {
  e.preventDefault();
  const u = $('user').value.trim().toLowerCase();
  const h = await hash($('pass').value);
  const users = store.get('pq_users', {});

  if (signup) {
    if (users[u]) return ($('authErr').textContent = 'That username is taken. Choose another.');
    users[u] = h;
    store.set('pq_users', users);
  } else if (users[u] !== h) {
    return ($('authErr').textContent = 'Wrong username or password.');
  }
  store.set('pq_session', u);
  enter(u);
};

$('logout').onclick = () => {
  store.set('pq_session', null);
  location.reload();
};

function save() { store.set('pq_data_' + me, data); }


function enter(u) {
  me = u;
  data = store.get('pq_data_' + u, { xp: 0, theme: 'default', subjects: [], spotify: '' });
  $('auth').classList.add('hidden');
  $('app').classList.remove('hidden');
  $('who').textContent = u;
  renderLevel();
  renderThemes();
  renderSubs();
  resetTimer();
  if (data.spotify) loadSpotify(data.spotify);
}