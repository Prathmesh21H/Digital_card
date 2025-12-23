// src/lib/storage.js
export const loadState = (key) => {
    try { return JSON.parse(localStorage.getItem(key)); }
    catch { return null; }
  };
  export const saveState = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  };
  export const clearState = () => { localStorage.clear(); };