import React, { useState } from 'react';
import {
  Plus,
  Store as StoreIcon,
  Globe,
  Copy,
  ExternalLink,
  Shield,
  Palette,
  CheckCircle2,
  Trash2,
  Eye,
  Settings2,
  Sparkles,
  TrendingUp,
  Key,
  Users,
  Search,
  Building2,
  Layers,
} from 'lucide-react';
import { Store } from '../types';

interface Props {
  stores: Store[];
  onSelectStore: (storeId: string) => void;
  onCreateStore: (newStore: Store) => void;
  onDeleteStore: (storeId: string) => void;
  onOpenSubdomainGuide: () => void;
  onSwitchToStorefront: (storeId: string) => void;
  onSwitchToClientAdmin: (storeId: string) => void;
}

export const SuperAdmin: React.FC<Props> = ({
  stores,
  onSelectStore,
  onCreateStore,
  onDeleteStore,
  onOpenSubdomainGuide,
  onSwitchToStorefront,
  onSwitchToClientAdmin,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // New Store Form State
  const [sName, setSName] = useState('');
  const [sSubdomain, setSSubdomain] = useState('');
  const [sColor, setSColor] = useState('#DC2626'); // default red
  const [sBannerTitle, setSBannerTitle] = useState('Up to 50% Off');
  const [sBannerSub, setSBannerSub] = useState('Get the best deals on trending products');
  const [sEmail, setSEmail] = useState('');
  const [sPassword, setSPassword] = useState('');

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

    const newStore: Store = {
      id: storeId,
      branding: {
        storeName: sName,
        subdomain: storeId,
        logoText: sName,
        primaryColor: sColor,
        secondaryColor: sColor,
        currencySymbol: '$',
        announcementText: '🔥 Welcome to ' + sName + '! Free shipping available.',
        heroBannerTitle: sBannerTitle,
        heroBannerSubtitle: sBannerSub,
        heroBannerDiscount: 'Special Offer',
        heroBannerImage:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        freeShippingThreshold: 50,
        contactPhone: '+1 (800) 123-4567',
        contactEmail: sEmail || `support@${storeId}.com`,
      },
      clientEmail: sEmail || `admin@${storeId}.com`,
      clientPassword: sPassword || 'password123',
      createdAt: new Date().toISOString(),
      categories: [
        { id: 'cat-1', name: 'Electronics', iconName: 'smartphone', bgColor: '#FEF2F2' },
        { id: 'cat-2', name: 'Fashion', iconName: 'shirt', bgColor: '#FEF2F2' },
        { id: 'cat-3', name: 'Home', iconName: 'armchair', bgColor: '#FEF2F2' },
      ],
      products: [
        {
          id: 'p-1',
          title: 'Wireless Over-Ear Headphones',
          originalPrice: 99.99,
          salePrice: 69.99,
          discountPercentage: 30,
          category: 'Electronics',
          inStock: true,
          rating: 4.8,
          reviewsCount: 128,
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
            { id: 'f2', icon: 'battery', title: 'Up to 40H Battery', subtitle: 'Fast charging' },
          ],
          description:
            'Enjoy superior sound quality with deep bass and clear treble. Comfortable design for long hours of use.',
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
    setSEmail('');
    setSPassword('');
  };

  const copyLink = (text: string, id: string) => {
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-16">
      {/* White Clean Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white font-black shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                  Foundation Builder
                </span>
                <span className="text-xs text-slate-500 font-medium">Super Admin Control Center</span>
              </div>
              <h1 className="text-xl font-black text-slate-900">E-Commerce Agency Hub</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSubdomainGuide}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-blue-600" />
              <span>ডোমেন ও DNS নির্দেশিকা</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>নতুন স্টোর তৈরি করুন</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Light Welcome Explainer Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> মাল্টি-টেন্যান্ট স্টোর জেনারেটর প্ল্যাটফর্ম
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              আপনার ক্লায়েন্টের জন্য তৈরি করুন কাস্টম ই-কমার্স ব্র্যান্ড স্টোর
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              "নতুন স্টোর তৈরি করুন" এ ক্লিক করে ব্র্যান্ডের নাম, লোগো, থিম কালার এবং সাব-ডোমেন সেট করে ক্লায়েন্টের অনলাইন স্টোর চালু করুন। আপনার ক্লায়েন্ট পাবে কেবল তার নিজস্ব স্টোরফ্রন্ট এবং ডেডিকেটেড অ্যাডমিন এক্সেস।
            </p>
          </div>
        </div>

        {/* Global Summary Stats (Light Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              এক্টিভ ক্লায়েন্ট স্টোরসমূহ
            </span>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-between">
              <span>{stores.length}</span>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              মোট প্রোডাক্ট ক্যাটালগ
            </span>
            <div className="text-3xl font-black text-slate-900 flex items-center justify-between">
              <span>{stores.reduce((acc, s) => acc + s.products.length, 0)}</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              সাবডোমেন ওয়াইল্ডকার্ড DNS
            </span>
            <div className="text-sm font-black text-emerald-600 flex items-center justify-between pt-1">
              <span>*.yourdomain.com এক্টিভ</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Stores List Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <StoreIcon className="w-5 h-5 text-red-600" />
              জেনারেটেড ক্লায়েন্ট স্টোরসমূহ ({filteredStores.length})
            </h3>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="স্টোর বা সাবডোমেন দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredStores.map((st) => {
              const fullSubdomain = `${st.branding.subdomain}.yourdomain.com`;

              return (
                <div
                  key={st.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs hover:border-slate-300 transition-all text-slate-900"
                >
                  {/* Store Card Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-xs shrink-0"
                        style={{ backgroundColor: st.branding.primaryColor || '#DC2626' }}
                      >
                        {st.branding.storeName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900">{st.branding.storeName}</h4>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600 mt-0.5">
                          <Globe className="w-3.5 h-3.5 text-blue-600" />
                          <span>{fullSubdomain}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteStore(st.id)}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors"
                      title="ডিলেট স্টোর"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Details Pills */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs text-slate-700">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        প্রোডাক্টস
                      </span>
                      <span className="font-bold text-slate-900">{st.products.length} Items</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        অর্ডার সংখ্যা
                      </span>
                      <span className="font-bold text-slate-900">{st.orders.length} Placed</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        প্রাইমারি কালার
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: st.branding.primaryColor }}
                        />
                        <span className="font-mono text-[11px] font-bold">{st.branding.primaryColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Client Admin Credentials Box */}
                  <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-amber-900 font-bold mb-1">
                      <span className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-700" /> ক্লায়েন্ট লগইন প্যানেল তথ্য:
                      </span>
                      <button
                        onClick={() => copyLink(`Email: ${st.clientEmail}\nPass: ${st.clientPassword}`, st.id)}
                        className="text-[11px] text-red-600 hover:underline flex items-center gap-1 font-bold"
                      >
                        {copiedId === st.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedId === st.id ? 'কপি হয়েছে' : 'কপি করুন'}
                      </button>
                    </div>
                    <p className="text-slate-700">ইমেইল: <span className="text-slate-900 font-mono font-bold">{st.clientEmail}</span></p>
                    <p className="text-slate-700">পাসওয়ার্ড: <span className="text-slate-900 font-mono font-bold">{st.clientPassword}</span></p>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onSwitchToStorefront(st.id)}
                      className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span>লাইভ স্টোরফ্রন্ট দেখুন</span>
                    </button>

                    <button
                      onClick={() => onSwitchToClientAdmin(st.id)}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <Settings2 className="w-4 h-4 text-amber-600" />
                      <span>ক্লায়েন্ট অ্যাডমিন এডমিন</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create New Store Modal (Clean White Theme) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">নতুন ক্লায়েন্ট স্টোর তৈরি করুন</h3>
                <p className="text-xs text-slate-500 font-medium">
                  স্টোর ব্র্যান্ডিং, সাব-ডোমেন এবং এডমিন পাসওয়ার্ড কনফিগার করুন
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">স্টোরের নাম (Store Name) *</label>
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
                    সাবডোমেন হ্যান্ডেল (Subdomain) *
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden px-3.5 py-2.5 focus-within:border-red-500 focus-within:bg-white">
                    <input
                      type="text"
                      required
                      placeholder="gadgetzone"
                      value={sSubdomain}
                      onChange={(e) => setSSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                      className="w-full bg-transparent text-slate-900 font-bold focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">.yourdomain.com</span>
                  </div>
                </div>
              </div>

              {/* Color Theme Selector */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold">প্রাইমারি কালার থিম নির্বাচন করুন</label>
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
                  placeholder="৫০% পর্যন্ত ছাড়"
                  value={sBannerTitle}
                  onChange={(e) => setSBannerTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-red-500 focus:bg-white"
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
                  স্টোর তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

