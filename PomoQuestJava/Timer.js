
let mode = 'focus';  
let left = FOCUS;     
let endAt = 0;        
let tick = null;    

const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

function paint() {
  $('time').textContent = fmt(left);
  $('navTime').textContent = fmt(left);    
  document.title = fmt(left) + ' · PomoQuest';
  document.body.dataset.mode = mode;
  $('modeTxt').textContent = mode === 'focus' ? 'Focus session: 45 minutes' : 'Break: 10 minutes';
  $('startBtn').textContent = tick ? 'Pause' : 'Start';
  $('skipBtn').textContent = mode === 'focus' ? 'Skip to break' : 'Skip to focus';
}


// Short three-note chime when a phase ends
function chime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [660, 880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.25;
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  } catch {}
}

// award = true when the timer finished by itself (not skipped)
function switchMode(award) {
  clearInterval(tick);
  tick = null;
  if (mode === 'focus' && award) addXP(XP_PER_SESSION);
  mode = mode === 'focus' ? 'break' : 'focus';
  left = mode === 'focus' ? FOCUS : BREAK;
  paint();
  if (award) {
    chime();
    if (mode === 'break') startTimer();   // breaks start automatically
  }
}

// Uses an end timestamp so the time stays correct even in background tabs
function startTimer() {
  endAt = Date.now() + left * 1000;
  tick = setInterval(() => {
    left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
    paint();
    if (left <= 0) switchMode(true);
  }, 250);
  paint();
}

function resetTimer() {
  clearInterval(tick);
  tick = null;
  mode = 'focus';
  left = FOCUS;
  paint();
}

$('startBtn').onclick = () => {
  if (tick) { clearInterval(tick); tick = null; paint(); }
  else startTimer();
};
$('resetBtn').onclick = resetTimer;
$('skipBtn').onclick = () => switchMode(false);