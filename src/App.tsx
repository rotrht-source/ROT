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
import {
  parseUrlRoute,
  navigateToUrl,
  getStoreLiveUrl,
  getStoreAdminUrl,
  getBaseOrigin,
} from './utils/urlHelper';
import { Wifi, Battery, Signal, Home, Globe, Copy, CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react';

export default function App() {
  const [stores, setStores] = useState<Store[]>(() => getStores());
  
  // Initial URL Route detection
  const initialRoute = parseUrlRoute(getStores());
  const [selectedStoreId, setSelectedStoreId] = useState<string>(() => {
    if (initialRoute.selectedStoreId) return initialRoute.selectedStoreId;
    const initial = getStores();
    return initial[0]?.id || 'sajghor';
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => initialRoute.viewMode);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const handleCopyStoreLink = (store: Store) => {
    const url = getStoreLiveUrl(store);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
        onSetViewMode={(mode) => handleNavigate(mode)}
        stores={stores}
        selectedStoreId={selectedStoreId}
        onSelectStore={(id) => {
          handleNavigate(viewMode, id);
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
            onOpenPublicView={(id) => handleNavigate('storefront', id)}
            onOpenClientAdmin={(id) => handleNavigate('client_admin', id)}
            onUpdateStore={handleUpdateStore}
          />
        )}

        {viewMode === 'client_admin' && (
          <ClientAdmin
            store={activeStore}
            onUpdateStore={handleUpdateStore}
            onBackToStorefront={() => handleNavigate('storefront')}
          />
        )}

        {viewMode === 'storefront' && (
          <>
            {/* Standalone Live URL Bar Indicator */}
            <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 shadow-inner">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => handleNavigate('home')}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>হোম হাবে ফিরুন</span>
                </button>
                <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-bold truncate">
                  <Globe className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{getStoreLiveUrl(activeStore)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopyStoreLink(activeStore)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-2xs text-[11px]"
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>লিংক কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>লাইভ লিংক কপি করুন</span>
                    </>
                  )}
                </button>

                <a
                  href={getStoreLiveUrl(activeStore)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-2xs text-[11px]"
                  title="আলাদা উইন্ডো বা নতুন ট্যাবে স্টোর ওপেন করুন"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>আলাদা ট্যাবে ওপেন করুন</span>
                </a>
              </div>
            </div>

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
