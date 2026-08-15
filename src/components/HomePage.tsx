import React, { useState } from 'react';
import {
  Plus,
  Globe,
  Eye,
  Settings2,
  Key,
  Copy,
  CheckCircle2,
  Trash2,
  Sliders,
  Shield,
  Layers,
  ShoppingBag,
  ExternalLink,
  Edit,
  Save,
  Building2,
  Search,
  ArrowRight,
  ArrowLeft,
  Home as HomeIcon,
  ChevronRight,
  Lock,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  Facebook,
  Youtube,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  RotateCcw,
  LogOut,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { Store } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { uploadImageSmart } from '../utils/smartImageUploader';
import { getImgbbApiKey, setImgbbApiKey } from '../utils/imgbbService';
import {
  getMasterSecretKey,
  setMasterSecretKey,
  getMasterSecretUrl,
} from '../utils/masterAuth';
import {
  getStoreLiveUrl,
  getStoreAdminUrl,
  getStoreUniqueId,
  getStoreAdminCredentialsText,
  getBaseOrigin,
  DEFAULT_HOST_DOMAIN,
} from '../utils/urlHelper';

interface Props {
  stores: Store[];
  onCreateStore: (newStore: Store) => void;
  onUpdateStore: (updatedStore: Store) => void;
  onDeleteStore: (storeId: string) => void;
  onOpenPublicView: (storeId: string) => void;
  onOpenClientAdmin: (storeId: string) => void;
  onOpenSubdomainGuide: () => void;
  onResetData?: () => void;
  onLogoutMaster?: () => void;
}

export const HomePage: React.FC<Props> = ({
  stores,
  onCreateStore,
  onUpdateStore,
  onDeleteStore,
  onOpenPublicView,
  onOpenClientAdmin,
  onOpenSubdomainGuide,
  onResetData,
  onLogoutMaster,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'websites' | 'admin' | 'settings'>('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSettingsStoreId, setEditingSettingsStoreId] = useState<string | null>(null);
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // New Store Form State
  const [sName, setSName] = useState('');
  const [sSubdomain, setSSubdomain] = useState('');
  const [sColor, setSColor] = useState('#DC2626');
  const [sBannerTitle, setSBannerTitle] = useState('বিশেষ অফার ও কালেকশন');
  const [sBannerDiscount, setSBannerDiscount] = useState('Special Offer');
  const [sBannerSubtitle, setSBannerSubtitle] = useState('অরিজিনাল প্রোডাক্ট কিনুন আকর্ষণীয় মূল্যে');
  const [sBannerImage, setSBannerImage] = useState('');
  const [sLogoUrl, setSLogoUrl] = useState('');
  const [sCategoryKeywords, setSCategoryKeywords] = useState('Clothing, Watch, Wallet, Accessories');
  const [sEmail, setSEmail] = useState('');
  const [sPassword, setSPassword] = useState('');
  const [sWhatsapp, setSWhatsapp] = useState('');
  const [sFacebook, setSFacebook] = useState('');
  const [sYoutube, setSYoutube] = useState('');
  const [sInstagram, setSInstagram] = useState('');
  const [sAbout, setSAbout] = useState('');

  // Settings Form State for Existing Store
  const [editName, setEditName] = useState('');
  const [editSubdomain, setEditSubdomain] = useState('');
  const [editColor, setEditColor] = useState('#DC2626');
  const [editLogoUrl, setEditLogoUrl] = useState('');
  const [editBannerImage, setEditBannerImage] = useState('');
  const [editBannerTitle, setEditBannerTitle] = useState('');
  const [editBannerDiscount, setEditBannerDiscount] = useState('');
  const [editBannerSubtitle, setEditBannerSubtitle] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editFacebook, setEditFacebook] = useState('');
  const [editYoutube, setEditYoutube] = useState('');
  const [editInstagram, setEditInstagram] = useState('');
  const [editAbout, setEditAbout] = useState('');

  const [imgbbKey, setImgbbKey] = useState<string>(() => getImgbbApiKey());
  const [isImgbbSaved, setIsImgbbSaved] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Master Secret Key States
  const [masterSecretKey, setMasterSecretKeyVal] = useState<string>(() => getMasterSecretKey());
  const [inputNewMasterKey, setInputNewMasterKey] = useState<string>(() => getMasterSecretKey());
  const [isMasterKeySaved, setIsMasterKeySaved] = useState(false);
  const [isMasterUrlCopied, setIsMasterUrlCopied] = useState(false);

  const handleSaveMasterSecretKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputNewMasterKey.trim()) return;
    setMasterSecretKey(inputNewMasterKey.trim());
    setMasterSecretKeyVal(inputNewMasterKey.trim());
    setIsMasterKeySaved(true);
    setTimeout(() => setIsMasterKeySaved(false), 3000);
  };

  const handleCopyMasterUrl = () => {
    const url = getMasterSecretUrl();
    navigator.clipboard.writeText(url);
    setIsMasterUrlCopied(true);
    setTimeout(() => setIsMasterUrlCopied(false), 3000);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageUrl: (url: string) => void,
    fieldName?: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (fieldName) setUploadingField(fieldName);
      try {
        const uploadedUrl = await uploadImageSmart(file);
        if (uploadedUrl) {
          setImageUrl(uploadedUrl);
        }
      } catch (err) {
        console.error('Image upload failed', err);
      } finally {
        if (fieldName) setUploadingField(null);
      }
    }
  };

  const handleSaveImgbbKey = () => {
    setImgbbApiKey(imgbbKey);
    setIsImgbbSaved(true);
    setTimeout(() => setIsImgbbSaved(false), 3000);
  };

  const colorPresets = [
    { name: 'Red (ShopHub)', hex: '#DC2626' },
    { name: 'Royal Blue', hex: '#2563EB' },
    { name: 'Emerald Green', hex: '#059669' },
    { name: 'Purple Luxe', hex: '#7C3AED' },
    { name: 'Midnight Navy', hex: '#1E293B' },
    { name: 'Sunset Orange', hex: '#EA580C' },
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName.trim() || !sSubdomain.trim()) return;

    const storeId = sSubdomain.toLowerCase().replace(/[^a-z0-9]/g, '');

    const parsedCategories = sCategoryKeywords
      .split(',')
      .map((cat, idx) => ({
        id: `cat-${idx + 1}`,
        name: cat.trim(),
        iconName: 'grid',
        bgColor: '#FEF2F2',
      }))
      .filter((c) => c.name.length > 0);

    const categoriesList =
      parsedCategories.length > 0
        ? parsedCategories
        : [
            { id: 'cat-1', name: 'Clothing', iconName: 'shirt', bgColor: '#FEF2F2' },
            { id: 'cat-2', name: 'Watch', iconName: 'clock', bgColor: '#FEF2F2' },
            { id: 'cat-3', name: 'Wallet', iconName: 'wallet', bgColor: '#FEF2F2' },
            { id: 'cat-4', name: 'Accessories', iconName: 'grid', bgColor: '#FEF2F2' },
          ];

    const newStore: Store = {
      id: storeId,
      branding: {
        storeName: sName,
        subdomain: storeId,
        logoText: sName,
        logoUrl: sLogoUrl,
        primaryColor: sColor,
        secondaryColor: sColor,
        currencySymbol: '৳',
        announcementText: '🔥 Welcome to ' + sName + '! Free shipping available.',
        heroBannerTitle: sBannerTitle || 'বিশেষ অফার ৫০% ছাড়',
        heroBannerSubtitle: sBannerSubtitle || 'সেরা কোয়ালিটির প্রোডাক্ট কিনুন আকর্ষণীয় মূল্যে',
        heroBannerDiscount: sBannerDiscount || 'Special Deal',
        heroBannerImage:
          sBannerImage ||
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        freeShippingThreshold: 50,
        contactPhone: sWhatsapp || '+880 1700-000000',
        contactEmail: sEmail || `support@${storeId}.com`,
        whatsappNumber: sWhatsapp || '+880 1711-889900',
        facebookUrl: sFacebook || '',
        youtubeUrl: sYoutube || '',
        instagramUrl: sInstagram || '',
        aboutStore: sAbout || '',
      },
      clientEmail: sEmail || `admin@${storeId}.com`,
      clientPassword: sPassword || 'password123',
      createdAt: new Date().toISOString(),
      categories: categoriesList,
      products: [
        {
          id: 'p-1',
          title: 'Wireless Bluetooth Headphone',
          originalPrice: 2500,
          salePrice: 1850,
          discountPercentage: 26,
          category: 'Electronics',
          inStock: true,
          rating: 4.9,
          reviewsCount: 42,
          mainImage:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
          ],
          colors: [
            { name: 'Brand Color', hex: sColor },
            { name: 'Dark Slate', hex: '#1E293B' },
          ],
          features: [
            { id: 'f1', icon: 'bluetooth', title: 'Bluetooth 5.3', subtitle: 'Ultra low latency' },
          ],
          description: 'হাই-কোয়ালিটি সাউন্ড এবং লং লাস্টিং ব্যাটারি ব্যাকআপ সমৃদ্ধ ওয়্যারলেস হেডফোন।',
          isFlashDeal: true,
          isBestSelling: true,
        },
      ],
      orders: [],
    };

    onCreateStore(newStore);
    setIsCreateModalOpen(false);

    // Reset
    setSName('');
    setSSubdomain('');
    setSLogoUrl('');
    setSEmail('');
    setSPassword('');
    setSWhatsapp('');
    setSFacebook('');
    setSYoutube('');
    setSInstagram('');
    setSAbout('');
  };

  const handleStartEditSettings = (store: Store) => {
    setEditingSettingsStoreId(store.id);
    setEditName(store.branding.storeName);
    setEditSubdomain(store.branding.subdomain);
    setEditColor(store.branding.primaryColor);
    setEditLogoUrl(store.branding.logoUrl || '');
    setEditBannerImage(store.branding.heroBannerImage || '');
    setEditBannerTitle(store.branding.heroBannerTitle || '');
    setEditBannerDiscount(store.branding.heroBannerDiscount || '');
    setEditBannerSubtitle(store.branding.heroBannerSubtitle || '');
    setEditPassword(store.clientPassword);
    setEditPhone(store.branding.contactPhone || '');
    setEditEmail(store.branding.contactEmail || '');
    setEditWhatsapp(store.branding.whatsappNumber || store.branding.contactPhone || '');
    setEditFacebook(store.branding.facebookUrl || '');
    setEditYoutube(store.branding.youtubeUrl || '');
    setEditInstagram(store.branding.instagramUrl || '');
    setEditAbout(store.branding.aboutStore || '');
  };

  const handleSaveSettings = (store: Store) => {
    const updated: Store = {
      ...store,
      clientPassword: editPassword || store.clientPassword,
      branding: {
        ...store.branding,
        storeName: editName || store.branding.storeName,
        logoText: editName || store.branding.logoText,
        subdomain: editSubdomain || store.branding.subdomain,
        primaryColor: editColor || store.branding.primaryColor,
        logoUrl: editLogoUrl,
        heroBannerImage: editBannerImage || store.branding.heroBannerImage,
        heroBannerTitle: editBannerTitle || store.branding.heroBannerTitle,
        heroBannerDiscount: editBannerDiscount || store.branding.heroBannerDiscount,
        heroBannerSubtitle: editBannerSubtitle || store.branding.heroBannerSubtitle,
        contactPhone: editPhone || store.branding.contactPhone,
        contactEmail: editEmail || store.branding.contactEmail,
        whatsappNumber: editWhatsapp || store.branding.whatsappNumber || editPhone || store.branding.contactPhone,
        facebookUrl: editFacebook || store.branding.facebookUrl,
        youtubeUrl: editYoutube || store.branding.youtubeUrl,
        instagramUrl: editInstagram || store.branding.instagramUrl,
        aboutStore: editAbout || store.branding.aboutStore,
      },
    };

    onUpdateStore(updated);
    setIsSettingsSaved(true);
    setTimeout(() => {
      setIsSettingsSaved(false);
      setEditingSettingsStoreId(null);
    }, 1200);
  };

  const copyCreds = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredStores = stores.filter(
    (st) =>
      st.branding.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.branding.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">

        {/* TOP NAVIGATION BREADCRUMB & TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'home'
                  ? 'bg-red-600 text-white shadow-sm ring-2 ring-red-500/20'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <HomeIcon className="w-4 h-4 text-white" />
              <span>হোম হাব</span>
            </button>

            {activeTab !== 'home' && (
              <>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-extrabold text-slate-900 capitalize bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-xl">
                  {activeTab === 'websites' ? '🌐 ওয়েবসাইটসমূহ' : activeTab === 'admin' ? '🔑 ক্লায়েন্ট অ্যাডমিন' : '⚙️ এজেন্সি সেটিংস'}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('websites')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'websites'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Websites ({stores.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin ({stores.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-red-50 text-red-700 border border-red-200 font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-red-600" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleCopyMasterUrl}
              className={`p-2 px-3 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-2xs active:scale-95 text-xs border ${
                isMasterUrlCopied
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
              }`}
              title="আপনার গোপন সিক্রেট মাস্টার লিঙ্ক কপি করুন"
            >
              {isMasterUrlCopied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>লিঙ্ক কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-red-600" />
                  <span className="hidden sm:inline">গোপন লিঙ্ক কপি</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenSubdomainGuide}
              className="p-2 px-3 bg-blue-50/80 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-2xs active:scale-95 text-xs"
              title="ডোমেন ও সাবডোমেন নির্দেশিকা"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">ডোমেন গাইড</span>
            </button>

            {onResetData && (
              <button
                onClick={onResetData}
                className="p-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200/80 hover:border-red-200 rounded-xl transition-all shadow-2xs active:scale-95 text-xs"
                title="ডেটা রিসেট করুন"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {onLogoutMaster && (
              <button
                onClick={onLogoutMaster}
                className="p-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-2xs active:scale-95 text-xs"
                title="মাস্টার প্যানেল লক করুন (লগআউট)"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">লক করুন</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. HOME MAIN DASHBOARD (When activeTab === 'home') */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Top Modern Light Hero Card with Create Button */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-xl">
                  <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-red-500" />
                    <span>মাল্টি-টেন্যান্ট ই-কমার্স কন্ট্রোল প্যানেল</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    ক্লায়েন্ট স্টোর ও অ্যাডমিন ম্যানেজমেন্ট
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    সহজেই নতুন শপ তৈরি করুন, সাবডোমেন সেট করুন এবং ক্লায়েন্টদের জন্য স্বয়ংক্রিয় অ্যাডমিন ড্যাশবোর্ড ও পাবলিক শপফ্রন্ট তৈরি করুন।
                  </p>
                </div>

                <div className="shrink-0 flex flex-col gap-3 sm:min-w-[260px]">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all active:scale-98 border border-red-500"
                  >
                    <Plus className="w-5 h-5 stroke-[3]" />
                    <span>নতুন ওয়েবসাইট তৈরি করুন</span>
                  </button>
                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-bold">
                    <span>মোট শপ: {stores.length}টি</span>
                    <span>•</span>
                    <span>রেডি টেমপ্লেট: সক্রিয়</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Bento Navigation Boxes / Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* BOX 1: WEBSITES */}
              <div
                onClick={() => setActiveTab('websites')}
                className="bg-white border border-slate-200/90 hover:border-blue-500 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-6 group hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Globe className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                      {stores.length} টি ওয়েবসাইট
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      Websites (পাবলিক ওয়েবসাইটসমূহ)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                      তৈরি করা প্রতিটি ওয়েবসাইটের লাইভ তালিকা। এখানে ক্লিক করে যেকোনো স্টোরের পাবলিক ভিউ সরাসরি ওপেন করতে পারবেন।
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-blue-600">
                  <span>ওয়েবসাইটসমূহ দেখুন</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* BOX 2: ADMIN */}
              <div
                onClick={() => setActiveTab('admin')}
                className="bg-white border border-slate-200/90 hover:border-amber-500 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-6 group hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Key className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                      {stores.length} টি ক্লায়েন্ট
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                      Admin (ক্লায়েন্ট অ্যাডমিন প্যানেল)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                      প্রতিটি ক্লায়েন্টের নির্ধারিত অ্যাডমিন প্যানেল। সেখান থেকে প্রোডাক্ট যোগ, এডিট এবং কাস্টমারদের অর্ডার রিসিভ করা যাবে।
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-amber-600">
                  <span>অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* BOX 3: SETTINGS */}
              <div
                onClick={() => setActiveTab('settings')}
                className="bg-white border border-slate-200/90 hover:border-red-500 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-6 group hover:-translate-y-0.5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sliders className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> এজেন্সি কন্ট্রোল
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors">
                      Settings (এজেন্সি সেটিংস)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">
                      শপের নাম, সাব-ডোমেন, থিম কালার, লোগো, ব্যানার, হোয়াটসঅ্যাপ নম্বর ও ক্লায়েন্ট পাসওয়ার্ড সম্পূর্ণ কনফিগার করুন।
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-bold text-xs text-red-600">
                  <span>স্টোর কনফিগারেশন পরিবর্তন</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. WEBSITES SECTION (Inside activeTab === 'websites') */}
        {activeTab === 'websites' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('home')}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                  title="হোমে ফিরে যান"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    websites (ওয়েবসাইটসমূহ)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    আপনার তৈরি করা সমস্ত ওয়েবসাইট। যে কোনো স্টোরে ক্লিক করলে সরাসরি তার পাবলিক ভিউ ওপেন হবে।
                  </p>
                </div>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="ওয়েবসাইট খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredStores.map((st) => {
                const liveUrl = getStoreLiveUrl(st);
                const fullDomain = `${st.branding.subdomain}.yourdomain.com`;

                return (
                  <div
                    key={st.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-blue-500 hover:shadow-lg transition-all duration-200 space-y-4 relative group overflow-hidden flex flex-col justify-between"
                  >
                    {/* Top Accent Stripe */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{ backgroundColor: st.branding.primaryColor || '#DC2626' }}
                    />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm shrink-0"
                            style={{ backgroundColor: st.branding.primaryColor || '#DC2626' }}
                          >
                            {st.branding.storeName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-extrabold text-slate-900 text-base leading-tight truncate">
                              {st.branding.storeName}
                            </h3>
                            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-200 inline-block mt-0.5">
                              আলাদা ওয়েবসাইট
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Live Store URL Box */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-bold flex items-center gap-1">
                            <Globe className="w-3 h-3 text-blue-600" />
                            <span>লাইভ ডোমেন লিংক:</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => copyCreds(liveUrl, `url-${st.id}`)}
                            className="text-blue-600 hover:text-blue-800 font-bold text-[10px] flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
                          >
                            {copiedId === `url-${st.id}` ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">কপি হয়েছে!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>কপি লিংক</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="font-mono text-[11px] text-slate-800 font-bold truncate bg-white p-1.5 rounded border border-slate-200/80">
                          {liveUrl}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-slate-600 font-medium">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-extrabold tracking-wider">প্রোডাক্টস</span>
                          <span className="font-extrabold text-slate-900 text-sm">{st.products.length} Items</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-extrabold tracking-wider">অর্ডারসমূহ</span>
                          <span className="font-extrabold text-slate-900 text-sm">{st.orders.length} Orders</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => onOpenPublicView(st.id)}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95 group-hover:bg-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                        <span>পাবলিক ভিউ দেখুন (Open)</span>
                      </button>

                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                        <span>আলাদা ট্যাবে লাইভ ওয়েবসাইট খুলুন</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. ADMIN SECTION (CLIENT MANAGERS) */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Key className="w-5 h-5 text-amber-600" />
                    Admin (ক্লায়েন্ট অ্যাডমিন প্যানেল)
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    ক্লায়েন্টদের অ্যাডমিন প্যানেল। সেখানে শুধুমাত্র প্রোডাক্ট যোগ, প্রোডাক্ট এডিট এবং অর্ডার দেখার এক্সেস থাকবে।
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {stores.map((st) => {
                const uniqueId = getStoreUniqueId(st);
                const adminUrl = getStoreAdminUrl(st);
                const credsText = getStoreAdminCredentialsText(st);

                return (
                  <div
                    key={st.id}
                    className="bg-white border border-amber-200/90 rounded-2xl p-5 space-y-4 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-11 h-11 rounded-xl text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0"
                            style={{ backgroundColor: st.branding.primaryColor || '#DC2626' }}
                          >
                            {st.branding.storeName.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-slate-900 text-base truncate">{st.branding.storeName} Admin</h3>
                            <p className="text-xs text-slate-500 font-mono truncate">{st.clientEmail}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full shrink-0">
                          প্যানেল রেডি
                        </span>
                      </div>

                      {/* Login & Unique ID Info Box */}
                      <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs space-y-3">
                        <div className="flex items-center justify-between text-amber-950 font-bold border-b border-amber-200/80 pb-2">
                          <span className="flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-amber-700" />
                            <span>ইউনিক আইডি ও লগইন এক্সেস</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => copyCreds(credsText, `all-${st.id}`)}
                            className="text-[11px] text-amber-900 hover:text-red-700 flex items-center gap-1 font-bold bg-white px-2.5 py-1 rounded-lg border border-amber-300 transition-colors shadow-2xs"
                          >
                            {copiedId === `all-${st.id}` ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-bold">কপি হয়েছে!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>এক ক্লিকে সব তথ্য কপি</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Unique ID field */}
                        <div className="bg-white p-2.5 rounded-lg border border-amber-200/70 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-bold">ইউনিক আইডি (Unique ID):</span>
                            <button
                              type="button"
                              onClick={() => copyCreds(uniqueId, `uid-${st.id}`)}
                              className="text-amber-800 hover:text-amber-950 font-bold text-[10px] flex items-center gap-1"
                            >
                              {copiedId === `uid-${st.id}` ? (
                                <span className="text-emerald-700 font-bold">কপি হয়েছে</span>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>কপি আইডি</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="font-mono font-black text-amber-900 text-xs tracking-wider bg-amber-50/60 px-2 py-1 rounded border border-amber-200/40">
                            {uniqueId}
                          </p>
                        </div>

                        {/* Direct Admin URL */}
                        <div className="bg-white p-2.5 rounded-lg border border-amber-200/70 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-bold">সরাসরি অ্যাডমিন URL (/admin/ID):</span>
                            <button
                              type="button"
                              onClick={() => copyCreds(adminUrl, `url-${st.id}`)}
                              className="text-amber-800 hover:text-amber-950 font-bold text-[10px] flex items-center gap-1"
                            >
                              {copiedId === `url-${st.id}` ? (
                                <span className="text-emerald-700 font-bold">কপি হয়েছে</span>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>কপি লিংক</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="font-mono font-bold text-slate-800 text-[11px] truncate bg-slate-50 px-2 py-1 rounded border border-slate-200">
                            {adminUrl}
                          </p>
                        </div>

                        {/* Username & Password */}
                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 font-medium">ইউজারনেম / ইমেইল:</span>
                            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-200/50">{st.clientEmail}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 font-medium">পাসওয়ার্ড:</span>
                            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-200/50">{st.clientPassword}</span>
                          </div>
                        </div>

                        <p className="text-[10px] text-amber-800/80 font-medium pt-1 border-t border-amber-200/50">
                          💡 ব্রাউজারে ডোমেইনের পর <code className="font-mono bg-amber-100/70 px-1 py-0.5 rounded text-amber-900 font-bold">/admin/{uniqueId}</code> দিলেই এই প্যানেল ওপেন হবে।
                        </p>
                      </div>
                    </div>

                    {/* Primary Direct Action Button */}
                    <div className="space-y-2 mt-2">
                      <button
                        onClick={() => onOpenClientAdmin(st.id)}
                        className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
                      >
                        <Settings2 className="w-4 h-4 text-white" />
                        <span>ক্লায়েন্ট সেকশনে প্রবেশ করুন (Open Admin)</span>
                      </button>

                      <a
                        href={adminUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-amber-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-700" />
                        <span>আলাদা ট্যাবে অ্যাডমিন ওপেন করুন</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. SETTINGS SECTION (Inside activeTab === 'settings') */}
        {activeTab === 'settings' && (
          <div>
            {editingSettingsStoreId === null ? (
              /* VIEW 1: Clean list showing ONLY Store Names */
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab('home')}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                      title="হোমে ফিরে যান"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-slate-800" />
                        <span>শপ সেটিংস (Shop Settings)</span>
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        যে শপের সেটিংস কনফিগার বা পরিবর্তন করতে চান, সেই শপের নামের উপর ক্লিক করুন।
                      </p>
                    </div>
                  </div>

                  <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-200">
                    মোট শপ: {stores.length}টি
                  </span>
                </div>

                {/* Master Platform Security Card */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-white flex items-center gap-2">
                          <span>মাস্টার প্ল্যাটফর্ম সিকিউরিটি (Owner Access Control)</span>
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-800">
                            সুরক্ষিত
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400">
                          আপনার গোপন লিঙ্ক ছাড়া সাধারণ কোনো ভিজিটর বা কাস্টমার এই মেইন পেজে প্রবেশ করতে পারবে না।
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCopyMasterUrl}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isMasterUrlCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                      }`}
                    >
                      {isMasterUrlCopied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>গোপন লিঙ্ক কপি হয়েছে!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>সিক্রেট লিঙ্ক কপি করুন</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Secret URL Display & Key Management */}
                  <div className="grid md:grid-cols-2 gap-4 pt-1">
                    <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        আপনার ডাইরেক্ট অটো-আনলক সিক্রেট লিঙ্ক
                      </label>
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 break-all select-all flex items-center justify-between gap-2">
                        <span>{getMasterSecretUrl()}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        💡 এই লিঙ্কটি আপনার ব্রাউজারে বুকমার্ক করে রাখলে কোড না লিখে সরাসরি ১ ক্লিকে মেইন পেজে ঢুকতে পারবেন।
                      </p>
                    </div>

                    <form onSubmit={handleSaveMasterSecretKey} className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>গোপন সিক্রেট কোড পরিবর্তন করুন</span>
                        {isMasterKeySaved && (
                          <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> সেভ হয়েছে!
                          </span>
                        )}
                      </label>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={inputNewMasterKey}
                          onChange={(e) => setInputNewMasterKey(e.target.value)}
                          placeholder="যেমন: rot786"
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-red-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors shrink-0"
                        >
                          কোড সেভ
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        বর্তমান সক্রিয় গোপন কোড: <strong className="text-white font-mono">{masterSecretKey}</strong>
                      </p>
                    </form>
                  </div>
                </div>

                {/* List of Store Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stores.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => handleStartEditSettings(st)}
                      className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-red-500/80 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md active:scale-[0.99] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {st.branding.logoUrl ? (
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-red-300 transition-colors">
                            <img
                              src={st.branding.logoUrl}
                              alt={st.branding.storeName}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-base shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: st.branding.primaryColor }}
                          >
                            {st.branding.storeName.substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="font-black text-slate-900 text-base group-hover:text-red-600 transition-colors truncate">
                            {st.branding.storeName}
                          </h3>
                          <span className="text-[11px] text-slate-400 font-mono block truncate">
                            {st.branding.subdomain}.yourdomain.com
                          </span>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-xl bg-white group-hover:bg-red-600 border border-slate-200 group-hover:border-red-600 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all shadow-2xs">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>

                {stores.length === 0 && (
                  <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-500">কোনো শপ পাওয়া যায়নি</p>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl shadow-xs"
                    >
                      নতুন শপ তৈরি করুন
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* VIEW 2: Dedicated Separate Store Settings Page (আলাদা পেজ) */
              (() => {
                const currentStore = stores.find((st) => st.id === editingSettingsStoreId);
                if (!currentStore) return null;

                return (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                    {/* Top Navigation Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setEditingSettingsStoreId(null)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all flex items-center gap-2 text-xs font-bold shadow-2xs"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>সব শপের তালিকায় ফিরুন</span>
                        </button>
                        <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs shrink-0"
                            style={{ backgroundColor: currentStore.branding.primaryColor }}
                          >
                            {currentStore.branding.storeName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                              <span>{currentStore.branding.storeName} - সেটিংস</span>
                            </h2>
                            <span className="text-[11px] text-slate-500 font-mono">
                              {currentStore.branding.subdomain}.yourdomain.com
                            </span>
                          </div>
                        </div>
                      </div>

                      {isSettingsSaved && (
                        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>সেটিংস সফলভাবে সেভ হয়েছে!</span>
                        </div>
                      )}
                    </div>

                    {/* Dedicated Settings Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveSettings(currentStore);
                      }}
                      className="space-y-6 text-xs"
                    >
                      {/* SECTION 1: Store Identity & Access */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                          <Building2 className="w-4 h-4 text-red-600" />
                          <span>১. মৌলিক তথ্য ও পরিচয় (Store Identity & Access)</span>
                        </h3>

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-slate-700 font-bold mb-1.5">শপের নাম (Store Name) *</label>
                            <input
                              type="text"
                              required
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-bold mb-1.5">সাব-ডোমেইন (Subdomain) *</label>
                            <input
                              type="text"
                              required
                              value={editSubdomain}
                              onChange={(e) => setEditSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-bold mb-1.5">ক্লায়েন্ট এডমিন পাসওয়ার্ড *</label>
                            <input
                              type="text"
                              required
                              value={editPassword}
                              onChange={(e) => setEditPassword(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-red-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 2: Contact & Helpline Info */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                          <Phone className="w-4 h-4 text-emerald-600" />
                          <span>২. যোগাযোগ ও হেল্পলাইন তথ্য (Contact Numbers & Email)</span>
                        </h3>

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-slate-700 font-bold mb-1.5">কন্টাক্ট মোবাইল নম্বর</label>
                            <input
                              type="text"
                              placeholder="+880 1711-889900"
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-bold mb-1.5">অফিসিয়াল ইমেইল এড্রেস</label>
                            <input
                              type="email"
                              placeholder="contact@store.com"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-bold mb-1.5 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                                <span>হোয়াটসঅ্যাপ নম্বর</span>
                              </span>
                              <span className="text-[10px] text-emerald-600">গোল চ্যাট বাটন</span>
                            </label>
                            <input
                              type="text"
                              placeholder="01711889900 বা +8801711889900"
                              value={editWhatsapp}
                              onChange={(e) => setEditWhatsapp(e.target.value)}
                              className="w-full bg-emerald-50/60 border border-emerald-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 3: Social Media Channels */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                          <Globe className="w-4 h-4 text-blue-600" />
                          <span>৩. ফুটার সোশ্যাল মিডিয়া লিঙ্কস (Social Media Channels)</span>
                        </h3>

                        <div className="grid sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                              <Facebook className="w-3.5 h-3.5 text-blue-600 fill-current" />
                              <span>ফেসবুক পেজ লিংক</span>
                            </label>
                            <input
                              type="url"
                              placeholder="https://facebook.com/yourpage"
                              value={editFacebook}
                              onChange={(e) => setEditFacebook(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                              <Youtube className="w-3.5 h-3.5 text-red-600 fill-current" />
                              <span>ইউটিউব চ্যানেল লিংক</span>
                            </label>
                            <input
                              type="url"
                              placeholder="https://youtube.com/@yourchannel"
                              value={editYoutube}
                              onChange={(e) => setEditYoutube(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                              <Instagram className="w-3.5 h-3.5 text-pink-600" />
                              <span>ইন্সটাগ্রাম একাউন্ট লিংক</span>
                            </label>
                            <input
                              type="url"
                              placeholder="https://instagram.com/yourusername"
                              value={editInstagram}
                              onChange={(e) => setEditInstagram(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-pink-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SECTION 4: About Store & Footer Description */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span>৪. ফুটার পরিচিতি ও বিবরণ (About Store in Footer)</span>
                        </h3>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1.5">
                            শপের সংক্ষিপ্ত বিবরণ (ওয়েবসাইটের একদম নিচে ফুটারে লোগোর নিচে প্রদর্শিত হবে)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="দোকানের সংক্ষিপ্ত পরিচিতি ও বিশ্বস্ততার বার্তা..."
                            value={editAbout}
                            onChange={(e) => setEditAbout(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 text-xs font-medium focus:outline-none focus:border-red-500 resize-none"
                          />
                        </div>
                      </div>

                      {/* SECTION 5: Logo & Banner Uploads */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                          <ImageIcon className="w-4 h-4 text-red-600" />
                          <span>৫. ওয়েবসাইট লোগো ও হিরো ব্যানার ছবি</span>
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-4">
                          {/* Store Header Logo */}
                          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="block text-slate-800 font-extrabold flex items-center gap-1.5 text-xs">
                                <span>হেডার লোগো (Header Logo)</span>
                              </label>
                              {editLogoUrl && (
                                <button
                                  type="button"
                                  onClick={() => setEditLogoUrl('')}
                                  className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>রিমুভ</span>
                                </button>
                              )}
                            </div>

                            {editLogoUrl ? (
                              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                                <img src={editLogoUrl} alt="Logo preview" className="h-10 max-w-[140px] object-contain" />
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                  লোগো সেট করা আছে
                                </span>
                              </div>
                            ) : (
                              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
                                <p className="text-xs text-slate-400 font-medium">কোনো লোগো ইমেজ সেট করা নেই</p>
                              </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-2 pt-1">
                              <label className="bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold py-2 px-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 text-xs transition-colors">
                                {uploadingField === 'editLogo' ? (
                                  <>
                                    <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    <span>ImgBB আপলোড...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5 text-red-600" />
                                    <span>লোগো আপলোড (ImgBB)</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingField === 'editLogo'}
                                  onChange={(e) => handleFileUpload(e, setEditLogoUrl, 'editLogo')}
                                  className="hidden"
                                />
                              </label>

                              <input
                                type="url"
                                placeholder="অথবা লোগো URL..."
                                value={editLogoUrl}
                                onChange={(e) => setEditLogoUrl(e.target.value)}
                                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-500"
                              />
                            </div>
                          </div>

                          {/* Hero Banner */}
                          <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="block text-slate-800 font-extrabold flex items-center gap-1.5 text-xs">
                                <span>হিরো ব্যানার ছবি (Hero Banner)</span>
                              </label>
                              {editBannerImage && (
                                <button
                                  type="button"
                                  onClick={() => setEditBannerImage('')}
                                  className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>রিমুভ</span>
                                </button>
                              )}
                            </div>

                            {editBannerImage ? (
                              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200">
                                <img src={editBannerImage} alt="Banner preview" className="h-10 max-w-[140px] object-contain rounded" />
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                  ব্যানার সেট করা আছে
                                </span>
                              </div>
                            ) : (
                              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
                                <p className="text-xs text-slate-400 font-medium">ডিফল্ট ব্যানার ব্যবহৃত হচ্ছে</p>
                              </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-2 pt-1">
                              <label className="bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold py-2 px-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 text-xs transition-colors">
                                {uploadingField === 'editBanner' ? (
                                  <>
                                    <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    <span>ImgBB আপলোড...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3.5 h-3.5 text-red-600" />
                                    <span>ব্যানার আপলোড (ImgBB)</span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingField === 'editBanner'}
                                  onChange={(e) => handleFileUpload(e, setEditBannerImage, 'editBanner')}
                                  className="hidden"
                                />
                              </label>

                              <input
                                type="url"
                                placeholder="অথবা ব্যানার URL..."
                                value={editBannerImage}
                                onChange={(e) => setEditBannerImage(e.target.value)}
                                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 6: ImgBB Cloud Storage & Brand Settings */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                        <h3 className="text-sm font-black text-slate-900 flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                          <span className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-emerald-600" />
                            <span>৬. ImgBB ইমেজ ক্লাউড স্টোরেজ (ImgBB API Key)</span>
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                            ক্লাউড সিঙ্ক অ্যাক্টিভ
                          </span>
                        </h3>
                        
                        <div>
                          <label className="block text-slate-700 font-bold text-xs mb-1">
                            আপনার ব্যক্তিগত ImgBB API Key (ঐচ্ছিক - ডিফল্ট কি দেওয়া আছে)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="ImgBB API Key (যেমন: 4d6a...)"
                              value={imgbbKey}
                              onChange={(e) => setImgbbKey(e.target.value)}
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
                            />
                            <button
                              type="button"
                              onClick={handleSaveImgbbKey}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                            >
                              {isImgbbSaved ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>সেভ হয়েছে!</span>
                                </>
                              ) : (
                                <span>কি আপডেট করুন</span>
                              )}
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            ছবিগুলো সরাসরি ImgBB CDN-এ আপলোড হয় এবং লিংক স্বয়ংক্রিয়ভাবে ফায়ারবেসে স্টোর হয়ে যায়।
                          </p>
                        </div>
                      </div>

                      {/* SECTION 7: Brand Color Theme Selection */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-2.5">
                          <Sliders className="w-4 h-4 text-red-600" />
                          <span>৭. ব্র্যান্ডের থিম কালার (Theme Color Palette)</span>
                        </h3>

                        <div className="flex flex-wrap gap-2.5 pt-1">
                          {colorPresets.map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              onClick={() => setEditColor(preset.hex)}
                              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                                editColor === preset.hex
                                  ? 'border-red-600 bg-white text-slate-900 shadow-xs ring-2 ring-red-500/20'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: preset.hex }}
                              />
                              <span>{preset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action Bar Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => onDeleteStore(currentStore.id)}
                          className="px-4 py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>এই শপটি ডিলেট করুন</span>
                        </button>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setEditingSettingsStoreId(null)}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-xs"
                          >
                            বাতিল
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 text-xs"
                          >
                            <Save className="w-4 h-4" />
                            <span>সকল সেটিংস সেভ করুন</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                );
              })()
            )}
          </div>
        )}

      </div>

      {/* CREATE NEW STORE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full max-h-[90vh] sm:max-h-[92vh] flex flex-col p-4 sm:p-7 shadow-2xl text-slate-900 my-auto animate-in fade-in zoom-in-95 duration-150 max-w-full overflow-hidden">
            {/* Sticky Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div className="min-w-0 pr-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 truncate">নতুন ওয়েবসাইট তৈরি করুন</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                  ব্র্যান্ডের নাম, সাবডোমেন, থিম কালার ও ক্লায়েন্ট পাসওয়ার্ড দিয়ে ওয়েবসাইট চালু করুন
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs overflow-y-auto pt-4 pr-1 flex-1 min-w-0 max-w-full">
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ওয়েবসাইটের নাম (Store Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: GadgetZone"
                    value={sName}
                    onChange={(e) => {
                      setSName(e.target.value);
                      if (!sSubdomain) {
                        setSSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    সাবডোমেন / ইউনিক স্লাগ (Subdomain / Slug) *
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden px-3 py-2.5 focus-within:border-red-500 focus-within:bg-white min-w-0">
                    <input
                      type="text"
                      required
                      placeholder="gadgetzone"
                      value={sSubdomain}
                      onChange={(e) => setSSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      className="w-full min-w-0 bg-transparent text-slate-900 font-bold focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">.rotweb.netlify.app</span>
                  </div>
                  <p className="text-[10px] text-blue-600 font-mono font-bold mt-1 truncate">
                    🔗 লাইভ ওয়েবসাইট লিঙ্ক: {getBaseOrigin()}/?store={sSubdomain || 'subdomain'}
                  </p>
                </div>
              </div>

              {/* Logo Upload Input */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-800 font-bold flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4 text-red-600" />
                    <span>১. ওয়েবসাইট হেডার লোগো (Store Header Logo)</span>
                  </label>
                  {sLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setSLogoUrl('')}
                      className="text-[10px] font-bold text-red-600 hover:underline"
                    >
                      রিমুভ করুন
                    </button>
                  )}
                </div>

                {sLogoUrl ? (
                  <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between">
                    <img src={sLogoUrl} alt="Logo preview" className="h-7 max-w-[140px] object-contain" />
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">লোগো সিলেক্টেড</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">লোগো না দিলে শপের নাম হেডার হিসেবে থাকবে।</p>
                )}

                <div className="grid sm:grid-cols-2 gap-2 pt-1">
                  <label className="w-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold py-2 px-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 text-xs transition-colors">
                    {uploadingField === 'createLogo' ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        <span>ImgBB আপলোড...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-red-600" />
                        <span>লোগো ফাইল আপলোড (ImgBB)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingField === 'createLogo'}
                      onChange={(e) => handleFileUpload(e, setSLogoUrl, 'createLogo')}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="অথবা লোগো URL..."
                    value={sLogoUrl}
                    onChange={(e) => setSLogoUrl(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Banner Upload Input */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-800 font-bold flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4 text-red-600" />
                    <span>২. ওয়েবসাইট হিরো ব্যানার ছবি (Store Banner Image)</span>
                  </label>
                  {sBannerImage && (
                    <button
                      type="button"
                      onClick={() => setSBannerImage('')}
                      className="text-[10px] font-bold text-red-600 hover:underline"
                    >
                      রিমুভ করুন
                    </button>
                  )}
                </div>

                {sBannerImage ? (
                  <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between">
                    <img src={sBannerImage} alt="Banner preview" className="h-10 max-w-[140px] object-contain rounded" />
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">ব্যানার সিলেক্টেড</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">ব্যানার ইমেজ আপলোড করলে ওয়েবসাইটের হিরো ব্যানারে প্রদর্শিত হবে।</p>
                )}

                <div className="grid sm:grid-cols-2 gap-2 pt-1">
                  <label className="w-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold py-2 px-3 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 text-xs transition-colors">
                    {uploadingField === 'createBanner' ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        <span>ImgBB আপলোড...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5 text-red-600" />
                        <span>ব্যানার ছবি আপলোড (ImgBB)</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingField === 'createBanner'}
                      onChange={(e) => handleFileUpload(e, setSBannerImage, 'createBanner')}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="url"
                    placeholder="অথবা ব্যানার URL..."
                    value={sBannerImage}
                    onChange={(e) => setSBannerImage(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Color Theme Selector */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold">ব্র্যান্ডের থিম কালার সিলেক্ট করুন</label>
                <div className="grid grid-cols-3 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setSColor(preset.hex)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        sColor === preset.hex
                          ? 'border-red-600 bg-red-50 text-red-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 shadow-xs border border-white"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span className="text-[10px] truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  হিরো ব্যানার শিরোনাম (Hero Banner Title)
                </label>
                <input
                  type="text"
                  placeholder="৫০% পর্যন্ত বিশেষ ছাড়"
                  value={sBannerTitle}
                  onChange={(e) => setSBannerTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    <span>হোয়াটসঅ্যাপ ইনবক্স নম্বর (WhatsApp Number)</span>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">গোল বাটনে ক্লিক করলে ইনবক্স ওপেন হবে</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: 01711889900 বা +8801711889900"
                  value={sWhatsapp}
                  onChange={(e) => setSWhatsapp(e.target.value)}
                  className="w-full bg-emerald-50/40 border border-emerald-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                  <span>প্রোডাক্ট ক্যাটাগরি ও কি-ওয়ার্ডস (Keywords)</span>
                  <span className="text-[10px] text-slate-400 font-normal">কমা (,) দিয়ে পৃথক করুন</span>
                </label>
                <input
                  type="text"
                  placeholder="যেমন: Clothing, Watch, Wallet, Accessories"
                  value={sCategoryKeywords}
                  onChange={(e) => setSCategoryKeywords(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  এই কি-ওয়ার্ডগুলো ওয়েবসাইটের ক্যাটাগরি বার এবং ক্লায়েন্টের প্রোডাক্ট অ্যাড সেকশনে সরাসরি প্রদর্শিত হবে।
                </p>
              </div>

              {/* Social Channels in Create Modal */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="block text-slate-700 font-bold text-xs">
                  সোশ্যাল মিডিয়া পেজ লিংকস (ঐচ্ছিক / Optional)
                </label>
                <div className="grid sm:grid-cols-3 gap-2">
                  <input
                    type="url"
                    placeholder="ফেসবুক পেজ URL"
                    value={sFacebook}
                    onChange={(e) => setSFacebook(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <input
                    type="url"
                    placeholder="ইউটিউব চ্যানেল URL"
                    value={sYoutube}
                    onChange={(e) => setSYoutube(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                  <input
                    type="url"
                    placeholder="ইন্সটাগ্রাম প্রোফাইল URL"
                    value={sInstagram}
                    onChange={(e) => setSInstagram(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-pink-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs">
                  ফুটার বিবরণ ও পরিচিতি (About Store in Footer - ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  placeholder="দোকানের সংক্ষিপ্ত পরিচিতি যা ওয়েবসাইটের একদম নিচে ফুটারে লোগোর নিচে প্রদর্শিত হবে..."
                  value={sAbout}
                  onChange={(e) => setSAbout(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ক্লায়েন্ট এডমিন ইমেইল</label>
                  <input
                    type="email"
                    placeholder="client@gadgetzone.com"
                    value={sEmail}
                    onChange={(e) => setSEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">ক্লায়েন্ট এডমিন পাসওয়ার্ড</label>
                  <input
                    type="text"
                    placeholder="password123"
                    value={sPassword}
                    onChange={(e) => setSPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs active:scale-95 transition-all"
                >
                  ক্রিয়েট ওয়েবসাইট
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
