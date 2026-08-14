import React, { useState, useEffect } from 'react';
import {
  getStores,
  saveStores,
  addStore,
  updateStore,
  deleteStore,
  addOrderToStore,
  resetToDefaults,
  subscribeToFirestoreStores,
} from './utils/storage';
import { Store, ViewMode, CartItem, Product, Order } from './types';
import { HeaderBar } from './components/HeaderBar';
import { HomePage } from './components/HomePage';
import { ShopFront } from './components/ShopFront';
import { ClientAdmin } from './components/ClientAdmin';
import { CartDrawer } from './components/CartDrawer';
import { SubdomainGuideModal } from './components/SubdomainGuideModal';
import { Wifi, Battery, Signal, Home } from 'lucide-react';

export default function App() {
  const [stores, setStores] = useState<Store[]>(() => getStores());
  const [selectedStoreId, setSelectedStoreId] = useState<string>(() => {
    const initial = getStores();
    return initial[0]?.id || 'sajghor';
  });
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Synchronize stores with Firestore real-time listener & localStorage fallback
  useEffect(() => {
    const unsubscribe = subscribeToFirestoreStores((updatedStores) => {
      if (updatedStores && updatedStores.length > 0) {
        setStores(updatedStores);
        setSelectedStoreId((prev) => {
          if (updatedStores.some((s) => s.id === prev)) return prev;
          return updatedStores[0].id;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const activeStore = stores.find((s) => s.id === selectedStoreId) || stores[0];

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
    setSelectedStoreId(newStore.id);
    setViewMode('storefront');
  };

  const handleDeleteStore = (storeId: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return;
    const updated = deleteStore(storeId);
    setStores(updated);
    if (updated.length > 0) {
      setSelectedStoreId(updated[0].id);
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
      {/* Platform Top Context Navigation */}
      <HeaderBar
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        stores={stores}
        selectedStoreId={selectedStoreId}
        onSelectStore={(id) => {
          setSelectedStoreId(id);
          setCart([]);
        }}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenSubdomainGuide={() => setIsGuideOpen(true)}
        onResetData={handleResetData}
      />

      {/* View Mode Switching */}
      <main className="flex-1 overflow-x-hidden">
        {(viewMode === 'home' || viewMode === 'super_admin') && (
          <HomePage
            stores={stores}
            onCreateStore={handleCreateStore}
            onDeleteStore={handleDeleteStore}
            onOpenSubdomainGuide={() => setIsGuideOpen(true)}
            onOpenPublicView={(id) => {
              setSelectedStoreId(id);
              setViewMode('storefront');
            }}
            onOpenClientAdmin={(id) => {
              setSelectedStoreId(id);
              setViewMode('client_admin');
            }}
            onUpdateStore={handleUpdateStore}
          />
        )}

        {viewMode === 'client_admin' && (
          <ClientAdmin
            store={activeStore}
            onUpdateStore={handleUpdateStore}
            onBackToStorefront={() => setViewMode('storefront')}
          />
        )}

        {viewMode === 'storefront' && (
          <>
            {isMobileFrame ? (
              /* Simulated Smartphone Container (Matching User's Mobile Screenshots) */
              <div className="py-8 px-4 flex justify-center items-center min-h-[calc(100vh-50px)] bg-slate-100">
                <div className="w-full max-w-[410px] bg-slate-900 rounded-[48px] p-2.5 shadow-2xl border-4 border-slate-700 relative">
                  {/* Phone Speaker Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center gap-2 px-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                    <div className="w-10 h-1 bg-slate-700 rounded-full" />
                  </div>

                  {/* Phone Status Bar */}
                  <div
                    className="pt-2 px-6 pb-1 text-white flex items-center justify-between text-[11px] font-bold rounded-t-[38px] relative z-40"
                    style={{ backgroundColor: activeStore.branding.primaryColor || '#DC2626' }}
                  >
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <Signal className="w-3 h-3" />
                      <Wifi className="w-3 h-3" />
                      <Battery className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Inner Phone Screen Content */}
                  <div className="rounded-b-[38px] overflow-hidden bg-white max-h-[820px] overflow-y-auto overscroll-contain scroll-smooth relative">
                    <ShopFront
                      store={activeStore}
                      cart={cart}
                      onAddToCart={handleAddToCart}
                      onOpenCart={() => setIsCartOpen(true)}
                      onOpenClientAdmin={() => setViewMode('client_admin')}
                    />
                  </div>

                  {/* Phone Bottom Home Bar */}
                  <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto my-2" />
                </div>
              </div>
            ) : (
              /* Full Width Desktop View */
              <div className="w-full">
                <ShopFront
                  store={activeStore}
                  cart={cart}
                  onAddToCart={handleAddToCart}
                  onOpenCart={() => setIsCartOpen(true)}
                  onOpenClientAdmin={() => setViewMode('client_admin')}
                />
              </div>
            )}
          </>
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
