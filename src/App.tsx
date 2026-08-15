import React, { useState, useEffect } from 'react';
import {
  getStores,
  addStore,
  updateStore,
  deleteStore,
  addOrderToStore,
  resetToDefaults,
  subscribeToFirestoreStores,
} from './utils/storage';
import { Store, ViewMode, CartItem, Product, Order } from './types';
import { HomePage } from './components/HomePage';
import { ShopFront } from './components/ShopFront';
import { ClientAdmin } from './components/ClientAdmin';
import { CartDrawer } from './components/CartDrawer';
import { SubdomainGuideModal } from './components/SubdomainGuideModal';
import { MasterLockGate } from './components/MasterLockGate';
import { checkMasterAuthentication, logoutMaster } from './utils/masterAuth';
import {
  parseUrlRoute,
  navigateToUrl,
} from './utils/urlHelper';

export default function App() {
  const [stores, setStores] = useState<Store[]>(() => getStores());
  const [isMasterAuthenticated, setIsMasterAuthenticated] = useState<boolean>(() => checkMasterAuthentication());
  
  // Initial URL Route detection
  const initialRoute = parseUrlRoute(getStores());
  const [selectedStoreId, setSelectedStoreId] = useState<string>(() => {
    if (initialRoute.selectedStoreId) return initialRoute.selectedStoreId;
    const initial = getStores();
    return initial[0]?.id || 'sajghor';
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => initialRoute.viewMode);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Synchronize stores with Firestore real-time listener & localStorage fallback
  useEffect(() => {
    const unsubscribe = subscribeToFirestoreStores((updatedStores) => {
      if (updatedStores && updatedStores.length > 0) {
        setStores(updatedStores);
        
        // Re-check URL route with fresh cloud stores
        const currentRoute = parseUrlRoute(updatedStores);
        if (currentRoute.selectedStoreId) {
          setSelectedStoreId(currentRoute.selectedStoreId);
          setViewMode(currentRoute.viewMode);
        } else {
          setSelectedStoreId((prev) => {
            if (updatedStores.some((s) => s.id === prev)) return prev;
            return updatedStores[0].id;
          });
        }
      }
    });

    // Handle browser back / forward button navigation
    const handlePopState = () => {
      const currentStores = getStores();
      const route = parseUrlRoute(currentStores);
      if (route.selectedStoreId) {
        setSelectedStoreId(route.selectedStoreId);
      }
      setViewMode(route.viewMode);
      setIsMasterAuthenticated(checkMasterAuthentication());
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const activeStore = stores.find((s) => s.id === selectedStoreId) || stores[0];

  // Helper for view navigation and URL synchronization
  const handleNavigate = (mode: ViewMode, targetStoreId?: string) => {
    const targetId = targetStoreId || selectedStoreId;
    const targetStore = stores.find((s) => s.id === targetId) || activeStore;
    setSelectedStoreId(targetId);
    setViewMode(mode);
    navigateToUrl(mode, targetStore);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, selectedColor: string) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedColor }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handlePlaceOrder = (newOrder: Order) => {
    if (!activeStore) return;
    const updated = addOrderToStore(activeStore.id, newOrder);
    if (updated) {
      setStores(getStores());
    }
  };

  // Super admin operations
  const handleCreateStore = (newStore: Store) => {
    const updatedStores = addStore(newStore);
    setStores(updatedStores);
    handleNavigate('storefront', newStore.id);
  };

  const handleDeleteStore = (storeId: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return;
    const updated = deleteStore(storeId);
    setStores(updated);
    if (updated.length > 0) {
      handleNavigate(viewMode, updated[0].id);
    }
  };

  const handleUpdateStore = (updatedStore: Store) => {
    const updatedStores = updateStore(updatedStore);
    setStores(updatedStores);
  };

  const handleResetData = () => {
    if (confirm('Reset all store data to default ShopHub and FashionBox templates?')) {
      const fresh = resetToDefaults();
      setStores(fresh);
      setSelectedStoreId(fresh[0].id);
      setCart([]);
      handleNavigate('home', fresh[0].id);
    }
  };

  if (!activeStore) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <p>Loading stores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* View Mode Switching */}
      <main className="flex-1 overflow-x-hidden">
        {(viewMode === 'home' || viewMode === 'super_admin') && (
          !isMasterAuthenticated ? (
            /* Blank White Page for unauthorized visitors */
            <div className="min-h-screen bg-white w-full" />
          ) : (
            <HomePage
              stores={stores}
              onCreateStore={handleCreateStore}
              onDeleteStore={handleDeleteStore}
              onOpenSubdomainGuide={() => setIsGuideOpen(true)}
              onOpenPublicView={(id) => handleNavigate('storefront', id)}
              onOpenClientAdmin={(id) => handleNavigate('client_admin', id)}
              onUpdateStore={handleUpdateStore}
              onResetData={handleResetData}
              onLogoutMaster={() => {
                logoutMaster();
                setIsMasterAuthenticated(false);
              }}
            />
          )
        )}

        {viewMode === 'client_admin' && (
          <ClientAdmin
            store={activeStore}
            onUpdateStore={handleUpdateStore}
            onBackToStorefront={() => handleNavigate('storefront')}
          />
        )}

        {viewMode === 'storefront' && (
          <div className="w-full min-h-screen bg-slate-50">
            <ShopFront
              store={activeStore}
              cart={cart}
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              onOpenClientAdmin={() => handleNavigate('client_admin')}
            />
          </div>
        )}
      </main>

      {/* Customer Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        branding={activeStore.branding}
        onPlaceOrder={handlePlaceOrder}
      />

      {/* Subdomain & Domain Guide Modal */}
      <SubdomainGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        domainName="yourstore.com"
      />
    </div>
  );
}
