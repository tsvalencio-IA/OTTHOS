(() => {
  'use strict';

  const DB_NAME = 'otthos-life-world';
  const DB_VERSION = 1;
  const STORE = 'profiles';
  const SLOT = 'main';

  function openDB() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB indisponível'));
        return;
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'slot' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('Falha ao abrir IndexedDB'));
    });
  }

  async function transaction(mode, callback) {
    const db = await openDB();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        let result;
        try { result = callback(store); } catch (error) { reject(error); return; }
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(tx.error || new Error('Falha na transação IndexedDB'));
        tx.onabort = () => reject(tx.error || new Error('Transação IndexedDB cancelada'));
      });
    } finally {
      db.close();
    }
  }

  async function load() {
    const db = await openDB();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const req = tx.objectStore(STORE).get(SLOT);
        req.onsuccess = () => resolve(req.result?.data || null);
        req.onerror = () => reject(req.error || new Error('Falha ao ler save'));
      });
    } finally {
      db.close();
    }
  }

  async function save(data) {
    const clean = JSON.parse(JSON.stringify(data));
    await transaction('readwrite', store => store.put({ slot: SLOT, data: clean, savedAt: Date.now(), schema: 601 }));
    return true;
  }

  async function clear() {
    await transaction('readwrite', store => store.delete(SLOT));
    return true;
  }

  async function exportFile(data) {
    const payload = {
      product: 'Otthos Life World',
      schema: 601,
      exportedAt: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(data))
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `otthos-save-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function importFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result || ''));
          const data = parsed?.data || parsed;
          if (!data || typeof data !== 'object' || !data.profile) throw new Error('Arquivo de progresso inválido');
          resolve(data);
        } catch (error) { reject(error); }
      };
      reader.onerror = () => reject(reader.error || new Error('Falha ao ler arquivo'));
      reader.readAsText(file);
    });
  }

  async function requestPersistentStorage() {
    try {
      if (!navigator.storage?.persist) return false;
      return await navigator.storage.persist();
    } catch { return false; }
  }

  window.OTTHOS_DB = Object.freeze({
    name: DB_NAME,
    schema: 601,
    load,
    save,
    clear,
    exportFile,
    importFile,
    requestPersistentStorage
  });
})();
