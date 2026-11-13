const FOCUS = 45 * 60;          
const BREAK = 10 * 60;         
const XP_PER_SESSION = 100;     

const LEVEL_BASE = 100;
const LEVEL_GROWTH = 50;


const xpForLevel = l => LEVEL_BASE + LEVEL_GROWTH * (l - 1);


const xpToReach = l => {
  let total = 0;
  for (let i = 1; i < l; i++) total += xpForLevel(i);
  return total;
};       

const THEMES = [
  
  { id: 'default', name: 'Royal Amethyst',       level: 1,  title: 'Novice Scholar' },
  { id: 'coffee',  name: 'Cozy Coffee',          level: 1,  title: 'Novice Scholar' },
  { id: 'forest',  name: 'Emerald Forest',       level: 1,  title: 'Novice Scholar' },
  { id: 'neon',    name: 'Cyberpunk Neon',       level: 1,  title: 'Novice Scholar' },
  { id: 'pastel',  name: 'Pastel Dream',         level: 1,  title: 'Novice Scholar' },
  { id: 'spring',  name: 'Spring',               level: 5,  title: 'Apprentice' },
  { id: 'summer',  name: 'Summer',               level: 10, title: 'Adept' },
  { id: 'autumn',  name: 'Autumn',               level: 15, title: 'Expert' },
  { id: 'winter',  name: 'Winter',               level: 20, title: 'Master' },
  { id: 'aurora',  name: 'Winter Aurora',        level: 25, title: 'Grandmaster' },
  { id: 'blossom', name: 'Cherry Blossom Night', level: 30, title: 'Sage' }
];


const $ = id => document.getElementById(id);


const store = {
  get: (k, d) => {
    try { return JSON.parse(localStorage.getItem(k)) ?? d; }
    catch { return d; }
  },
  set: (k, v) => {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch {}
  }
};


function toast(message) {
  const t = $('toast');
  t.textContent = message;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}