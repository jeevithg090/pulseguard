const PREFIX = 'pulseguard.';

/**
 * Reads a JSON value from localStorage. Returns `fallback` when storage is
 * unavailable (private mode, SSR, tests), the key is missing, or the stored
 * value is corrupt.
 */
export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Writes a JSON value to localStorage. Failures (quota, disabled storage) are ignored. */
export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

export const STORAGE_PREFIX = PREFIX;
