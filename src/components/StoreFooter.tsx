import React from 'react';
import {
  Facebook,
  Youtube,
  Instagram,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  MapPin,
  Lock,
} from 'lucide-react';
import { StoreBranding, Category } from '../types';

interface StoreFooterProps {
  branding: StoreBranding;
  categories: Category[];
  onSelectCategory?: (categoryName: string) => void;
  onOpenClientAdmin?: () => void;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({
  branding,
  categories,
  onSelectCategory,
  onOpenClientAdmin,
}) => {
  const currentYear = new Date().getFullYear();
  const primaryColor = branding.primaryColor || '#DC2626';

  // Format phone number for tel: link
  const rawPhone = branding.contactPhone ? branding.contactPhone.replace(/[^0-9+]/g, '') : '';
  const phoneHref = rawPhone ? `tel:${rawPhone}` : '#';

  // Format WhatsApp number for wa.me link
  const rawWa = (branding.whatsappNumber || branding.contactPhone || '').replace(/[^0-9]/g, '');
  const formattedWa = rawWa.startsWith('880')
    ? rawWa
    : rawWa.startsWith('0')
    ? '88' + rawWa
    : '880' + rawWa;
  const whatsappHref = rawWa ? `https://wa.me/${formattedWa}` : '#';

  // Social Links with fallback or custom URLs
  const facebookUrl = branding.facebookUrl || '';
  const youtubeUrl = branding.youtubeUrl || '';
  const instagramUrl = branding.instagramUrl || '';
  const tiktokUrl = branding.tiktokUrl || '';
  const emailHref = branding.contactEmail ? `mailto:${branding.contactEmail}` : '#';

  const hasAnySocial = facebookUrl || youtubeUrl || instagramUrl || tiktokUrl || rawWa;

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-200 font-sans mt-8 transition-colors">
      {/* Main Footer Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Store Brand Info & Social Media Buttons */}
          <div className="md:col-span-5 space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              {branding.logoUrl ? (
                <div className="p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 inline-block">
                  <img
                    src={branding.logoUrl}
                    alt={branding.storeName}
                    className="h-9 max-h-11 w-auto max-w-[190px] object-contain"
                  />
                </div>
              ) : (
                <span className="text-xl font-black tracking-tight text-white drop-shadow-xs">
                  {branding.storeName}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-2">
              {branding.aboutStore ||
                `${branding.storeName} একটি বিশ্বস্ত ও জনপ্রিয় অনলাইন শপিং প্ল্যাটফর্ম। সেরা মূল্যে ট্রেন্ডিং ও মানসম্মত প্রোডাক্ট আপনার দোরগোড়ায় পৌঁছে দিতে আমরা প্রতিজ্ঞাবদ্ধ।`}
            </p>

            {/* Social Media Links Section with requested Icons */}
            <div className="pt-2">
              <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
                সোশ্যাল মিডিয়ায় আমাদের সাথে যুক্ত থাকুন:
              </h5>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Facebook Page Button */}
                {(facebookUrl || !hasAnySocial) && (
                  <a
                    href={facebookUrl || 'https://facebook.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook Page"
                    className="group flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 text-blue-400 hover:text-white transition-all shadow-2xs active:scale-95"
                    title="ফেসবুক পেজ ভিজিট করুন"
                  >
                    <Facebook className="w-4 h-4 fill-current transition-colors" />
                    <span className="text-xs font-bold">Facebook</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </a>
                )}

                {/* YouTube Channel Button */}
                {youtubeUrl && (
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube Channel"
                    className="group flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-red-600 border border-slate-800 hover:border-red-500 text-red-400 hover:text-white transition-all shadow-2xs active:scale-95"
                    title="ইউটিউব চ্যানেল সাবস্ক্রাইব করুন"
                  >
                    <Youtube className="w-4 h-4 fill-current transition-colors" />
                    <span className="text-xs font-bold">YouTube</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </a>
                )}

                {/* Instagram Profile Button */}
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram Profile"
                    className="group flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-gradient-to-r hover:from-pink-600 hover:to-rose-600 border border-slate-800 hover:border-pink-500 text-pink-400 hover:text-white transition-all shadow-2xs active:scale-95"
                    title="ইন্সটাগ্রাম একাউন্ট ফলো করুন"
                  >
                    <Instagram className="w-4 h-4 transition-colors" />
                    <span className="text-xs font-bold">Instagram</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </a>
                )}

                {/* TikTok Profile Button */}
                {tiktokUrl && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok Profile"
                    className="group flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-zinc-800 border border-slate-800 hover:border-zinc-500 text-zinc-200 hover:text-white transition-all shadow-2xs active:scale-95"
                    title="টিকটক একাউন্ট ফলো করুন"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.3 6.3 0 0 0 1.94-4.5V8.62a8.27 8.27 0 0 0 4.83 1.54V6.71a4.85 4.85 0 0 1-1-.02Z"/>
                    </svg>
                    <span className="text-xs font-bold">TikTok</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </a>
                )}

                {/* WhatsApp Chat Button */}
                {rawWa && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp Chat"
                    className="group flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 border border-slate-800 hover:border-emerald-500 text-emerald-400 hover:text-white transition-all shadow-2xs active:scale-95"
                    title="হোয়াটসঅ্যাপে সরাসরি চ্যাট করুন"
                  >
                    <MessageCircle className="w-4 h-4 fill-current transition-colors" />
                    <span className="text-xs font-bold">WhatsApp</span>
                    <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Direct Contact Details (Phone & Email) */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              যোগাযোগ ও হেল্পলাইন
            </h4>

            <div className="space-y-2.5 text-xs">
              {/* Direct Phone Call */}
              {branding.contactPhone ? (
                <a
                  href={phoneHref}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 transition-all group shadow-2xs"
                  title="সরাসরি কল করতে ক্লিক করুন"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: `${primaryColor}20`,
                      color: primaryColor,
                      border: `1px solid ${primaryColor}40`,
                    }}
                  >
                    <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">কল করুন (সকাল ৯টা - রাত ১১টা):</span>
                    <span className="font-black text-sm text-white" style={{ color: primaryColor }}>{branding.contactPhone}</span>
                  </div>
                </a>
              ) : null}

              {/* Direct Email Address */}
              {branding.contactEmail ? (
                <a
                  href={emailHref}
                  className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 transition-all group shadow-2xs"
                  title="ইমেইল পাঠাতে ক্লিক করুন"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">অফিসিয়াল ইমেইল:</span>
                    <span className="font-bold text-xs text-slate-200 break-all">{branding.contactEmail}</span>
                  </div>
                </a>
              ) : null}

              {/* Location Badge */}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 border border-slate-700/80 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">ডেলিভারি কাভারেজ:</span>
                  <span className="font-bold text-xs text-slate-200">ঢাকা ও সমগ্র বাংলাদেশ (হোম ডেলিভারি)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Category Links & Customer Care */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 border-b border-slate-800 pb-2">
              জনপ্রিয় ক্যাটাগরি
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                    className="text-slate-300 hover:text-white hover:underline flex items-center gap-1.5 font-medium transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                    <span>{cat.name} কালেকশন</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => onSelectCategory && onSelectCategory('All')}
                  className="text-slate-300 hover:text-white hover:underline flex items-center gap-1.5 font-medium transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                  <span>সকল প্রোডাক্ট দেখুন</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright & Credits */}
      <div className="bg-black border-t border-slate-900 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-[11px] text-slate-400">
            © {currentYear} <span className="font-bold text-slate-200">{branding.storeName}</span>. সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] font-medium text-slate-400">
            <span>ক্যাশ অন ডেলিভারি</span>
            <span>•</span>
            <span>নিরাপদ শপিং</span>
            <span>•</span>
            <span>প্রাইভেসি ও পলিসি</span>
            {onOpenClientAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenClientAdmin}
                  className="hover:text-slate-200 flex items-center gap-1 text-[11px] text-slate-400 underline transition-colors cursor-pointer"
                  title="দোকানের অ্যাডমিন লগইন"
                >
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>অ্যাডমিন লগইন</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
