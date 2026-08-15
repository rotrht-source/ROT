import { getBaseOrigin } from './urlHelper';

const MASTER_KEY_STORAGE = 'platform_master_secret_key';
const MASTER_AUTH_SESSION = 'platform_master_authenticated';
export const DEFAULT_MASTER_KEY = 'rot786';

/**
 * Returns the configured master secret key (defaults to 'rot786')
 */
export function getMasterSecretKey(): string {
  try {
    const saved = localStorage.getItem(MASTER_KEY_STORAGE);
    if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch {
    // fallback
  }
  return DEFAULT_MASTER_KEY;
}

/**
 * Updates the master secret key
 */
export function setMasterSecretKey(newKey: string): void {
  try {
    localStorage.setItem(MASTER_KEY_STORAGE, newKey.trim());
  } catch (e) {
    console.error(e);
  }
}

/**
 * Checks if the current session or URL is authenticated with the master secret key
 */
export function checkMasterAuthentication(): boolean {
  if (typeof window === 'undefined') return false;

  const currentKey = getMasterSecretKey();

  // 1. Check URL parameters (?key=rot786, ?portal=rot786, ?admin_key=rot786, ?master=rot786, ?secret=rot786)
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const urlKey =
      searchParams.get('key') ||
      searchParams.get('portal') ||
      searchParams.get('admin_key') ||
      searchParams.get('master') ||
      searchParams.get('secret') ||
      searchParams.get('master_key');

    if (urlKey && urlKey.trim() === currentKey) {
      // Store authenticated state in session
      sessionStorage.setItem(MASTER_AUTH_SESSION, 'true');
      return true;
    }
  } catch {
    // ignore
  }

  // 2. Check session storage
  try {
    const sessionAuth = sessionStorage.getItem(MASTER_AUTH_SESSION);
    if (sessionAuth === 'true') {
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}

/**
 * Authenticates with a candidate key
 */
export function verifyAndLoginMaster(candidateKey: string): boolean {
  const currentKey = getMasterSecretKey();
  if (candidateKey.trim() === currentKey) {
    try {
      sessionStorage.setItem(MASTER_AUTH_SESSION, 'true');
    } catch {
      // ignore
    }
    return true;
  }
  return false;
}

/**
 * Logs out master session
 */
export function logoutMaster(): void {
  try {
    sessionStorage.removeItem(MASTER_AUTH_SESSION);
  } catch {
    // ignore
  }
}

/**
 * Returns direct secret URL with secret key query param
 */
export function getMasterSecretUrl(): string {
  const origin = getBaseOrigin();
  const key = getMasterSecretKey();
  return `${origin}/?key=${encodeURIComponent(key)}`;
}
