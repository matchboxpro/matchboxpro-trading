// Utility per pulire cache (safe)
export function clearAllLocalData() {
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage?.clear();
    window.sessionStorage?.clear();
    return true;
  } catch {
    return false;
  }
}

// Funzione per forzare il refresh dell'app
export function forceAppRefresh() {
  clearAllLocalData();
  window.location.reload();
}