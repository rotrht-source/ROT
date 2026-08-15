import React, { useState } from 'react';
import {
  Menu,
  Search,
  ShoppingBag,
  Smartphone,
  Shirt,
  Armchair,
  Sparkles,
  Grid,
  Heart,
  Truck,
  RotateCcw,
  Home,
  User,
  ListOrdered,
  ChevronRight,
  Plus,
  Check,
  Zap,
  X,
  Phone,
  Star,
  Image as ImageIcon,
  Lock,
} from 'lucide-react';
import { Product, Store, CartItem } from '../types';
import { ProductDetailView } from './ProductDetailView';
import { WhatsAppButton } from './WhatsAppButton';
import { StoreFooter } from './StoreFooter';

interface Props {
  store: Store;
  cart: CartItem[];
  onAddToCart: (product: Product, quantity: number, selectedColor: string) => void;
  onOpenCart: () => void;
  onOpenClientAdmin?: () => void;
}

export const ShopFront: React.FC<Props> = ({
  store,
  cart,
  onAddToCart,
  onOpenCart,
  onOpenClientAdmin,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'categories' | 'wishlist' | 'orders' | 'account'>('home');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const branding = store.branding;
  const primaryColor = branding.primaryColor || '#DC2626';

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Live search suggestions
  const searchSuggestions = searchQuery.trim()
    ? store.products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase().trim())) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase().trim()))
      )
    : [];

  // Filter products by category & search query
  const filteredProducts = store.products.filter((p) => {
    const matchesCat =
      selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const color = product.colors?.[0]?.name || 'Default';
    onAddToCart(product, 1, color);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  // Render Product Detail view if an item is clicked
  if (selectedProduct) {
    return (
      <ProductDetailView
        product={selectedProduct}
        branding={branding}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
        cartItemCount={cartTotalCount}
        onOpenCart={onOpenCart}
      />
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-gray-900 font-sans flex flex-col justify-between">
      <div className="flex-1 flex flex-col">
        {/* Top Announcement Bar - Dynamically adapts to store primaryColor */}
        <div
          className="px-4 py-2 text-xs font-medium flex items-center justify-between border-b transition-colors"
          style={{
            backgroundColor: `${primaryColor}12`,
            borderColor: `${primaryColor}28`,
          }}
        >
        <div className="flex items-center gap-2 truncate max-w-[70%] sm:max-w-none">
          <span
            className="text-white font-black px-2 py-0.5 text-[10px] rounded-md uppercase tracking-wide shrink-0 shadow-2xs"
            style={{ backgroundColor: primaryColor }}
          >
            অফার
          </span>
          <span className="truncate font-bold" style={{ color: primaryColor }}>
            {branding.announcementText || '🔥 ক্যাশ অন ডেলিভারিতে কেনাকাটা করুন!'}
          </span>
        </div>
        {branding.contactPhone && (
          <a
            href={`tel:${branding.contactPhone}`}
            className="flex items-center gap-1.5 font-bold shrink-0 ml-2 bg-white hover:opacity-90 px-3 py-1 rounded-full transition-all text-xs border shadow-2xs"
            style={{
              color: primaryColor,
              borderColor: `${primaryColor}40`,
            }}
          >
            <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
            <span>{branding.contactPhone}</span>
          </a>
        )}
      </div>

      {/* Main Header with Clean Brand Logo & Middle Search Bar */}
      <header className="sticky top-0 z-30 bg-white text-gray-900 px-3 sm:px-4 py-2.5 border-b border-gray-200 shadow-2xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          {/* Store Logo (Left Side) */}
          <div className="flex items-center shrink-0 max-w-[130px] sm:max-w-[200px]">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={branding.storeName}
                className="h-9 sm:h-11 w-auto object-contain"
                loading="eager"
                decoding="async"
              />
            ) : (
              <div className="flex items-center gap-2 truncate">
                <div
                  className="w-9 h-9 rounded-md flex items-center justify-center font-black text-white text-base shadow-sm shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  {branding.storeName.charAt(0).toUpperCase()}
                </div>
                <span className="text-base sm:text-xl font-black tracking-tight text-gray-900 truncate">
                  {branding.storeName}
                </span>
              </div>
            )}
          </div>

          {/* Middle Space: Search Input Box */}
          <div className="flex-1 max-w-xs sm:max-w-md mx-1 sm:mx-2 relative">
            <div className="relative">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 absolute left-3 top-2.5 sm:top-3 text-gray-400" />
              <input
                id="search-input"
                type="text"
                placeholder="পণ্য খুঁজুন..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full bg-gray-50 hover:bg-white border border-gray-200 text-gray-900 placeholder-gray-400 pl-8 sm:pl-9 pr-7 py-1.5 sm:py-2 text-xs rounded-md focus:outline-none transition-all font-medium"
                style={{
                  borderColor: isSearchFocused ? primaryColor : undefined,
                  boxShadow: isSearchFocused ? `0 0 0 2px ${primaryColor}25` : undefined,
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-2 top-1.5 sm:top-2 text-gray-400 hover:text-gray-700 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {searchQuery.trim().length > 0 && isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto divide-y divide-gray-100">
                <div className="px-3.5 py-2 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                  <span>খুঁজে পাওয়া পণ্য ({searchSuggestions.length})</span>
                  <span className="text-[9px] text-gray-400 font-normal">ক্লিক করে বিস্তারিত দেখুন</span>
                </div>

                {searchSuggestions.length > 0 ? (
                  searchSuggestions.map((prod) => (
                    <button
                      key={prod.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSelectedProduct(prod);
                        setSearchQuery('');
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left p-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors group"
                    >
                      <img
                        src={prod.mainImage}
                        alt={prod.title}
                        className="w-10 h-10 object-cover rounded-md border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate transition-colors">
                          {prod.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold" style={{ color: primaryColor }}>
                            {branding.currencySymbol}
                            {(Number(prod.salePrice) || 0).toFixed(2)}
                          </span>
                          {Number(prod.originalPrice) > Number(prod.salePrice) && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {branding.currencySymbol}
                              {(Number(prod.originalPrice) || 0).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:opacity-100 shrink-0" style={{ color: primaryColor }} />
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs font-medium text-gray-500 space-y-1">
                    <p className="font-bold text-gray-700">কোনো প্রোডাক্ট পাওয়া যায়নি</p>
                    <p className="text-[11px] text-gray-400">"{searchQuery}" এর সাথে মেলে এমন কোনো পণ্য নেই</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side: Cart Icon & 3-Line Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Contact Phone (on Tablet/Desktop) */}
            {branding.contactPhone && (
              <a
                href={`tel:${branding.contactPhone}`}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-bold border transition-colors shrink-0"
                style={{
                  backgroundColor: `${primaryColor}10`,
                  color: primaryColor,
                  borderColor: `${primaryColor}30`,
                }}
                title="অর্ডারের জন্য কল করুন"
              >
                <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>{branding.contactPhone}</span>
              </a>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="p-2 sm:p-2.5 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 relative transition-all active:scale-95 flex items-center gap-1.5"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: primaryColor }} />
              <span className="text-xs font-bold hidden md:inline text-gray-700">কার্ট</span>
              {cartTotalCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 text-white font-black text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-sm border-2 border-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* 3-Line Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 sm:p-2.5 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 active:scale-95 transition-all border border-gray-200 shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer / Mobile Slide Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full p-6 space-y-6 shadow-2xl animate-in slide-in-from-left duration-200 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                {branding.logoUrl ? (
                  <img src={branding.logoUrl} alt={branding.storeName} className="h-8 max-w-[160px] object-contain" />
                ) : (
                  <span className="font-black text-lg text-gray-900">{branding.storeName}</span>
                )}
                <button onClick={() => setIsMenuOpen(false)} className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2 text-sm font-bold text-gray-700">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left py-2.5 px-3.5 rounded-md transition-colors flex items-center justify-between ${
                    selectedCategory === 'All' ? 'font-black' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === 'All' ? `${primaryColor}15` : undefined,
                    color: selectedCategory === 'All' ? primaryColor : undefined,
                  }}
                >
                  <span>সব প্রোডাক্ট (Homepage)</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
                {store.categories.map((c) => {
                  const isCatSelected = selectedCategory.toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.name);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left py-2.5 px-3.5 rounded-md transition-colors flex items-center justify-between ${
                        isCatSelected ? 'font-black' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      style={{
                        backgroundColor: isCatSelected ? `${primaryColor}15` : undefined,
                        color: isCatSelected ? primaryColor : undefined,
                      }}
                    >
                      <span>{c.name}</span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2">
              {branding.contactPhone && (
                <a
                  href={`tel:${branding.contactPhone}`}
                  className="w-full py-2.5 px-3.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 border"
                  style={{
                    backgroundColor: `${primaryColor}10`,
                    color: primaryColor,
                    borderColor: `${primaryColor}30`,
                  }}
                >
                  <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>হটলাইন: {branding.contactPhone}</span>
                </a>
              )}

              {onOpenClientAdmin && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenClientAdmin();
                  }}
                  className="w-full py-2.5 px-3.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 border border-slate-200"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>অ্যাডমিন প্যানেল লগইন</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}

      {/* Main Hero Banner */}
      {branding.heroBannerImage && (
        <div className="px-4 pt-3 pb-1 max-w-3xl mx-auto">
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs">
            <img
              src={branding.heroBannerImage}
              alt={branding.storeName}
              className="w-full h-auto max-h-80 object-cover sm:object-contain rounded-xl"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      )}

      {/* Categories & Products Section - Directly After Banner */}
      <section id="all-products-section" className="px-4 py-3 pb-12 max-w-3xl mx-auto space-y-3 w-full">
        {/* Horizontal Category Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-gray-200/80 pt-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-xs font-black whitespace-nowrap transition-all border ${
              selectedCategory === 'All'
                ? 'text-white shadow-xs scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
            }`}
            style={{
              backgroundColor: selectedCategory === 'All' ? primaryColor : undefined,
              borderColor: selectedCategory === 'All' ? primaryColor : undefined,
            }}
          >
            সব প্রোডাক্ট ({store.products.length})
          </button>
          {store.categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-lg text-xs font-black whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'text-white shadow-xs scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                }`}
                style={{
                  backgroundColor: isSelected ? primaryColor : undefined,
                  borderColor: isSelected ? primaryColor : undefined,
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-black text-gray-900">
              {selectedCategory === 'All' ? 'সকল পণ্য' : selectedCategory}
            </h3>
            <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2.5 py-0.5 rounded-md">
              {filteredProducts.length}টি
            </span>
          </div>
        </div>

        {/* Clean E-Commerce Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => setSelectedProduct(prod)}
              className="bg-white rounded-lg border border-gray-200 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between relative group overflow-hidden"
            >
              {/* Discount Tag */}
              {prod.discountPercentage > 0 && (
                <span
                  className="absolute top-2 left-2 z-10 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-sm shadow-xs"
                  style={{ backgroundColor: primaryColor }}
                >
                  -{prod.discountPercentage}%
                </span>
              )}

              {/* Product Image Box (9:16 Portrait Aspect Ratio) */}
              <div className="w-full aspect-[9/16] bg-gray-100 flex items-center justify-center relative overflow-hidden group-hover:bg-gray-200/80 transition-colors">
                <img
                  src={prod.mainImage}
                  alt={prod.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Multiple Images Badge */}
                {prod.images && prod.images.length > 1 && (
                  <div className="absolute bottom-1.5 right-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs flex items-center gap-1 shadow-sm">
                    <ImageIcon className="w-3 h-3 text-red-400" />
                    <span>{prod.images.length}টি ছবি</span>
                  </div>
                )}
              </div>

              {/* Product Details & Action */}
              <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                    {prod.title}
                  </h4>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{prod.rating || '4.8'}</span>
                    <span className="text-gray-400 font-normal">({prod.reviewsCount || 12})</span>
                  </div>
                </div>

                {/* Price & CTA Button */}
                <div className="space-y-1.5 pt-1 border-t border-gray-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-base font-black text-gray-900" style={{ color: primaryColor }}>
                      {branding.currencySymbol}
                      {(Number(prod.salePrice) || 0).toFixed(2)}
                    </span>
                    {Number(prod.originalPrice) > Number(prod.salePrice) && (
                      <span className="text-[11px] text-gray-400 line-through">
                        {branding.currencySymbol}
                        {(Number(prod.originalPrice) || 0).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1 pt-0.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(prod);
                      }}
                      className="w-full py-1.5 px-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-bold rounded-md transition-colors text-center"
                    >
                      বিস্তারিত
                    </button>
                    <button
                      onClick={(e) => handleQuickAdd(prod, e)}
                      className="w-full py-1.5 px-1.5 text-white text-[11px] font-extrabold rounded-md transition-all shadow-2xs hover:opacity-95 flex items-center justify-center gap-1"
                      style={{
                        backgroundColor: addedProductId === prod.id ? '#10B981' : primaryColor,
                      }}
                    >
                      {addedProductId === prod.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>যোগ করা হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>অর্ডার করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>

      {/* Store Footer with Social Links & Contact Details */}
      <StoreFooter
        branding={branding}
        categories={store.categories}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        onOpenClientAdmin={onOpenClientAdmin}
      />

      {/* Persistent Floating WhatsApp Button */}
      <WhatsAppButton
        whatsappNumber={branding.whatsappNumber || branding.contactPhone}
        storeName={branding.storeName}
      />
    </div>
  );
};
