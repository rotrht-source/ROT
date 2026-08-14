import React from 'react';
import {
  Home,
  Smartphone,
  Monitor,
  Globe,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Store, ViewMode } from '../types';

interface Props {
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  stores: Store[];
  selectedStoreId: string;
  onSelectStore: (id: string) => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenSubdomainGuide: () => void;
  onResetData: () => void;
}

export const HeaderBar: React.FC<Props> = ({
  viewMode,
  onSetViewMode,
  stores,
  selectedStoreId,
  onSelectStore,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenSubdomainGuide,
  onResetData,
}) => {
  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5 text-xs shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Home Navigation & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSetViewMode('home')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 border shadow-2xs active:scale-95 ${
              viewMode === 'home'
                ? 'bg-red-600 text-white border-red-600 shadow-sm ring-2 ring-red-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200/80 hover:text-slate-900'
            }`}
          >
            <Home className={`w-4 h-4 ${viewMode === 'home' ? 'text-white' : 'text-slate-700'}`} />
            <span>হোম ড্যাশবোর্ড (Home)</span>
          </button>

          {viewMode !== 'home' && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100/90 px-3 py-1.5 rounded-xl border border-slate-200/80 hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{viewMode === 'storefront' ? 'পাবলিক স্টোরফ্রন্ট ভিউ' : 'ক্লায়েন্ট অ্যাডমিন মোড'}</span>
            </div>
          )}
        </div>

        {/* Middle: Store Selector (when in Storefront or Client Admin) */}
        {viewMode !== 'home' && stores.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-slate-500 hidden sm:inline font-bold text-[11px] uppercase tracking-wider">
              অ্যাক্টিভ স্টোর:
            </span>
            <div className="relative">
              <select
                value={selectedStoreId}
                onChange={(e) => onSelectStore(e.target.value)}
                className="bg-slate-50 text-slate-900 font-bold text-xs border border-slate-300/80 rounded-xl px-3 py-1.5 pr-8 appearance-none cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-2xs transition-all"
              >
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.branding.storeName} ({s.branding.subdomain}.yourdomain.com)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Right: Controls (Mobile Frame Toggle, DNS Guide, Reset) */}
        <div className="flex items-center gap-2">
          {viewMode === 'storefront' && (
            <button
              onClick={onToggleMobileFrame}
              className={`p-2 px-3 rounded-xl border transition-all flex items-center gap-1.5 font-bold shadow-2xs active:scale-95 ${
                isMobileFrame
                  ? 'bg-red-50 text-red-700 border-red-200 ring-2 ring-red-500/10'
                  : 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title={isMobileFrame ? 'ফুলস্ক্রিন ভিউতে সুইচ করুন' : 'মোবাইল ফোন ফ্রেম ভিউতে সুইচ করুন'}
            >
              {isMobileFrame ? <Smartphone className="w-4 h-4 text-red-600" /> : <Monitor className="w-4 h-4 text-slate-600" />}
              <span className="hidden sm:inline">
                {isMobileFrame ? 'স্মার্টফোন ফ্রেম' : 'ফুল স্ক্রিন'}
              </span>
            </button>
          )}

          <button
            onClick={onOpenSubdomainGuide}
            className="p-2 px-3 bg-blue-50/80 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-2xs active:scale-95"
            title="ডোমেন ও সাবডোমেন নির্দেশিকা"
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="hidden md:inline">ডোমেন গাইড</span>
          </button>

          <button
            onClick={onResetData}
            className="p-2 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200/80 hover:border-red-200 rounded-xl transition-all shadow-2xs active:scale-95"
            title="ডেটা রিসেট করুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};


