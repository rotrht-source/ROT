import React, { useState, useEffect } from 'react';
import {
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ArrowLeft,
  Filter,
  Search,
  Phone,
  MapPin,
  CreditCard,
  User,
  Sparkles,
  ChevronRight,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  X,
  Lock,
  Unlock,
  LogOut,
  ShieldCheck,
  KeyRound,
  Shield,
  Save,
  HelpCircle,
  Palette,
  Facebook,
  Youtube,
  Instagram,
  MessageCircle,
  ExternalLink,
  Link2,
  Globe,
  Share2,
  Check,
  Layers,
} from 'lucide-react';
import { Store, Product, Order } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { uploadImageSmart } from '../utils/smartImageUploader';

interface Props {
  store: Store;
  onUpdateStore: (updatedStore: Store) => void;
  onBackToStorefront: () => void;
}

export const ClientAdmin: React.FC<Props> = ({
  store,
  onUpdateStore,
  onBackToStorefront,
}) => {
  // Authentication State - Always require credentials (No Auto-Login)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Security tab state
  const [secEmail, setSecEmail] = useState(store.clientEmail || `admin@${store.branding.subdomain}.com`);
  const [secPassword, setSecPassword] = useState(store.clientPassword || 'password123');
  const [secConfirmPassword, setSecConfirmPassword] = useState(store.clientPassword || 'password123');
  const [showSecPassword, setShowSecPassword] = useState(false);
  const [secSuccessMsg, setSecSuccessMsg] = useState(false);
  const [secErrorMsg, setSecErrorMsg] = useState('');

  // Branding & Social Media tab state
  const [bStoreName, setBStoreName] = useState(store.branding.storeName || '');
  const [bLogoUrl, setBLogoUrl] = useState(store.branding.logoUrl || '');
  const [bLogoText, setBLogoText] = useState(store.branding.logoText || '');
  const [bPrimaryColor, setBPrimaryColor] = useState(store.branding.primaryColor || '#DC2626');
  const [bWhatsappNumber, setBWhatsappNumber] = useState(store.branding.whatsappNumber || store.branding.contactPhone || '');
  const [bContactPhone, setBContactPhone] = useState(store.branding.contactPhone || '');
  const [bContactEmail, setBContactEmail] = useState(store.branding.contactEmail || '');
  const [bAnnouncementText, setBAnnouncementText] = useState(store.branding.announcementText || '');
  const [bAboutStore, setBAboutStore] = useState(store.branding.aboutStore || '');
  const [bFacebookUrl, setBFacebookUrl] = useState(store.branding.facebookUrl || '');
  const [bInstagramUrl, setBInstagramUrl] = useState(store.branding.instagramUrl || '');
  const [bYoutubeUrl, setBYoutubeUrl] = useState(store.branding.youtubeUrl || '');
  const [bTiktokUrl, setBTiktokUrl] = useState(store.branding.tiktokUrl || '');
  const [bHeroBannerTitle, setBHeroBannerTitle] = useState(store.branding.heroBannerTitle || '');
  const [bHeroBannerSubtitle, setBHeroBannerSubtitle] = useState(store.branding.heroBannerSubtitle || '');
  const [bHeroBannerImage, setBHeroBannerImage] = useState(store.branding.heroBannerImage || '');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [brandSuccessMsg, setBrandSuccessMsg] = useState(false);

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'branding' | 'security'>('orders');
  const [orderFilter, setOrderFilter] = useState<'All' | Order['status']>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Sync security and branding form when store changes
  useEffect(() => {
    setSecEmail(store.clientEmail || `admin@${store.branding.subdomain}.com`);
    setSecPassword(store.clientPassword || 'password123');
    setSecConfirmPassword(store.clientPassword || 'password123');

    setBStoreName(store.branding.storeName || '');
    setBLogoUrl(store.branding.logoUrl || '');
    setBLogoText(store.branding.logoText || '');
    setBPrimaryColor(store.branding.primaryColor || '#DC2626');
    setBWhatsappNumber(store.branding.whatsappNumber || store.branding.contactPhone || '');
    setBContactPhone(store.branding.contactPhone || '');
    setBContactEmail(store.branding.contactEmail || '');
    setBAnnouncementText(store.branding.announcementText || '');
    setBAboutStore(store.branding.aboutStore || '');
    setBFacebookUrl(store.branding.facebookUrl || '');
    setBInstagramUrl(store.branding.instagramUrl || '');
    setBYoutubeUrl(store.branding.youtubeUrl || '');
    setBTiktokUrl(store.branding.tiktokUrl || '');
    setBHeroBannerTitle(store.branding.heroBannerTitle || '');
    setBHeroBannerSubtitle(store.branding.heroBannerSubtitle || '');
    setBHeroBannerImage(store.branding.heroBannerImage || '');
  }, [store.id, store.clientEmail, store.clientPassword, store.branding]);

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingLogo(true);
    try {
      const uploadedUrl = await uploadImageSmart(files[0]);
      if (uploadedUrl) {
        setBLogoUrl(uploadedUrl);
      }
    } catch (err) {
      console.error('Failed to upload store logo', err);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSaveBrandingSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStore: Store = {
      ...store,
      branding: {
        ...store.branding,
        storeName: bStoreName.trim() || store.branding.storeName,
        logoUrl: bLogoUrl.trim(),
        logoText: bLogoText.trim() || bStoreName.trim(),
        primaryColor: bPrimaryColor,
        secondaryColor: bPrimaryColor,
        whatsappNumber: bWhatsappNumber.trim(),
        contactPhone: bContactPhone.trim(),
        contactEmail: bContactEmail.trim(),
        announcementText: bAnnouncementText.trim(),
        aboutStore: bAboutStore.trim(),
        facebookUrl: bFacebookUrl.trim(),
        instagramUrl: bInstagramUrl.trim(),
        youtubeUrl: bYoutubeUrl.trim(),
        tiktokUrl: bTiktokUrl.trim(),
        heroBannerTitle: bHeroBannerTitle.trim(),
        heroBannerSubtitle: bHeroBannerSubtitle.trim(),
        heroBannerImage: bHeroBannerImage.trim() || store.branding.heroBannerImage,
      },
    };

    onUpdateStore(updatedStore);
    setBrandSuccessMsg(true);
    setTimeout(() => setBrandSuccessMsg(false), 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    const enteredUser = inputUsername.trim().toLowerCase();
    const enteredPass = inputPassword.trim();

    const validEmail = (store.clientEmail || '').trim().toLowerCase();
    const validSubdomain = (store.branding.subdomain || '').trim().toLowerCase();
    const validStoreName = (store.branding.storeName || '').trim().toLowerCase();
    const validPassword = store.clientPassword || 'password123';

    // Username can match store email, subdomain, store name or 'admin'
    const isUserValid =
      enteredUser === validEmail ||
      enteredUser === validSubdomain ||
      enteredUser === 'admin' ||
      enteredUser === validStoreName ||
      enteredUser === `admin@${validSubdomain}.com`;

    const isPassValid = enteredPass === validPassword || (validPassword === '' && enteredPass === 'password123');

    setTimeout(() => {
      setIsLoggingIn(false);
      if (isUserValid && isPassValid) {
        setIsAuthenticated(true);
        setLoginError('');
      } else {
        setLoginError('ভুল ইউজারনেম অথবা পাসওয়ার্ড। সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন।');
      }
    }, 300);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setInputPassword('');
    setLoginError('');
  };

  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSecErrorMsg('');
    if (!secEmail.trim()) {
      setSecErrorMsg('ইউজারনেম বা ইমেইল খালি রাখা যাবে না।');
      return;
    }
    if (!secPassword.trim() || secPassword.length < 4) {
      setSecErrorMsg('পাসওয়ার্ড ন্যূনতম ৪ অক্ষরের হতে হবে।');
      return;
    }
    if (secPassword !== secConfirmPassword) {
      setSecErrorMsg('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }

    const updatedStore: Store = {
      ...store,
      clientEmail: secEmail.trim(),
      clientPassword: secPassword.trim(),
    };

    onUpdateStore(updatedStore);
    setSecSuccessMsg(true);
    setTimeout(() => setSecSuccessMsg(false), 4000);
  };

  // Form states for adding/editing product
  const [pTitle, setPTitle] = useState('');
  const [pSalePrice, setPSalePrice] = useState('');
  const [pOriginalPrice, setPOriginalPrice] = useState('');
  // Dynamic categories list from store categories, existing products, and defaults
  const availableCategories = Array.from(
    new Set(
      [
        ...store.categories.map((c) => c.name),
        ...store.products.map((p) => p.category),
        'Clothing',
        'Watch',
        'Wallet',
        'Accessories',
        'Footwear',
        'Electronics',
      ].filter(Boolean)
    )
  );

  const [pCategory, setPCategory] = useState(availableCategories[0] || 'Clothing');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [pImage, setPImage] = useState('');
  const [pImages, setPImages] = useState<string[]>([]);
  const [pNewImageUrl, setPNewImageUrl] = useState('');
  const [pDescription, setPDescription] = useState('');

  const handleAddImageUrl = () => {
    if (!pNewImageUrl.trim()) return;
    const url = pNewImageUrl.trim();
    if (!pImages.includes(url)) {
      setPImages((prev) => [...prev, url]);
    }
    if (!pImage) setPImage(url);
    setPNewImageUrl('');
  };

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleMultipleProductFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    for (const file of Array.from(files) as File[]) {
      try {
        const uploadedUrl = await uploadImageSmart(file);
        if (uploadedUrl) {
          setPImages((prev) => (prev.includes(uploadedUrl) ? prev : [...prev, uploadedUrl]));
          setPImage((prev) => prev || uploadedUrl);
        }
      } catch (err) {
        console.error('Failed to upload/compress product image', err);
      }
    }
    setIsUploadingImage(false);
  };

  const handleRemoveProductImage = (indexToRemove: number) => {
    const removedUrl = pImages[indexToRemove];
    const updated = pImages.filter((_, idx) => idx !== indexToRemove);
    setPImages(updated);
    if (pImage === removedUrl) {
      setPImage(updated[0] || '');
    }
  };

  const handleSetAsCoverImage = (imgUrl: string) => {
    setPImage(imgUrl);
  };

  // Calculate Metrics
  const totalRevenue = (store.orders || []).reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const pendingOrdersCount = (store.orders || []).filter((o) => o.status === 'Pending').length;

  // Filtered Orders
  const filteredOrders = (store.orders || []).filter((o) => {
    const matchesFilter = orderFilter === 'All' || o.status === orderFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      (o.id || '').toLowerCase().includes(q) ||
      (o.customerName || '').toLowerCase().includes(q) ||
      (o.customerPhone || '').includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle || !pSalePrice) return;

    const saleVal = parseFloat(pSalePrice);
    const origVal = pOriginalPrice ? parseFloat(pOriginalPrice) : saleVal * 1.25;

    const fallbackImg = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
    const allImagesList = Array.from(new Set([pImage, ...pImages].filter(Boolean)));
    const coverPhoto = pImage || allImagesList[0] || fallbackImg;
    const finalImagesList = allImagesList.length > 0 ? allImagesList : [fallbackImg];

    const finalCategory =
      isCustomCategory && customCategoryInput.trim()
        ? customCategoryInput.trim()
        : pCategory || 'Clothing';

    const newProd: Product = {
      id: 'prod-' + Date.now(),
      title: pTitle,
      salePrice: saleVal,
      originalPrice: origVal,
      discountPercentage: origVal > saleVal ? Math.round(((origVal - saleVal) / origVal) * 100) : 0,
      category: finalCategory,
      inStock: true,
      rating: 5.0,
      reviewsCount: 1,
      mainImage: coverPhoto,
      images: finalImagesList,
      colors: [
        { name: 'Default', hex: store.branding.primaryColor || '#DC2626' },
        { name: 'Dark', hex: '#1E293B' },
      ],
      features: [
        { id: 'f1', icon: 'zap', title: 'Premium Quality', subtitle: 'Guaranteed satisfaction' },
      ],
      description: pDescription || 'High quality product designed for durability and performance.',
      isFlashDeal: true,
      isBestSelling: true,
    };

    const categoryExists = store.categories.some(
      (c) => c.name.toLowerCase() === finalCategory.toLowerCase()
    );

    const updatedCategories = categoryExists
      ? store.categories
      : [
          ...store.categories,
          {
            id: 'cat-' + Date.now(),
            name: finalCategory,
            iconName: 'grid',
            bgColor: '#FEF2F2',
          },
        ];

    const updatedStore: Store = {
      ...store,
      categories: updatedCategories,
      products: [newProd, ...store.products],
    };

    onUpdateStore(updatedStore);
    setIsAddProductOpen(false);

    // reset
    setPTitle('');
    setPSalePrice('');
    setPOriginalPrice('');
    setPImage('');
    setPImages([]);
    setPNewImageUrl('');
    setPDescription('');
    setCustomCategoryInput('');
    setIsCustomCategory(false);
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPTitle(prod.title);
    setPSalePrice(String(prod.salePrice));
    setPOriginalPrice(String(prod.originalPrice));
    setPCategory(prod.category || 'Electronics');
    setPImage(prod.mainImage || '');
    const initialImages = prod.images && prod.images.length > 0 ? prod.images : [prod.mainImage].filter(Boolean);
    setPImages(initialImages);
    setPNewImageUrl('');
    setPDescription(prod.description || '');
  };

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !pTitle || !pSalePrice) return;

    const saleVal = parseFloat(pSalePrice);
    const origVal = pOriginalPrice ? parseFloat(pOriginalPrice) : saleVal * 1.25;

    const fallbackImg = editingProduct.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
    const allImagesList = Array.from(new Set([pImage, ...pImages].filter(Boolean)));
    const coverPhoto = pImage || allImagesList[0] || fallbackImg;
    const finalImagesList = allImagesList.length > 0 ? allImagesList : [fallbackImg];

    const finalCategory =
      isCustomCategory && customCategoryInput.trim()
        ? customCategoryInput.trim()
        : pCategory || editingProduct.category || 'Clothing';

    const updatedProd: Product = {
      ...editingProduct,
      title: pTitle,
      salePrice: saleVal,
      originalPrice: origVal,
      discountPercentage: origVal > saleVal ? Math.round(((origVal - saleVal) / origVal) * 100) : 0,
      category: finalCategory,
      mainImage: coverPhoto,
      images: finalImagesList,
      description: pDescription || editingProduct.description,
    };

    const categoryExists = store.categories.some(
      (c) => c.name.toLowerCase() === finalCategory.toLowerCase()
    );

    const updatedCategories = categoryExists
      ? store.categories
      : [
          ...store.categories,
          {
            id: 'cat-' + Date.now(),
            name: finalCategory,
            iconName: 'grid',
            bgColor: '#FEF2F2',
          },
        ];

    const updatedStore: Store = {
      ...store,
      categories: updatedCategories,
      products: store.products.map((p) => (p.id === editingProduct.id ? updatedProd : p)),
    };

    onUpdateStore(updatedStore);
    setEditingProduct(null);

    // reset
    setPTitle('');
    setPSalePrice('');
    setPOriginalPrice('');
    setPImage('');
    setPImages([]);
    setPNewImageUrl('');
    setPDescription('');
    setCustomCategoryInput('');
    setIsCustomCategory(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই প্রোডাক্টটি ডিলেট করতে চান?')) return;
    const updatedStore: Store = {
      ...store,
      products: store.products.filter((p) => p.id !== productId),
    };
    onUpdateStore(updatedStore);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updatedStore: Store = {
      ...store,
      orders: store.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    };
    onUpdateStore(updatedStore);
  };

  // -------------------------------------------------------------
  // 1. LOGIN SCREEN (When Not Authenticated)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100 font-sans flex flex-col justify-between p-4 sm:p-6">
        {/* Top bar back button */}
        <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
          <button
            onClick={onBackToStorefront}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 rounded-xl transition-all border border-slate-700/60 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>স্টোরফ্রন্টে ফিরে যান</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/40">
            {store.branding.subdomain}.yourdomain.com
          </span>
        </div>

        {/* Center Login Card */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Store Brand Header */}
            <div className="text-center space-y-2">
              <div
                className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center font-black text-white text-xl shadow-lg border border-white/20 transition-transform hover:scale-105"
                style={{ backgroundColor: store.branding.primaryColor || '#DC2626' }}
              >
                {store.branding.logoUrl ? (
                  <img
                    src={store.branding.logoUrl}
                    alt={store.branding.storeName}
                    className="w-10 h-10 object-contain rounded-xl"
                  />
                ) : (
                  store.branding.storeName.substring(0, 2).toUpperCase()
                )}
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-800/60 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  অ্যাডমিন পোর্টাল
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {store.branding.storeName}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  দোকানের অর্ডার ও প্রোডাক্ট পরিচালনা করতে ইউজারনেম এবং পাসওয়ার্ড দিয়ে লগইন করুন।
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {loginError && (
              <div className="bg-red-950/80 border border-red-700/80 text-red-200 text-xs font-bold p-3.5 rounded-xl flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Username / Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>ইউজারনেম বা ইমেইল (Username / Email)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="যেমন: admin@sajghor.com বা admin"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 font-medium focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>পাসওয়ার্ড (Password)</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="পাসওয়ার্ড লিখুন..."
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-slate-500 font-medium focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 transition-colors"
                    title={showLoginPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 px-4 rounded-xl text-white font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 cursor-pointer mt-2"
                style={{ backgroundColor: store.branding.primaryColor || '#DC2626' }}
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>যাচাই করা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>লগইন করুন (Enter Admin Panel)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500 pb-2">
          <span>নিরাপদ ই-কমার্স অ্যাডমিন প্যানেল • © {store.branding.storeName}</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* Top White Client Admin Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStorefront}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              title="Return to Live Storefront"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-black uppercase tracking-wider text-white px-2.5 py-0.5 rounded-full shadow-2xs"
                  style={{ backgroundColor: store.branding.primaryColor || '#DC2626' }}
                >
                  Admin Portal
                </span>
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  {store.branding.subdomain}.yourdomain.com
                </span>
              </div>
              <h1 className="text-lg font-black text-slate-900 truncate">
                {store.branding.storeName} Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* User Profile Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span className="max-w-[140px] truncate">{store.clientEmail || 'Admin'}</span>
            </div>

            {/* Live Storefront Button */}
            <button
              onClick={onBackToStorefront}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
            >
              <Eye className="w-4 h-4 text-slate-600" />
              <span>Live Storefront</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="অ্যাডমিন থেকে লগআউট করুন"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* White Theme Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>মোট অর্ডার (Orders)</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <ShoppingBag className="w-4.5 h-4.5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{store.orders.length}</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>পেন্ডিং অর্ডার (Pending)</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Clock className="w-4.5 h-4.5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600">{pendingOrdersCount}</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>অ্যাক্টিভ প্রোডাক্টস (Products)</span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Package className="w-4.5 h-4.5" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900">{store.products.length}</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex flex-wrap gap-2 shadow-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            style={{
              backgroundColor: activeTab === 'orders' ? (store.branding.primaryColor || '#DC2626') : undefined,
            }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>অর্ডারসমূহ ({store.orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            style={{
              backgroundColor: activeTab === 'products' ? (store.branding.primaryColor || '#DC2626') : undefined,
            }}
          >
            <Package className="w-4 h-4" />
            <span>প্রোডাক্ট ক্যাটালগ ({store.products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'branding'
                ? 'text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            style={{
              backgroundColor: activeTab === 'branding' ? (store.branding.primaryColor || '#DC2626') : undefined,
            }}
          >
            <Palette className="w-4 h-4" />
            <span>ব্র্যান্ডিং ও সোশ্যাল লিংক</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 min-w-[120px] py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            style={{
              backgroundColor: activeTab === 'security' ? (store.branding.primaryColor || '#DC2626') : undefined,
            }}
          >
            <Shield className="w-4 h-4" />
            <span>লগইন ও পাসওয়ার্ড</span>
          </button>
        </div>

        {/* BRANDING & SOCIAL MEDIA TAB CONTENT */}
        {activeTab === 'branding' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3.5 border-b border-slate-200 pb-5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                style={{ backgroundColor: bPrimaryColor }}
              >
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  ব্র্যান্ডিং ও সোশ্যাল মিডিয়া সেটিংস
                </h3>
                <p className="text-xs text-slate-500">
                  দোকানের লোগো, হোয়াটসঅ্যাপ নাম্বার, ফেসবুক, ইনস্টাগ্রাম, ইউটিউব ও টিকটক প্রোফাইল লিংক আপডেট করুন।
                </p>
              </div>
            </div>

            {brandSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold p-4 rounded-2xl flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>ব্র্যান্ডিং ও সোশ্যাল মিডিয়া সেটিংস সফলভাবে আপডেট ও সেভ হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleSaveBrandingSettings} className="space-y-8">
              {/* SECTION 1: LOGO & BASIC STORE IDENTITY */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <ImageIcon className="w-4 h-4 text-slate-700" />
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
                    ১. স্টোর লোগো ও ব্র্যান্ড নাম
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                  {/* Logo Live Preview */}
                  <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3 shadow-2xs">
                    <span className="text-[11px] font-bold text-slate-500">লাইভ লোগো প্রিভিউ</span>
                    <div className="w-full min-h-[110px] bg-slate-950 rounded-xl p-3 flex items-center justify-center border border-slate-800">
                      {bLogoUrl ? (
                        <img
                          src={bLogoUrl}
                          alt="Store Logo Preview"
                          className="max-h-16 max-w-full object-contain"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
                            style={{ backgroundColor: bPrimaryColor }}
                          >
                            {bStoreName ? bStoreName.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <span className="text-sm font-black text-white truncate max-w-[120px]">
                            {bStoreName || 'স্টোর নাম'}
                          </span>
                        </div>
                      )}
                    </div>
                    {bLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setBLogoUrl('')}
                        className="text-[11px] text-red-600 hover:text-red-700 font-bold hover:underline"
                      >
                        লোগো রিমুভ করুন (টেক্সট লোগো ব্যবহার)
                      </button>
                    )}
                  </div>

                  {/* Logo Upload & URL Options */}
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        দোকানের নাম (Store Name) *
                      </label>
                      <input
                        type="text"
                        required
                        value={bStoreName}
                        onChange={(e) => setBStoreName(e.target.value)}
                        placeholder="যেমন: ROT Lifestyle"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-red-500 transition-all shadow-2xs"
                      />
                    </div>

                    {/* File Upload for Logo */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        ডিভাইস থেকে লোগো আপলোড করুন (Upload Logo)
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white rounded-xl p-3 text-center cursor-pointer transition-all flex items-center justify-center gap-2 group">
                          <Upload className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
                          <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">
                            {isUploadingLogo ? 'লোগো প্রসেস হচ্ছে...' : 'কম্পিউটার বা মোবাইল থেকে ছবি সিলেক্ট করুন'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoFileUpload}
                            disabled={isUploadingLogo}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        পিএনজি (PNG), জেপিজি (JPG) বা এসভিজি (SVG) ফাইল সাপোর্টেড।
                      </span>
                    </div>

                    {/* Direct Image URL */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        অথবা লোগো ইমেজ URL (Logo Image URL)
                      </label>
                      <input
                        type="url"
                        value={bLogoUrl}
                        onChange={(e) => setBLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500 transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: WHATSAPP & CONTACT DETAILS */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
                    ২. হোয়াটসঅ্যাপ ও হেল্পলাইন কন্ট্যাক্ট
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* WhatsApp Number */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>হোয়াটসঅ্যাপ নাম্বার (WhatsApp Number) *</span>
                      </label>
                      {bWhatsappNumber && (
                        <a
                          href={`https://wa.me/${bWhatsappNumber.replace(/[^0-9]/g, '').startsWith('0') ? '88' + bWhatsappNumber.replace(/[^0-9]/g, '') : bWhatsappNumber.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>WhatsApp টেস্ট করুন</span>
                        </a>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={bWhatsappNumber}
                      onChange={(e) => setBWhatsappNumber(e.target.value)}
                      placeholder="যেমন: 01711889900 বা +8801711889900"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-emerald-500 transition-all shadow-2xs"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      কাস্টমাররা স্টোরফ্রন্টের ফ্লোটিং চ্যাট ও ফুটার থেকে সরাসরি এই নাম্বারে মেসেজ দিতে পারবে।
                    </span>
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>হেল্পলাইন ফোন নাম্বার (Support Call)</span>
                    </label>
                    <input
                      type="text"
                      value={bContactPhone}
                      onChange={(e) => setBContactPhone(e.target.value)}
                      placeholder="যেমন: 01711889900"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>সাপোর্ট ইমেইল এড্রেস (Support Email)</span>
                    </label>
                    <input
                      type="email"
                      value={bContactEmail}
                      onChange={(e) => setBContactEmail(e.target.value)}
                      placeholder="যেমন: support@yourstore.com"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: SOCIAL MEDIA PROFILES & LINKS */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
                    ৩. সোশ্যাল মিডিয়া লিংক ও পেজ
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Facebook Page */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                          <Facebook className="w-3 h-3 fill-current" />
                        </div>
                        <span>ফেসবুক পেজ লিংক (Facebook Page)</span>
                      </label>
                      {bFacebookUrl && (
                        <a
                          href={bFacebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>ভিজিট</span>
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={bFacebookUrl}
                      onChange={(e) => setBFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/yourpagename"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Instagram Profile */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center">
                          <Instagram className="w-3 h-3" />
                        </div>
                        <span>ইনস্টাগ্রাম প্রোফাইল (Instagram)</span>
                      </label>
                      {bInstagramUrl && (
                        <a
                          href={bInstagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-pink-600 hover:underline flex items-center gap-0.5"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>ভিজিট</span>
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={bInstagramUrl}
                      onChange={(e) => setBInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/yourprofile"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-pink-500 transition-all"
                    />
                  </div>

                  {/* YouTube Channel */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-red-600 text-white flex items-center justify-center">
                          <Youtube className="w-3 h-3 fill-current" />
                        </div>
                        <span>ইউটিউব চ্যানেল (YouTube Channel)</span>
                      </label>
                      {bYoutubeUrl && (
                        <a
                          href={bYoutubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-0.5"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>ভিজিট</span>
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={bYoutubeUrl}
                      onChange={(e) => setBYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>

                  {/* TikTok Profile */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.3 6.3 0 0 0 1.94-4.5V8.62a8.27 8.27 0 0 0 4.83 1.54V6.71a4.85 4.85 0 0 1-1-.02Z"/>
                          </svg>
                        </div>
                        <span>টিকটক প্রোফাইল (TikTok Profile)</span>
                      </label>
                      {bTiktokUrl && (
                        <a
                          href={bTiktokUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-zinc-800 hover:underline flex items-center gap-0.5"
                        >
                          <ExternalLink className="w-2.5 h-2.5" />
                          <span>ভিজিট</span>
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={bTiktokUrl}
                      onChange={(e) => setBTiktokUrl(e.target.value)}
                      placeholder="https://tiktok.com/@youraccount"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-zinc-800 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: THEME COLOR & STORE NOTICES */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <Palette className="w-4 h-4 text-purple-600" />
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800">
                    ৪. থিম কালার ও এনাউন্সমেন্ট টেক্সট
                  </h4>
                </div>

                <div className="space-y-4">
                  {/* Theme Color Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      প্রাইমারি থিম কালার (Primary Brand Color)
                    </label>
                    <div className="flex flex-wrap items-center gap-2.5">
                      {[
                        { name: 'ROT Crimson Red', hex: '#DC2626' },
                        { name: 'Royal Blue', hex: '#2563EB' },
                        { name: 'Emerald Green', hex: '#059669' },
                        { name: 'Sunset Orange', hex: '#EA580C' },
                        { name: 'Purple Luxury', hex: '#7C3AED' },
                        { name: 'Rose Pink', hex: '#E11D48' },
                        { name: 'Midnight Onyx', hex: '#0F172A' },
                        { name: 'Teal Cyan', hex: '#0D9488' },
                      ].map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setBPrimaryColor(c.hex)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            bPrimaryColor.toLowerCase() === c.hex.toLowerCase()
                              ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-xs bg-white text-slate-900'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                          {bPrimaryColor.toLowerCase() === c.hex.toLowerCase() && (
                            <Check className="w-3 h-3 text-slate-900" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-3 max-w-xs">
                      <span className="text-[11px] font-bold text-slate-500">কাস্টম হেক্স কোড:</span>
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="color"
                          value={bPrimaryColor}
                          onChange={(e) => setBPrimaryColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={bPrimaryColor}
                          onChange={(e) => setBPrimaryColor(e.target.value)}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1 text-xs font-mono font-bold text-slate-900 uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Announcement Text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      টপ এনাউন্সমেন্ট নোটিশ বার (Top Announcement Bar Text)
                    </label>
                    <input
                      type="text"
                      value={bAnnouncementText}
                      onChange={(e) => setBAnnouncementText(e.target.value)}
                      placeholder="যেমন: 🔥 সারা দেশে ক্যাশ অন ডেলিভারি এবং ফ্রি রিটার্ন সুবিধা!"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-red-500 transition-all shadow-2xs"
                    />
                  </div>

                  {/* About Store */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      স্টোর পরিচিতি / বায়ো (About Store / Bio)
                    </label>
                    <textarea
                      rows={2}
                      value={bAboutStore}
                      onChange={(e) => setBAboutStore(e.target.value)}
                      placeholder="দোকানের সংক্ষিপ্ত বর্ণনা যা ফুটারে গ্রাহকদের দেখানো হবে..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SAVE BUTTON */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl text-white font-black text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
                  style={{ backgroundColor: bPrimaryColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>ব্র্যান্ডিং ও সোশ্যাল লিংক সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SECURITY & PASSWORDS TAB CONTENT */}
        {activeTab === 'security' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: store.branding.primaryColor || '#DC2626' }}
              >
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  অ্যাডমিন ইউজারনেম ও পাসওয়ার্ড পরিবর্তন
                </h3>
                <p className="text-xs text-slate-500">
                  আপনার অ্যাডমিন প্যানেলের সিকিউরিটি বাড়াতে ইউজারনেম বা পাসওয়ার্ড পরিবর্তন করুন।
                </p>
              </div>
            </div>

            {secSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold p-4 rounded-2xl flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>অ্যাডমিন ইউজারনেম ও পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে!</span>
              </div>
            )}

            {secErrorMsg && (
              <div className="bg-red-50 border border-red-300 text-red-800 text-xs font-bold p-4 rounded-2xl flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{secErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveSecuritySettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  অ্যাডমিন ইউজারনেম / ইমেইল (Username or Email) *
                </label>
                <input
                  type="text"
                  required
                  value={secEmail}
                  onChange={(e) => setSecEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  লগইন করার সময় এই ইউজারনেম বা ইমেইল ব্যবহার করবেন।
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      নতুন পাসওয়ার্ড (New Password) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowSecPassword(!showSecPassword)}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {showSecPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showSecPassword ? 'লুকান' : 'দেখুন'}</span>
                    </button>
                  </div>
                  <input
                    type={showSecPassword ? 'text' : 'password'}
                    required
                    value={secPassword}
                    onChange={(e) => setSecPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    কনফার্ম পাসওয়ার্ড (Confirm Password) *
                  </label>
                  <input
                    type={showSecPassword ? 'text' : 'password'}
                    required
                    value={secConfirmPassword}
                    onChange={(e) => setSecConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-bold focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1 text-slate-600">
                <span className="font-bold block text-slate-800">💡 তথ্য মনে রাখুন:</span>
                <p>পাসওয়ার্ড পরিবর্তনের পর পরবর্তী লগইনের সময় নতুন পাসওয়ার্ডটি প্রদান করতে হবে।</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-white font-black text-xs sm:text-sm transition-all shadow-xs active:scale-95 flex items-center gap-2 cursor-pointer"
                  style={{ backgroundColor: store.branding.primaryColor || '#DC2626' }}
                >
                  <Save className="w-4 h-4" />
                  <span>পাসওয়ার্ড ও ইউজারনেম সেভ করুন</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ORDERS TAB CONTENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter & Search Header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700">অর্ডার ফিল্টার:</span>
                </div>

                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="অর্ডার আইডি, ফোন বা নাম দিয়ে খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map(
                  (status) => {
                    const count =
                      status === 'All'
                        ? store.orders.length
                        : store.orders.filter((o) => o.status === status).length;

                    return (
                      <button
                        key={status}
                        onClick={() => setOrderFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          orderFilter === status
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>
                          {status === 'All' && 'সবগুলো (All)'}
                          {status === 'Pending' && 'পেন্ডিং'}
                          {status === 'Processing' && 'প্রসেসিং'}
                          {status === 'Shipped' && 'শিপড'}
                          {status === 'Delivered' && 'ডেলিভার্ড'}
                          {status === 'Cancelled' && 'ক্যানসেলড'}
                        </span>
                        <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                          {count}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">কোনো অর্ডার পাওয়া যায়নি</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  কাস্টমার স্টোরফ্রন্ট থেকে কেনাকাটা করলে অর্ডারগুলো এখানে সাথে সাথেই প্রসেস করার জন্য জমা হবে।
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs hover:border-slate-300 transition-all"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">
                          {order.id}
                        </span>
                        <span className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleString('bn-BD')}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div>
                        {order.status === 'Pending' && (
                          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black rounded-full flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" /> পেন্ডিং (Pending)
                          </span>
                        )}
                        {order.status === 'Processing' && (
                          <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-black rounded-full flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> প্রসেসিং (Processing)
                          </span>
                        )}
                        {order.status === 'Shipped' && (
                          <span className="px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 text-xs font-black rounded-full flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-purple-600" /> শিপড (Shipped)
                          </span>
                        )}
                        {order.status === 'Delivered' && (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black rounded-full flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ডেলিভার্ড (Delivered)
                          </span>
                        )}
                        {order.status === 'Cancelled' && (
                          <span className="px-3 py-1 bg-red-50 text-red-800 border border-red-200 text-xs font-black rounded-full flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-red-600" /> ক্যানসেলড (Cancelled)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid md:grid-cols-2 gap-4 text-xs">
                      {/* Customer Info Box */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <p className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-red-600" />
                          কাস্টমার ডিটেইলস:
                        </p>
                        <div className="space-y-1 text-slate-700">
                          <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                          <p className="flex items-center gap-1.5 text-slate-600 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>ফোন: {order.customerPhone}</span>
                          </p>
                          <p className="flex items-start gap-1.5 text-slate-600 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>ঠিকানা: {order.customerAddress}</span>
                          </p>
                          <p className="flex items-center gap-1.5 text-slate-600 font-medium pt-1">
                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            <span>পেমেন্ট মেথড: {order.paymentMethod}</span>
                          </p>
                        </div>
                      </div>

                      {/* Items Ordered Box */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                        <p className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-red-600" />
                          অর্ডারকৃত আইটেম:
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-slate-800">
                              <span className="font-medium">
                                {item.quantity}x {item.title} ({item.selectedColor || 'Standard'})
                              </span>
                              <span className="font-bold text-slate-900">
                                {store.branding.currencySymbol}
                                {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-sm text-emerald-700">
                          <span>মোট সর্বমোট বিল</span>
                          <span>
                            {store.branding.currencySymbol}
                            {order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Status Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-bold mr-2">অর্ডার স্ট্যাটাস আপডেট করুন:</span>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Processing')}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-bold transition-all"
                      >
                        প্রসেসিং
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg font-bold transition-all"
                      >
                        শিপড করুন
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-all"
                      >
                        ডেলিভার্ড সম্পূর্ণ
                      </button>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-bold transition-all ml-auto"
                      >
                        ক্যানসেল
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB CONTENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">প্রোডাক্ট লিস্ট ও ক্যাটালগ</h2>
                <p className="text-xs text-slate-500">আপনার স্টোরে নতুন প্রোডাক্ট যোগ করুন অথবা ডিলেট করুন</p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন প্রোডাক্ট যোগ করুন</span>
              </button>
            </div>

            {/* Add Product Modal (Light Modern Theme) */}
            {isAddProductOpen && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-base">নতুন প্রোডাক্ট যুক্ত করুন</h3>
                  <button
                    onClick={() => setIsAddProductOpen(false)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddProductSubmit} className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">প্রোডাক্টের নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: Wireless Earbuds Pro"
                      value={pTitle}
                      onChange={(e) => setPTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">প্রোডাক্ট ক্যাটাগরি (Product Category)</label>
                    <div className="space-y-1.5">
                      {!isCustomCategory ? (
                        <select
                          value={pCategory}
                          onChange={(e) => {
                            if (e.target.value === '__CUSTOM__') {
                              setIsCustomCategory(true);
                            } else {
                              setPCategory(e.target.value);
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                        >
                          {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                          <option value="__CUSTOM__">➕ কাস্টম ক্যাটাগরি লিখুন...</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="যেমন: Clothing, Watch, Wallet..."
                            value={customCategoryInput}
                            onChange={(e) => setCustomCategoryInput(e.target.value)}
                            className="flex-1 bg-white border border-red-400 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setIsCustomCategory(false)}
                            className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                          >
                            লিস্ট দেখুন
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">বিক্রি মূল্য (Sale Price) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="49.99"
                      value={pSalePrice}
                      onChange={(e) => setPSalePrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      মূল দাম / স্ট্রাইকথ্রু প্রাইস (Regular Price)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="69.99"
                      value={pOriginalPrice}
                      onChange={(e) => setPOriginalPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  {/* Multiple Product Photos Gallery Section */}
                  <div className="md:col-span-2 space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-900 font-bold text-xs flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-red-600" />
                        <span>প্রোডাক্টের ছবি ও গ্যালাড়ী (Multiple Product Photos)</span>
                      </label>
                      <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {pImages.length}টি ছবি মোট
                      </span>
                    </div>

                    {/* File Upload & URL Input Row */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-1">
                      {/* Device File Upload Button */}
                      <label className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-2xs flex items-center justify-center gap-1.5 shrink-0 transition-colors">
                        {isUploadingImage ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>ImgBB-তে আপলোড হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>ডিভাইস থেকে একাধিক ছবি নির্বাচন করুন (ImgBB)</span>
                          </>
                        )}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={isUploadingImage}
                          onChange={handleMultipleProductFileUpload}
                          className="hidden"
                        />
                      </label>

                      {/* URL Paste Input */}
                      <div className="flex-1 flex gap-1.5">
                        <input
                          type="url"
                          placeholder="অথবা ছবির ওয়েব লিংক দিন (https://...)"
                          value={pNewImageUrl}
                          onChange={(e) => setPNewImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddImageUrl();
                            }
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
                        >
                          + যোগ করুন
                        </button>
                      </div>
                    </div>

                    {/* Gallery Thumbnails Grid (9:16 portrait ratio preview) */}
                    {pImages.length > 0 ? (
                      <div className="pt-2">
                        <p className="text-[11px] font-semibold text-slate-600 mb-1.5">
                          কভার ছবি পরিবর্তন করতে ছবিতে ক্লিক করুন, অথবা মুছে ফেলতে X চাপুন:
                        </p>
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                          {pImages.map((imgUrl, idx) => {
                            const isCover = pImage === imgUrl || (idx === 0 && !pImage);
                            return (
                              <div
                                key={idx}
                                className={`relative w-16 aspect-[9/16] rounded-xl overflow-hidden border-2 shrink-0 group transition-all bg-white ${
                                  isCover ? 'border-red-600 ring-2 ring-red-200 shadow-sm' : 'border-slate-200'
                                }`}
                              >
                                <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />

                                {/* Cover Badge */}
                                {isCover && (
                                  <span className="absolute top-1 left-1 bg-red-600 text-white font-black text-[8px] px-1 py-0.5 rounded shadow-xs">
                                    কভার
                                  </span>
                                )}

                                {/* Set Cover Action */}
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetAsCoverImage(imgUrl)}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-[9px] flex items-center justify-center p-1 text-center"
                                  >
                                    কভার বানান
                                  </button>
                                )}

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProductImage(idx)}
                                  className="absolute top-1 right-1 bg-slate-900/80 hover:bg-red-600 text-white p-1 rounded-full shadow-xs transition-colors"
                                  title="ছবিটি সরান"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="py-3 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                        এখনো কোনো ছবি যোগ করা হয়নি। "ডিভাইস থেকে একাধিক ছবি নির্বাচন করুন" বাটনে ক্লিক করে ফাইল সিলেক্ট করুন।
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">বিবরণ / ডেসক্রিপশন</label>
                    <textarea
                      rows={3}
                      placeholder="প্রোডাক্টের সুবিধা, ফিচারস ও ওয়ারেন্টি বিস্তারিত লিখুন..."
                      value={pDescription}
                      onChange={(e) => setPDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddProductOpen(false)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-all"
                    >
                      সেভ করুন
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Product Modal */}
            {editingProduct && (
              <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-black text-slate-900 text-base">প্রোডাক্ট তথ্য এডিট করুন (Edit Product)</h3>
                  <button
                    onClick={() => setEditingProduct(null)}
                    className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleUpdateProductSubmit} className="grid md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">প্রোডাক্টের নাম *</label>
                    <input
                      type="text"
                      required
                      value={pTitle}
                      onChange={(e) => setPTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">প্রোডাক্ট ক্যাটাগরি (Product Category)</label>
                    <div className="space-y-1.5">
                      {!isCustomCategory ? (
                        <select
                          value={pCategory}
                          onChange={(e) => {
                            if (e.target.value === '__CUSTOM__') {
                              setIsCustomCategory(true);
                            } else {
                              setPCategory(e.target.value);
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                        >
                          {availableCategories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                          <option value="__CUSTOM__">➕ কাস্টম ক্যাটাগরি লিখুন...</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="যেমন: Clothing, Watch, Wallet..."
                            value={customCategoryInput}
                            onChange={(e) => setCustomCategoryInput(e.target.value)}
                            className="flex-1 bg-white border border-red-400 rounded-xl px-3.5 py-2 text-slate-900 font-bold focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setIsCustomCategory(false)}
                            className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                          >
                            লিস্ট দেখুন
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">বিক্রি মূল্য (Sale Price) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={pSalePrice}
                      onChange={(e) => setPSalePrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      মূল দাম / স্ট্রাইকথ্রু প্রাইস (Regular Price)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={pOriginalPrice}
                      onChange={(e) => setPOriginalPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  {/* Multiple Product Photos Gallery Section */}
                  <div className="md:col-span-2 space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-900 font-bold text-xs flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-red-600" />
                        <span>প্রোডাক্টের ছবি ও গ্যালাড়ী (Multiple Product Photos)</span>
                      </label>
                      <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {pImages.length}টি ছবি মোট
                      </span>
                    </div>

                    {/* File Upload & URL Input Row */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-1">
                      {/* Device File Upload Button */}
                      <label className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-2xs flex items-center justify-center gap-1.5 shrink-0 transition-colors">
                        {isUploadingImage ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>ImgBB-তে আপলোড হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>ডিভাইস থেকে একাধিক ছবি নির্বাচন করুন (ImgBB)</span>
                          </>
                        )}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          disabled={isUploadingImage}
                          onChange={handleMultipleProductFileUpload}
                          className="hidden"
                        />
                      </label>

                      {/* URL Paste Input */}
                      <div className="flex-1 flex gap-1.5">
                        <input
                          type="url"
                          placeholder="অথবা ছবির ওয়েব লিংক দিন (https://...)"
                          value={pNewImageUrl}
                          onChange={(e) => setPNewImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddImageUrl();
                            }
                          }}
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageUrl}
                          className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
                        >
                          + যোগ করুন
                        </button>
                      </div>
                    </div>

                    {/* Gallery Thumbnails Grid */}
                    {pImages.length > 0 ? (
                      <div className="pt-2">
                        <p className="text-[11px] font-semibold text-slate-600 mb-1.5">
                          কভার ছবি পরিবর্তন করতে ছবিতে ক্লিক করুন, অথবা মুছে ফেলতে X চাপুন:
                        </p>
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                          {pImages.map((imgUrl, idx) => {
                            const isCover = pImage === imgUrl || (idx === 0 && !pImage);
                            return (
                              <div
                                key={idx}
                                className={`relative w-16 aspect-[9/16] rounded-xl overflow-hidden border-2 shrink-0 group transition-all bg-white ${
                                  isCover ? 'border-red-600 ring-2 ring-red-200 shadow-sm' : 'border-slate-200'
                                }`}
                              >
                                <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />

                                {/* Cover Badge */}
                                {isCover && (
                                  <span className="absolute top-1 left-1 bg-red-600 text-white font-black text-[8px] px-1 py-0.5 rounded shadow-xs">
                                    কভার
                                  </span>
                                )}

                                {/* Set Cover Action */}
                                {!isCover && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetAsCoverImage(imgUrl)}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-[9px] flex items-center justify-center p-1 text-center"
                                  >
                                    কভার বানান
                                  </button>
                                )}

                                {/* Delete Button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProductImage(idx)}
                                  className="absolute top-1 right-1 bg-slate-900/80 hover:bg-red-600 text-white p-1 rounded-full shadow-xs transition-colors"
                                  title="ছবিটি সরান"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="py-3 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                        এখনো কোনো ছবি যোগ করা হয়নি। "ডিভাইস থেকে একাধিক ছবি নির্বাচন করুন" বাটনে ক্লিক করে ফাইল সিলেক্ট করুন।
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1">বিবরণ / ডেসক্রিপশন</label>
                    <textarea
                      rows={3}
                      value={pDescription}
                      onChange={(e) => setPDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                    />
                  </div>

                  <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-all"
                    >
                      আপডেট প্রোডাক্ট সেভ করুন
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {store.products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-3 relative shadow-xs hover:border-slate-300 transition-all items-start"
                >
                  <img
                    src={prod.mainImage}
                    alt={prod.title}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{prod.title}</h4>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md inline-block">
                      {prod.category}
                    </span>
                    <div className="text-sm font-black text-emerald-600 pt-1">
                      {store.branding.currencySymbol}
                      {prod.salePrice.toFixed(2)}
                      {prod.originalPrice > prod.salePrice && (
                        <span className="text-xs text-slate-400 line-through font-normal ml-2">
                          {store.branding.currencySymbol}
                          {prod.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEditProduct(prod)}
                      className="text-slate-500 hover:text-blue-600 p-2 rounded-xl hover:bg-blue-50 transition-colors"
                      title="প্রোডাক্ট এডিট করুন"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors"
                      title="প্রোডাক্ট ডিলেট করুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

