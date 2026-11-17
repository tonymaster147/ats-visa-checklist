const KEY = 'ats-visa-checklist:v1';

/** localStorage can throw (private mode, blocked cookies), so always fail soft. */
export function loadState() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}
