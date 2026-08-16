import { Store, Order, Product, Category, StoreBranding } from '../types';
import { INITIAL_STORES } from '../data/initialStores';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

const STORAGE_KEY = 'ecom_foundation_stores_v5';
const STORES_COLLECTION = 'stores_v5';

const DEFAULT_BRANDING: StoreBranding = {
  storeName: 'জারা ফ্যাশন (Zara Fashion BD)',
  subdomain: 'zarafashion',
  logoText: 'জারা ফ্যাশন',
  primaryColor: '#BE123C',
  secondaryColor: '#E11D48',
  currencySymbol: '৳',
  announcementText: '✨ স্পেশাল অফার! ক্যাশ অন ডেলিভারি সুবিধা!',
  heroBannerTitle: 'প্রিমিয়াম ফ্যাশন কালেকশন',
  heroBannerSubtitle: 'সেরা মানের পণ্য ও দ্রুত ডেলিভারি',
  heroBannerDiscount: 'স্পেশাল কালেকশন',
  heroBannerImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
  freeShippingThreshold: 1000,
  contactPhone: '+880 1711-889900',
  contactEmail: 'contact@zarafashion.com',
  whatsappNumber: '+880 1711-889900',
};

export function normalizeStore(raw: Partial<Store>): Store {
  const branding: StoreBranding = {
    ...DEFAULT_BRANDING,
    ...(raw.branding || {}),
  };

  const categories: Category[] = Array.isArray(raw.categories) && raw.categories.length > 0
    ? raw.categories.map((c, i) => ({
        id: c?.id || `cat-${i}`,
        name: c?.name || 'General',
        iconName: c?.iconName || 'grid',
        bgColor: c?.bgColor || '#FEF2F2',
      }))
    : [
        { id: 'cat-1', name: 'Clothing', iconName: 'shirt', bgColor: '#FEF2F2' },
        { id: 'cat-2', name: 'Watch', iconName: 'watch', bgColor: '#FEF2F2' },
        { id: 'cat-3', name: 'Wallet', iconName: 'wallet', bgColor: '#FEF2F2' },
      ];

  const products: Product[] = Array.isArray(raw.products)
    ? raw.products.map((p, i) => {
        const salePrice = typeof p?.salePrice === 'number' && !isNaN(p.salePrice) ? p.salePrice : Number(p?.salePrice) || 999;
        const originalPrice = typeof p?.originalPrice === 'number' && !isNaN(p.originalPrice) ? p.originalPrice : Number(p?.originalPrice) || salePrice * 1.2;
        const discountPercentage = typeof p?.discountPercentage === 'number' && !isNaN(p.discountPercentage)
          ? p.discountPercentage
          : (originalPrice > salePrice ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0);

        const mainImage = p?.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
        const images = Array.isArray(p?.images) && p.images.length > 0 ? p.images : [mainImage];

        return {
          id: p?.id || `prod-${i}-${Date.now()}`,
          title: p?.title || 'Product Item',
          salePrice,
          originalPrice,
          discountPercentage,
          category: p?.category || categories[0]?.name || 'General',
          inStock: p?.inStock !== false,
          rating: typeof p?.rating === 'number' && !isNaN(p.rating) ? p.rating : 4.8,
          reviewsCount: typeof p?.reviewsCount === 'number' && !isNaN(p.reviewsCount) ? p.reviewsCount : 12,
          mainImage,
          images,
          colors: Array.isArray(p?.colors) && p.colors.length > 0 ? p.colors : [{ name: 'Default', hex: branding.primaryColor || '#DC2626' }],
          features: Array.isArray(p?.features) ? p.features : [],
          description: p?.description || 'High quality product designed for durability and performance.',
          isFlashDeal: Boolean(p?.isFlashDeal),
          isBestSelling: Boolean(p?.isBestSelling),
        };
      })
    : [];

  const orders: Order[] = Array.isArray(raw.orders)
    ? raw.orders.map((o, i) => ({
        id: o?.id || `ORD-${1000 + i}`,
        customerName: o?.customerName || 'Customer',
        customerPhone: o?.customerPhone || '',
        customerAddress: o?.customerAddress || '',
        items: Array.isArray(o?.items) ? o.items : [],
        totalAmount: typeof o?.totalAmount === 'number' && !isNaN(o.totalAmount) ? o.totalAmount : 0,
        status: o?.status || 'Pending',
        createdAt: o?.createdAt || new Date().toISOString(),
        paymentMethod: o?.paymentMethod || 'Cash on Delivery',
      }))
    : [];

  return {
    id: raw.id || `store-${Date.now()}`,
    branding,
    clientEmail: raw.clientEmail || 'admin@store.com',
    clientPassword: raw.clientPassword || 'password123',
    createdAt: raw.createdAt || new Date().toISOString(),
    categories,
    products,
    orders,
  };
}

// Local cache reader
export function getStores(): Store[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STORES));
      return INITIAL_STORES.map(normalizeStore);
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const normalized = parsed.map(normalizeStore);
      
      // Ensure all 5 template stores exist
      let updated = [...normalized];
      let hasChanges = false;
      INITIAL_STORES.forEach((initialStore) => {
        const existingIdx = updated.findIndex((s) => s.id === initialStore.id);
        if (existingIdx === -1) {
          updated.push(normalizeStore(initialStore));
          hasChanges = true;
        } else if (!updated[existingIdx].branding.logoUrl || updated[existingIdx].products.length < 10) {
          // Upgrade with rich products and logo
          updated[existingIdx] = {
            ...updated[existingIdx],
            branding: {
              ...updated[existingIdx].branding,
              logoUrl: initialStore.branding.logoUrl,
            },
            products: initialStore.products,
          };
          hasChanges = true;
        }
      });

      if (hasChanges) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    }
    return INITIAL_STORES.map(normalizeStore);
  } catch (err) {
    console.error('Failed to load stores from localStorage', err);
    return INITIAL_STORES.map(normalizeStore);
  }
}

// Local save with sanitization
export function saveStores(stores: Store[]): void {
  const normalized = stores.map(normalizeStore);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (err) {
    console.warn('Local storage write warning', err);
  }
}

/**
 * Sync single store to Firestore in real-time (Non-blocking)
 */
export async function syncStoreToFirestore(store: Store): Promise<void> {
  try {
    const normalized = normalizeStore(store);
    const storeRef = doc(db, STORES_COLLECTION, normalized.id);
    await setDoc(storeRef, normalized, { merge: true });
  } catch (error) {
    console.warn(`Firestore sync error for store ${store.id}:`, error);
  }
}

/**
 * Delete store from Firestore
 */
export async function deleteStoreFromFirestore(storeId: string): Promise<void> {
  try {
    const storeRef = doc(db, STORES_COLLECTION, storeId);
    await deleteDoc(storeRef);
  } catch (error) {
    console.warn(`Firestore delete error for store ${storeId}:`, error);
  }
}

/**
 * Initialize Firestore subscription.
 * If Firestore has stores, syncs them to state & localStorage.
 * If Firestore is empty, seeds initial templates to Firestore.
 */
export function subscribeToFirestoreStores(onStoresUpdated: (stores: Store[]) => void): () => void {
  const colRef = collection(db, STORES_COLLECTION);

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const cloudStores: Store[] = [];
        snapshot.forEach((d) => {
          cloudStores.push(normalizeStore({ id: d.id, ...d.data() } as Store));
        });

        if (cloudStores.length > 0) {
          saveStores(cloudStores);
          onStoresUpdated(cloudStores);
          return;
        }
      }

      // If Firestore is empty, seed defaults
      const local = getStores();
      local.forEach((s) => {
        syncStoreToFirestore(s);
      });
      onStoresUpdated(local);
    },
    (error) => {
      console.warn('Firestore subscription notice (using local storage fallback):', error);
      onStoresUpdated(getStores());
    }
  );

  return unsubscribe;
}

export function addStore(newStore: Store): Store[] {
  const stores = getStores();
  const normalized = normalizeStore(newStore);
  const updated = [normalized, ...stores];
  saveStores(updated);
  syncStoreToFirestore(normalized);
  return updated;
}

export function updateStore(updatedStore: Store): Store[] {
  const stores = getStores();
  const normalized = normalizeStore(updatedStore);
  const updated = stores.map((s) => (s.id === normalized.id ? normalized : s));
  saveStores(updated);
  syncStoreToFirestore(normalized);
  return updated;
}

export function deleteStore(storeId: string): Store[] {
  const stores = getStores();
  const updated = stores.filter((s) => s.id !== storeId);
  saveStores(updated);
  deleteStoreFromFirestore(storeId);
  return updated;
}

export function addOrderToStore(storeId: string, newOrder: Order): Store | null {
  const stores = getStores();
  const target = stores.find((s) => s.id === storeId);
  if (!target) return null;

  const updatedStore: Store = {
    ...target,
    orders: [newOrder, ...(target.orders || [])],
  };

  updateStore(updatedStore);
  return updatedStore;
}

export function addProductToStore(storeId: string, newProduct: Product): Store | null {
  const stores = getStores();
  const target = stores.find((s) => s.id === storeId);
  if (!target) return null;

  const updatedStore: Store = {
    ...target,
    products: [newProduct, ...(target.products || [])],
  };

  updateStore(updatedStore);
  return updatedStore;
}

export function updateProductInStore(storeId: string, updatedProduct: Product): Store | null {
  const stores = getStores();
  const target = stores.find((s) => s.id === storeId);
  if (!target) return null;

  const updatedStore: Store = {
    ...target,
    products: (target.products || []).map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
  };

  updateStore(updatedStore);
  return updatedStore;
}

export function deleteProductFromStore(storeId: string, productId: string): Store | null {
  const stores = getStores();
  const target = stores.find((s) => s.id === storeId);
  if (!target) return null;

  const updatedStore: Store = {
    ...target,
    products: (target.products || []).filter((p) => p.id !== productId),
  };

  updateStore(updatedStore);
  return updatedStore;
}

export function updateOrderStatusInStore(
  storeId: string,
  orderId: string,
  status: Order['status']
): Store | null {
  const stores = getStores();
  const target = stores.find((s) => s.id === storeId);
  if (!target) return null;

  const updatedStore: Store = {
    ...target,
    orders: (target.orders || []).map((o) => (o.id === orderId ? { ...o, status } : o)),
  };

  updateStore(updatedStore);
  return updatedStore;
}

export function resetToDefaults(): Store[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STORES));
  const defaults = INITIAL_STORES.map(normalizeStore);
  defaults.forEach((s) => syncStoreToFirestore(s));
  return defaults;
}
