function renderXpBar() {
  if (!data) return;
  const l = level();
  const into = data.xp - xpToReach(l);
  const need = xpForLevel(l);
  const rank = [...THEMES].reverse().find(unlocked).title;

  $('xpLevel').textContent = 'Level ' + l;
  $('xpRank').textContent = rank;
  $('xpNumbers').textContent = into + ' / ' + need + ' XP';
  $('xpFill').style.width = (into / need * 100) + '%';

  // Find the closest theme that is still locked
  const next = THEMES.filter(t => t.level > l).sort((a, b) => a.level - b.level)[0];
  if (next) {
    const xpToGo = xpToReach(next.level) - data.xp;
    $('xpNext').textContent = `Next theme: ${next.name} at Level ${next.level} (${xpToGo} XP to go)`;
  } else {
    $('xpNext').textContent = 'All themes unlocked';
  }

  // Small pop when you reach a new level
  if (xpBarLastLevel !== null && l > xpBarLastLevel) {
    const card = $('xpCard');
    card.classList.remove('pop');
    void card.offsetWidth;
    card.classList.add('pop');
  }
  xpBarLastLevel = l;
}