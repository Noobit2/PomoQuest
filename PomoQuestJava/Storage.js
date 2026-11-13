
const idb = new Promise((resolve, reject) => {
  const req = indexedDB.open('pomoquest', 1);
  req.onupgradeneeded = () => req.result.createObjectStore('files', { keyPath: 'id' });
  req.onsuccess = () => resolve(req.result);
  req.onerror = () => reject(req.error);
});

async function tx(mode, fn) {
  const db = await idb;
  return new Promise((resolve, reject) => {
    const t = db.transaction('files', mode);
    const request = fn(t.objectStore('files'));
    t.oncomplete = () => resolve(request && request.result);
    t.onerror = () => reject(t.error);
  });
}

const putFile = f  => tx('readwrite', s => s.put(f));
const getFile = id => tx('readonly',  s => s.get(id));
const delFile = id => tx('readwrite', s => s.delete(id));