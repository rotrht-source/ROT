import { Store, ViewMode } from '../types';

export const DEFAULT_HOST_DOMAIN = 'rotweb.netlify.app';

/**
 * Returns the current active base URL (e.g. https://rotweb.netlify.app or current window origin)
 */
export function getBaseOrigin(): string {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin;
    }
    return origin || `https://${DEFAULT_HOST_DOMAIN}`;
  }
  return `https://${DEFAULT_HOST_DOMAIN}`;
}

/**
 * Returns the store's primary unique identifier / slug
 */
export function getStoreUniqueId(store: Store | { id: string; branding?: { subdomain?: string } }): string {
  return store.id || store.branding?.subdomain || 'store';
}

/**
 * Returns direct shareable live store link
 */
export function getStoreLiveUrl(store: Store | { id: string; branding?: { subdomain?: string } }): string {
  const origin = getBaseOrigin();
  const slug = getStoreUniqueId(store);
  return `${origin}/?store=${encodeURIComponent(slug)}`;
}

/**
 * Returns direct shareable admin link with unique ID at /admin/<id> or /?admin=<id>
 */
export function getStoreAdminUrl(store: Store | { id: string; branding?: { subdomain?: string } }): string {
  const origin = getBaseOrigin();
  const slug = getStoreUniqueId(store);
  return `${origin}/admin/${encodeURIComponent(slug)}`;
}

/**
 * Returns clean credentials text bundle for copying
 */
export function getStoreAdminCredentialsText(store: Store): string {
  const adminUrl = getStoreAdminUrl(store);
  const liveUrl = getStoreLiveUrl(store);
  const uniqueId = getStoreUniqueId(store);

  return `🔐 ${store.branding.storeName} - অ্যাডমিন এক্সেস তথ্য:
━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 ইউনিক অ্যাডমিন আইডি: ${uniqueId}
🌐 সরাসরি অ্যাডমিন লিংক: ${adminUrl}
📧 ইমেইল / ইউজারনেম: ${store.clientEmail}
🔑 পাসওয়ার্ড: ${store.clientPassword}
━━━━━━━━━━━━━━━━━━━━━━━━━━
🛍️ লাইভ স্টোর লিংক: ${liveUrl}`;
}

/**
 * Parse current URL query params and pathname to determine initial view and store
 */
export function parseUrlRoute(stores: Store[]): {
  viewMode: ViewMode;
  selectedStoreId: string | null;
  isDirectStoreLink: boolean;
} {
  if (typeof window === 'undefined' || !window.location) {
    return { viewMode: 'home', selectedStoreId: null, isDirectStoreLink: false };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const storeParam = searchParams.get('store') || searchParams.get('s') || searchParams.get('shop');
  const adminParam = searchParams.get('admin') || searchParams.get('manage') || searchParams.get('id');
  const viewParam = searchParams.get('view');
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');

  const findStoreMatch = (identifier: string): Store | undefined => {
    const cleanId = identifier.trim().toLowerCase();
    return stores.find(
      (s) =>
        s.id.toLowerCase() === cleanId ||
        s.branding.subdomain.toLowerCase() === cleanId
    );
  };

  // 1. Path-based check: /admin/<unique_id> or /admin
  if (pathname) {
    const segments = pathname.split('/');
    if (segments[0].toLowerCase() === 'admin') {
      if (segments[1]) {
        const matched = findStoreMatch(segments[1]);
        if (matched) {
          return { viewMode: 'client_admin', selectedStoreId: matched.id, isDirectStoreLink: true };
        }
      } else if (adminParam) {
        const matched = findStoreMatch(adminParam);
        if (matched) {
          return { viewMode: 'client_admin', selectedStoreId: matched.id, isDirectStoreLink: true };
        }
      }
      // If /admin is visited directly without params
      return { viewMode: 'client_admin', selectedStoreId: stores[0]?.id || null, isDirectStoreLink: true };
    }

    if (segments[0].toLowerCase() === 'store' && segments[1]) {
      const matched = findStoreMatch(segments[1]);
      if (matched) {
        return { viewMode: 'storefront', selectedStoreId: matched.id, isDirectStoreLink: true };
      }
    }

    // Direct slug pathname e.g. /sajghor
    if (segments.length === 1 && segments[0] !== 'index.html' && segments[0] !== '') {
      const matched = findStoreMatch(segments[0]);
      if (matched) {
        return { viewMode: 'storefront', selectedStoreId: matched.id, isDirectStoreLink: true };
      }
    }
  }

  // 2. Query param based check: ?admin=<unique_id>
  if (adminParam) {
    const matched = findStoreMatch(adminParam);
    if (matched) {
      return { viewMode: 'client_admin', selectedStoreId: matched.id, isDirectStoreLink: true };
    }
    return { viewMode: 'client_admin', selectedStoreId: stores[0]?.id || null, isDirectStoreLink: true };
  }

  // 3. Query param based check: ?store=<unique_id>
  if (storeParam) {
    const matched = findStoreMatch(storeParam);
    if (matched) {
      return { viewMode: 'storefront', selectedStoreId: matched.id, isDirectStoreLink: true };
    }
  }

  // 4. View query param: ?view=client_admin
  if (viewParam === 'admin' || viewParam === 'client_admin') {
    return { viewMode: 'client_admin', selectedStoreId: stores[0]?.id || null, isDirectStoreLink: false };
  }

  if (viewParam === 'storefront') {
    return { viewMode: 'storefront', selectedStoreId: stores[0]?.id || null, isDirectStoreLink: false };
  }

  return { viewMode: 'home', selectedStoreId: stores[0]?.id || null, isDirectStoreLink: false };
}

/**
 * Update browser URL quietly without full page reload
 */
export function navigateToUrl(viewMode: ViewMode, store?: Store | null): void {
  if (typeof window === 'undefined' || !window.history) return;

  const url = new URL(window.location.href);

  if (viewMode === 'home') {
    url.search = '';
    url.pathname = '/';
    window.history.pushState({ viewMode: 'home' }, '', url.toString());
  } else if (viewMode === 'storefront' && store) {
    const slug = getStoreUniqueId(store);
    url.search = `?store=${encodeURIComponent(slug)}`;
    url.pathname = '/';
    window.history.pushState({ viewMode: 'storefront', storeId: store.id }, '', url.toString());
  } else if (viewMode === 'client_admin' && store) {
    const slug = getStoreUniqueId(store);
    url.search = '';
    url.pathname = `/admin/${encodeURIComponent(slug)}`;
    window.history.pushState({ viewMode: 'client_admin', storeId: store.id }, '', url.toString());
  }
}
