import React, { useState } from 'react';

interface Props {
  whatsappNumber?: string;
  storeName: string;
  productTitle?: string;
}

export const WhatsAppButton: React.FC<Props> = ({
  whatsappNumber,
  storeName,
  productTitle,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Clean and format the WhatsApp phone number
  const formatWhatsAppNumber = (rawNum?: string): string => {
    if (!rawNum || rawNum.trim() === '') return '8801711889900';
    
    // Remove all non-digits
    let cleaned = rawNum.replace(/[^0-9]/g, '');
    
    // If it starts with 01 (11 digits like Bangladesh standard 01711xxxxxx), prepend 88
    if (cleaned.length === 11 && cleaned.startsWith('01')) {
      cleaned = '88' + cleaned;
    }
    
    return cleaned || '8801711889900';
  };

  const cleanNumber = formatWhatsAppNumber(whatsappNumber);

  // Pre-filled text message for WhatsApp inbox
  const message = productTitle
    ? `আসসালামু আলাইকুম! আমি "${productTitle}" পণ্যটি সম্পর্কে জানতে এবং অর্ডার করতে আগ্রহী (${storeName})।`
    : `আসসালামু আলাইকুম! আমি ${storeName} ওয়েবসাইট থেকে যোগাযোগ করছি। পণ্য সম্পর্কিত বিস্তারিত তথ্য জানতে চাই।`;

  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div
      id="floating-whatsapp-container"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center group select-none"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Floating Tooltip / Badge */}
      <div
        className={`mr-3 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-bold rounded-xl shadow-lg backdrop-blur-xs whitespace-nowrap transition-all duration-200 hidden sm:flex items-center gap-1.5 ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>WhatsApp এ চ্যাট করুন</span>
      </div>

      {/* Circular Floating WhatsApp Button */}
      <a
        id="whatsapp-chat-button"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp with ${storeName}`}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#128C7E] via-[#25D366] to-[#25D366] text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center relative ring-4 ring-white/60 focus:outline-none"
      >
        {/* Pulse / Ping ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>

        {/* Online green indicator badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs"></span>

        {/* WhatsApp Authentic SVG Icon */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow-xs"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
};
