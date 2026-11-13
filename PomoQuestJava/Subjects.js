
let activeSub = null;   
let viewUrl = null;   

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

function renderSubs() {
  $('subs').innerHTML = '';
  data.subjects.forEach(s => {
    const b = document.createElement('button');
    b.className = 'chip' + (s.id === activeSub ? ' on' : '');
    b.textContent = s.name;
    b.onclick = () => { activeSub = s.id; renderSubs(); renderFiles(); };
    $('subs').append(b);
  });
  $('subEmpty').classList.toggle('hidden', data.subjects.length > 0);
  $('subPanel').classList.toggle('hidden', !activeSub);
  if (activeSub) $('subTitle').textContent = data.subjects.find(s => s.id === activeSub).name;
}

$('subForm').onsubmit = e => {
  e.preventDefault();
  const name = $('subName').value.trim();
  if (!name) return;
  const s = { id: 's' + Date.now(), name, files: [] };
  data.subjects.push(s);
  activeSub = s.id;
  save();
  $('subName').value = '';
  renderSubs();
  renderFiles();
};

$('delSub').onclick = async () => {
  const s = data.subjects.find(x => x.id === activeSub);
  if (!confirm(`Delete "${s.name}" and its files?`)) return;
  for (const f of s.files) await delFile(f.id);
  data.subjects = data.subjects.filter(x => x.id !== activeSub);
  activeSub = null;
  save();
  renderSubs();
  $('viewer').innerHTML = '';
};

$('fileIn').onchange = async e => {
  const s = data.subjects.find(x => x.id === activeSub);
  for (const f of e.target.files) {
    const id = 'f' + Date.now() + Math.random().toString(36).slice(2, 6);
    await putFile({ id, blob: f, type: f.type, name: f.name });
    s.files.push({ id, name: f.name, type: f.type });
  }
  e.target.value = '';
  save();
  renderFiles();
  toast('Files saved');
};

function renderFiles() {
  const s = data.subjects.find(x => x.id === activeSub);
  if (!s) return;
  $('files').innerHTML = '';
  $('viewer').innerHTML = '';
  if (!s.files.length) {
    $('files').innerHTML = '<li><small>No files yet. Upload a PDF, image or notes.</small></li>';
  }
  s.files.forEach(f => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${esc(f.name)}</span>`;

    const view = document.createElement('button');
    view.textContent = 'View';
    view.onclick = () => viewFile(f);

    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.onclick = async () => {
      await delFile(f.id);
      s.files = s.files.filter(x => x.id !== f.id);
      save();
      renderFiles();
    };

    const box = document.createElement('span');
    box.style.display = 'flex';
    box.style.gap = '.4rem';
    box.append(view, remove);
    li.append(box);
    $('files').append(li);
  });
}

async function viewFile(f) {
  const rec = await getFile(f.id);
  if (!rec) return toast('File not found in this browser.');
  if (viewUrl) URL.revokeObjectURL(viewUrl);
  viewUrl = URL.createObjectURL(rec.blob);
  const v = $('viewer');

  if (f.type.startsWith('image/')) {
    v.innerHTML = `<img alt="${esc(f.name)}" src="${viewUrl}">`;
  } else if (f.type === 'application/pdf' || f.type.startsWith('text/')) {
    v.innerHTML = `<iframe title="File viewer" src="${viewUrl}"></iframe>`;
  } else {
    v.innerHTML = `<p>This file type cannot be previewed. <a href="${viewUrl}" download="${esc(f.name)}">Download ${esc(f.name)}</a></p>`;
  }
  v.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}