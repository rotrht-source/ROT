import React from 'react';
import { X, Globe, CheckCircle2, Copy, ShieldCheck, Server, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  domainName?: string;
}

export const SubdomainGuideModal: React.FC<Props> = ({ isOpen, onClose, domainName = 'yourstore.com' }) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">কাস্টমার সাব-ডোমেন সেটআপ নির্দেশিকা</h2>
              <p className="text-xs text-red-100">How customer subdomains work on your domain</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Bengali Explanation Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 text-sm leading-relaxed space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              কীভাবে আপনার ক্লায়েন্টকে অটোমেটিক সাব-ডোমেন দিবেন?
            </p>
            <p>
              আপনি একটি প্রধান ডোমেন (যেমন: <code className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-red-600 font-bold">{domainName}</code>) কিনবেন। আপনার ফাউন্ডেশন প্ল্যাটফর্মে যখনই কোনো ক্লায়েন্টের নতুন স্টোর তৈরি করবেন, তখন সেটি সাথে সাথেই <code className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-slate-900">clientname.{domainName}</code> এ লাইভ হয়ে যাবে।
            </p>
          </div>

          {/* Steps for Domain Provider */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Server className="w-5 h-5 text-red-600" />
              ডোমেন প্রোভাইডারে DNS রেকর্ড সেটআপ (Cloudflare / cPanel / Namecheap)
            </h3>

            {/* Record 1 */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
                  Step 1: Wildcard Subdomain DNS
                </span>
                <span className="text-xs text-gray-500">For unlimited client subdomains</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-sans">Type</span>
                  <span className="font-bold text-slate-900">CNAME or A</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-sans">Name / Host</span>
                  <span className="font-bold text-slate-900">*</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-sans">Target / IP</span>
                  <span className="font-bold text-slate-900">@ or Your-Server-IP</span>
                </div>
              </div>
              <p className="text-xs text-gray-600">
                হোস্টিং এ <code className="bg-gray-100 px-1 rounded">*</code> (Wildcard) CNAME দিয়ে দিলে যেকোনো নতুন সাব-ডোমেন (যেমন: shophub.domain.com, fashion.domain.com) অটোমেটিক আপনার সার্ভারে পয়েন্ট করবে।
              </p>
            </div>

            {/* Record 2 */}
            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                  Step 2: Client Custom Domain (Optional)
                </span>
                <span className="text-xs text-gray-500">If client brings their own domain</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[11px] font-sans">Point Client Domain CNAME to:</p>
                  <p className="font-bold text-slate-900">stores.{domainName}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(`stores.${domainName}`, 2)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-slate-700 text-xs flex items-center gap-1 font-sans"
                >
                  {copiedIndex === 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedIndex === 2 ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Live Dynamic Switching in this App */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-emerald-950 mb-1">এই অ্যাপলেটে যেভাবে কাজ করছে:</p>
              <p>
                হেডারের <strong>"Active Store Swapper"</strong> এবং ডোমেন সিমুলেটর ব্যবহার করে আপনি প্রতিটা ক্লায়েন্টের লাইভ ই-কমার্স স্টোর এবং ক্লায়েন্ট এডমিন প্যানেল সাথে সাথেই পরীক্ষা করতে পারবেন।
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 px-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            বুঝেছি, ধন্যবাদ
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
