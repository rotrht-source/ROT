import React, { useState } from 'react';
import {
  Sparkles,
  MessageCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  Lock,
  Check,
} from 'lucide-react';
import { Store } from '../types';
import { STORE_LOGOS } from '../data/initialStores';
import { verifyAndLoginMaster } from '../utils/masterAuth';
import { RotLogo } from './RotLogo';

interface Props {
  stores: Store[];
  onOpenStorefront: (storeId: string) => void;
  onUnlockMaster: () => void;
}

export const RotWebAgencyLanding: React.FC<Props> = ({
  stores,
  onOpenStorefront,
  onUnlockMaster,
}) => {
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [secretError, setSecretError] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Agency WhatsApp number
  const WHATSAPP_PHONE = '8801711889900';

  const getWhatsAppOrderUrl = (customText?: string) => {
    const text = customText || 'হ্যালো! আমি ROT এর মাসিক ৫০০ টাকার প্যাকেজে আমার ব্যবসার জন্য একটি প্রফেশনাল ই-কমার্স ওয়েবসাইট বানাতে চাই।';
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  };

  const handleSecretSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAndLoginMaster(secretInput.trim())) {
      onUnlockMaster();
      setIsSecretModalOpen(false);
    } else {
      setSecretError(true);
      setTimeout(() => setSecretError(false), 3000);
    }
  };

  // 3 Featured demo stores meta
  const demoStoreMeta: Record<string, { badge: string; tag: string; category: string }> = {
    zarafashion: {
      badge: 'ফ্যাশন & ক্লথিং',
      tag: 'শাড়ি, থ্রি-পিস, পাঞ্জাবি ও এক্সেসরিজ',
      category: 'Clothing & Fashion',
    },
    techplus: {
      badge: 'গ্যাজেট & ইলেকট্রনিক্স',
      tag: 'স্মার্টফোন অ্যাক্সেসরিজ, অডিও ও ওয়াচ',
      category: 'Gadgets & Tech',
    },
    prakritifood: {
      badge: 'অর্গানিক & গ্রোসারি',
      tag: 'খাঁটি মধু, সরিষার তেল, ঘি ও ড্রাই ফ্রুটস',
      category: 'Organic Foods',
    },
  };

  const displayStores = stores.filter(s => ['zarafashion', 'techplus', 'prakritifood'].includes(s.id));
  const fallbackStores = displayStores.length > 0 ? displayStores : stores.slice(0, 3);

  const faqs = [
    {
      q: 'মাসিক ৫০০ টাকায় কী কী সুবিধা রয়েছে?',
      a: 'সম্পূর্ণ রেডি ই-কমার্স ওয়েবসাইট, আনলিমিটেড প্রোডাক্ট আপলোড, ১-ক্লিক ক্যাশ অন ডেলিভারি ফর্ম, নিজস্ব মোবাইল অ্যাডমিন প্যানেল, ফাস্ট ক্লাউড হোস্টিং, এবং ফেসবুক পিক্সেল সেটআপ। কোনো বাড়তি বা গোপন খরচ নেই।',
    },
    {
      q: 'ওয়েবসাইট চালু হতে কত সময় লাগে?',
      a: 'আপনার লোগো ও প্রয়োজনীয় তথ্য দেওয়ার পর ২৪ ঘণ্টার মধ্যেই আপনার ওয়েবসাইট লাইভ করে দেওয়া হয়।',
    },
    {
      q: 'আমি কি নিজস্ব ডোমেইন যুক্ত করতে পারবো?',
      a: 'হ্যাঁ, আপনার পছন্দমতো যেকোনো কাস্টম ডোমেইন (.com বা অন্যান্য) সম্পূর্ণ ফ্রিতে কানেক্ট করে দেওয়া হবে।',
    },
    {
      q: 'মাসিক ফি কীভাবে পরিশোধ করতে হবে?',
      a: 'বিকাশ, নগদ বা ব্যাংক ট্রান্সফারের মাধ্যমে প্রতি মাসে সহজেই ৫০০ টাকা পরিশোধ করতে পারবেন। কোনো বাধ্যতামূলক চুক্তি নেই, আপনি চাইলে যেকোনো সময় চালু বা বন্ধ রাখতে পারবেন।',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-red-600 selection:text-white">
      {/* ------------------------------------------------------------- */}
      {/* TOP ANNOUNCEMENT BAR (ROT BLACK & CRIMSON RED) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-zinc-950 text-white text-xs sm:text-sm py-2.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-red-600/30">
        <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
          ROT স্পেশাল অফার
        </span>
        <span>মাসিক মাত্র <strong className="text-red-400 font-black">৫০০ টাকায়</strong> আপনার ব্যবসার ফুল রেডি ই-কমার্স ওয়েবসাইট</span>
        <a
          href={getWhatsAppOrderUrl('হ্যালো! আমি ROT এর মাসিক ৫০০ টাকার ওয়েবসাইট অফারটি নিতে চাই।')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-400 font-bold hover:text-red-300 underline ml-1 hidden sm:inline"
        >
          অর্ডার করুন →
        </a>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* HEADER / NAVIGATION (CLEAN WHITE WITH ROT LOGO & ACCENTS) */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Official ROT Logo */}
          <div className="flex items-center">
            <RotLogo className="h-11 sm:h-12 w-auto" variant="full" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-700">
            <a href="#demos" className="hover:text-red-600 transition-colors">ডেমো শপ</a>
            <a href="#pricing" className="hover:text-red-600 transition-colors">প্যাকেজ (৫০০৳)</a>
            <a href="#faq" className="hover:text-red-600 transition-colors">প্রশ্নোত্তর</a>
          </nav>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <a
              href={getWhatsAppOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp এ অর্ডার</span>
            </a>

            {/* Secret Master Unlock */}
            <button
              onClick={() => setIsSecretModalOpen(true)}
              className="p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
              title="মাস্টার ড্যাশবোর্ড"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* HERO SECTION (ROT BRAND PALETTE: WHITE CANVAS, ONYX BLACK, CRIMSON RED) */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-14 pb-20 sm:pt-20 sm:pb-28 bg-white border-b border-zinc-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Brand Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-red-700 text-xs sm:text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>BUILD • GROW • SUCCEED</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-tight sm:leading-tight">
            আপনার ব্যবসার জন্য প্রফেশনাল ওয়েবসাইট{' '}
            <span className="text-red-600 block mt-2">
              মাসিক মাত্র ৫০০ টাকায়!
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed font-medium">
            ROT E-Commerce Solutions নিয়ে এলো আপনার অনলাইন ব্যবসার ফুল রেডি ওয়েবসাইট। কোনো বড় অগ্রিম খরচ ছাড়া আজই আপনার প্রোডাক্ট বিক্রি শুরু করুন।
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={getWhatsAppOrderUrl('হ্যালো! আমি ROT এর ৫০০ টাকার মাসিক ওয়েবসাইট প্যাকেজটি অর্ডার করতে চাই।')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-base px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>৫০০ টাকায় অর্ডার করুন (WhatsApp)</span>
            </a>

            <a
              href="#demos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-base px-7 py-3.5 rounded-xl transition-all"
            >
              <Eye className="w-5 h-5 text-zinc-300" />
              <span>ডেমো শপ দেখুন</span>
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3 LIVE DEMO STORES */}
      {/* ------------------------------------------------------------- */}
      <section id="demos" className="py-20 bg-zinc-50/70 border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              লাইভ ডেমো ওয়েবসাইটসমূহ
            </h2>
            <p className="mt-2 text-zinc-600 text-sm sm:text-base">
              যেকোনো ডেমোতে ক্লিক করে সরাসরি ভিজিট করুন এবং আপনার পছন্দের ওয়েবসাইটটি বেছে নিন।
            </p>
          </div>

          {/* Grid of 3 Clean Demo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fallbackStores.map((store) => {
              const meta = demoStoreMeta[store.id] || {
                badge: 'প্রিমিয়াম শপ',
                tag: 'প্রোডাক্ট ও ক্যাটাগরি কালেকশন',
                category: 'E-commerce',
              };

              return (
                <div
                  key={store.id}
                  className="bg-white rounded-2xl border border-zinc-200 shadow-xs hover:shadow-md hover:border-red-300 transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Bar */}
                  <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
                    <span className="text-xs font-bold text-zinc-700">
                      {meta.badge}
                    </span>
                    <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      ৫০০৳ / মাস
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="h-14 flex items-center justify-center p-2 bg-zinc-50 rounded-xl border border-zinc-100 mb-5">
                      <img
                        src={store.branding.logoUrl || STORE_LOGOS[store.id as keyof typeof STORE_LOGOS] || STORE_LOGOS.zarafashion}
                        alt={store.branding.storeName}
                        className="max-h-10 w-auto object-contain"
                      />
                    </div>

                    <h3 className="text-lg font-bold text-zinc-950 mb-1">
                      {store.branding.storeName}
                    </h3>
                    <p className="text-xs text-zinc-500 mb-5">
                      {meta.tag}
                    </p>

                    {/* Products preview */}
                    <div className="mt-auto">
                      <p className="text-[11px] font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                        প্রোডাক্ট স্যাম্পল:
                      </p>
                      <div className="grid grid-cols-3 gap-2 mb-5">
                        {store.products.slice(0, 3).map((p) => (
                          <div key={p.id} className="relative rounded-lg overflow-hidden border border-zinc-200 aspect-square bg-zinc-100">
                            <img
                              src={p.mainImage}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-zinc-950/85 p-1 text-center">
                              <span className="text-[10px] font-bold text-white">৳{p.salePrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 bg-zinc-50 border-t border-zinc-100 flex flex-col gap-2">
                    <button
                      onClick={() => onOpenStorefront(store.id)}
                      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl border border-zinc-300 transition-all"
                    >
                      <Eye className="w-4 h-4 text-zinc-700" />
                      <span>লাইভ ডেমো ভিজিট করুন</span>
                    </button>

                    <a
                      href={getWhatsAppOrderUrl(`হ্যালো! আমি ROT এর '${store.branding.storeName}' ডেমোর মতো ওয়েবসাইট অর্ডার করতে চাই (মাসিক ৫০০৳)।`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl transition-all shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>এই ওয়েবসাইট অর্ডার করুন</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* PRICING SECTION - 500 TK / MONTH */}
      {/* ------------------------------------------------------------- */}
      <section id="pricing" className="py-20 bg-white border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              সাশ্রয়ী মাসিক প্যাকেজ
            </h2>
            <p className="mt-2 text-zinc-600 text-sm sm:text-base">
              কোনো অগ্রিম বড় বাজেট ছাড়াই মাসিক ৫০০ টাকায় আজই আপনার অনলাইন স্টোর শুরু করুন।
            </p>
          </div>

          <div className="max-w-lg mx-auto bg-white rounded-2xl border-2 border-red-600/30 shadow-md p-7 sm:p-9 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl tracking-wider">
              POPULAR
            </div>

            <div className="flex items-baseline justify-between border-b border-zinc-100 pb-5 mb-6">
              <div>
                <h3 className="text-xl font-black text-zinc-950">সম্পূর্ণ ই-কমার্স শপ</h3>
                <p className="text-xs text-zinc-500 mt-0.5">সব ধরনের ব্যবসার জন্য উপযুক্ত</p>
              </div>
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-black text-red-600">৳৫০০</span>
                <span className="text-zinc-500 font-medium text-xs"> / মাস</span>
              </div>
            </div>

            <div className="space-y-3 mb-8 text-sm text-zinc-700">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-red-600 shrink-0 font-bold" />
                <span>সম্পূর্ণ রেডি প্রিমিয়াম ই-কমার্স ওয়েবসাইট</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-red-600 shrink-0 font-bold" />
                <span>১-ক্লিক ক্যাশ অন ডেলিভারি (COD) ফর্ম</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-red-600 shrink-0 font-bold" />
                <span>আনলিমিটেড প্রোডাক্ট ও ক্যাটাগরি আপলোড</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-red-600 shrink-0 font-bold" />
                <span>মোবাইল ফ্রেন্ডলি অ্যাডমিন প্যানেল</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-red-600 shrink-0 font-bold" />
                <span>ফেসবুক পিক্সেল (Pixel) ও CAPI ইন্টিগ্রেশন</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-red-600 shrink-0 font-bold" />
                <span>কাস্টম ডোমেইন (.com) সাপোর্ট</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-red-600 shrink-0 font-bold" />
                <span>ফ্রি ক্লাউড হোস্টিং ও টেকনিক্যাল সাপোর্ট</span>
              </div>
            </div>

            <a
              href={getWhatsAppOrderUrl('হ্যালো! আমি ROT এর মাসিক ৫০০ টাকার ই-কমার্স ওয়েবসাইট প্যাকেজটি নিতে চাই।')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-base py-3.5 px-6 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              <span>৫০০ টাকায় ওয়েবসাইট শুরু করুন (WhatsApp)</span>
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FAQ SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="faq" className="py-20 bg-zinc-50/50 border-b border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              সচরাচর জিজ্ঞাসিত প্রশ্নোত্তর
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-zinc-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-zinc-900 hover:text-red-600 transition-colors text-sm sm:text-base"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-red-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-zinc-600 text-xs sm:text-sm leading-relaxed border-t border-zinc-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER */}
      {/* ------------------------------------------------------------- */}
      <footer className="bg-white py-12 text-zinc-600 text-xs sm:text-sm border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center">
            <RotLogo className="h-10 w-auto" variant="full" />
          </div>

          <div className="text-center text-zinc-500 text-xs">
            © {new Date().getFullYear()} ROT E-Commerce Solutions. মাসিক মাত্র ৫০০ টাকায় প্রফেশনাল ই-কমার্স ওয়েবসাইট সার্ভিস।
          </div>

          <button
            onClick={() => setIsSecretModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 bg-zinc-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>মাস্টার প্যানেল</span>
          </button>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* FLOATING WHATSAPP BUTTON (CRIMSON RED BRANDED) */}
      {/* ------------------------------------------------------------- */}
      <a
        href={getWhatsAppOrderUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-xl flex items-center gap-2 font-bold text-sm transition-all hover:scale-105 active:scale-95 border-2 border-white"
        title="WhatsApp এ অর্ডার করুন"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="hidden sm:inline">৫০০৳ ওয়েবসাইট অর্ডার</span>
      </a>

      {/* ------------------------------------------------------------- */}
      {/* SECRET MASTER LOGIN MODAL */}
      {/* ------------------------------------------------------------- */}
      {isSecretModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-zinc-950 text-base">মাস্টার অ্যাডমিন</h3>
              </div>
              <button
                onClick={() => setIsSecretModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-500 mb-4">
              মাস্টার কন্ট্রোল প্যানেলে প্রবেশ করতে আপনার গোপন কোডটি লিখুন:
            </p>

            <form onSubmit={handleSecretSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="সিক্রেট কোড (e.g. rot786)"
                  value={secretInput}
                  onChange={(e) => setSecretInput(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-sm focus:outline-none focus:border-red-600"
                  autoFocus
                />
                {secretError && (
                  <p className="text-red-600 text-xs mt-1.5 font-medium">
                    ভুল সিক্রেট কোড! সঠিক কোড দিন।
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSecretModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl hover:bg-zinc-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl"
                >
                  প্রবেশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
