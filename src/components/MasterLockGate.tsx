import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { verifyAndLoginMaster } from '../utils/masterAuth';
import { Store } from '../types';

interface Props {
  onUnlocked: () => void;
  onGoToStorefront: () => void;
  featuredStore?: Store;
}

export const MasterLockGate: React.FC<Props> = ({
  onUnlocked,
  onGoToStorefront,
  featuredStore,
}) => {
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const isSuccess = verifyAndLoginMaster(inputKey);
      if (isSuccess) {
        onUnlocked();
      } else {
        setErrorMsg('গোপন কোডটি ভুল হয়েছে! সঠিক সিক্রেট কোড দিয়ে প্রবেশ করুন।');
      }
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-xs font-black tracking-wider uppercase text-slate-300">
            মাস্টার এক্সেস প্রোটেকশন
          </span>
        </div>

        {featuredStore && (
          <button
            onClick={onGoToStorefront}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700/60 transition-all shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
            <span>দোকান ভিজিট করুন</span>
          </button>
        )}
      </div>

      {/* Main Lock Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header icon */}
          <div className="text-center space-y-2.5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-red-950/50 border border-white/20 transition-transform hover:scale-105">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-950/70 border border-red-800/60 px-3 py-0.5 rounded-full inline-block mb-1.5">
                রেস্ট্রিক্টেড এরিয়া • ওনার অনলি
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                মেইন প্ল্যাটফর্ম লক করা আছে
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                এই কন্ট্রোল প্যানেলটিতে কেবল প্ল্যাটফর্মের মূল মালিক প্রবেশ করতে পারবেন। মেইন পেজে ঢুকতে আপনার গোপন সিক্রেট কোডটি প্রদান করুন।
              </p>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="bg-red-950/80 border border-red-800/80 text-red-200 text-xs font-bold p-3.5 rounded-2xl flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Secret Code Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-red-400" />
                  <span>গোপন সিক্রেট কোড (Master Secret Key)</span>
                </span>
                <span className="text-[10px] text-slate-500 font-normal">ডিফল্ট কোড: rot786</span>
              </label>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  required
                  autoFocus
                  placeholder="গোপন কোডটি লিখুন (যেমন: rot786)"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-4 pr-11 py-3.5 text-sm text-white placeholder-slate-600 font-medium focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 p-1.5 transition-colors cursor-pointer"
                  title={showKey ? 'লুকান' : 'দেখুন'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-sm tracking-wide transition-all shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>মেইন পেজ আনলক করুন (Unlock Platform)</span>
                </>
              )}
            </button>
          </form>

          {/* Quick info / Go to store alternative */}
          {featuredStore && (
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={onGoToStorefront}
                className="w-full py-3 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700/60 cursor-pointer"
              >
                <span>কাস্টমার হিসেবে সরাসরি দোকানে যান ({featuredStore.branding.storeName})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-600 pb-2">
        <span>সিকিউর ই-কমার্স মাস্টার প্যানেল • অননুমোদিত প্রবেশ নিষিদ্ধ</span>
      </div>
    </div>
  );
};
