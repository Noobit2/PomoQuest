const level = () => {
  let l = 1;
  while (data.xp >= xpToReach(l + 1)) l++;
  return l;
};
const unlocked = t => level() >= t.level;

function renderLevel() {
  if (!THEMES.some(t => t.id === data.theme)) data.theme = 'default';
  const l = level();
  const into = data.xp - xpToReach(l);
  const need = xpForLevel(l);
  $('lvlTxt').textContent = 'Lv ' + l;
  $('xpBar').style.width = (into / need * 100) + '%';
  $('xpTxt').textContent = into + ' / ' + need + ' XP';
  $('rank').textContent = [...THEMES].reverse().find(unlocked).title;
  document.body.dataset.theme = data.theme;
}

function renderThemes() {
  $('themes').innerHTML = '';
  THEMES.forEach(t => {
    const b = document.createElement('button');
    const ok = unlocked(t);
    b.textContent = ok ? t.name : t.name + ' (Lv ' + t.level + ')';
    b.disabled = !ok;
    if (data.theme === t.id) b.classList.add('on');
    b.onclick = () => {
      data.theme = t.id;
      save();
      renderLevel();
      renderThemes();
    };
    $('themes').append(b);
  });
}

function addXP(amount) {
  const before = level();
  data.xp += amount;
  const after = level();
  save();
  renderLevel();

  if (after > before) {
    const newTheme = THEMES.find(t => t.level === after && t.level > 1);
    toast(newTheme
      ? `Level ${after}! New theme unlocked: ${newTheme.name}`
      : `Level up! You are now level ${after}`);
    renderThemes();
  } else {
    toast('+' + amount + ' XP');
  }
}