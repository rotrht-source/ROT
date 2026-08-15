import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  ShoppingBag,
  MoreVertical,
  Heart,
  Star,
  Zap,
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, StoreBranding } from '../types';
import { WhatsAppButton } from './WhatsAppButton';

interface Props {
  product: Product;
  branding: StoreBranding;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, selectedColor: string) => void;
  cartItemCount: number;
  onOpenCart: () => void;
}

export const ProductDetailView: React.FC<Props> = ({
  product,
  branding,
  onBack,
  onAddToCart,
  cartItemCount,
  onOpenCart,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const images = product.images?.length > 0 ? product.images : [product.mainImage];
  const primaryColor = branding.primaryColor || '#DC2626';

  const handleAddToCart = () => {
    const selectedColor = product.colors?.[selectedColorIndex]?.name || 'Default';
    onAddToCart(product, quantity, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1800);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onOpenCart();
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 pb-24 font-sans">
      {/* Top Mobile Header */}
      <div className="sticky top-0 z-30 bg-white text-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-200 shadow-2xs transition-colors">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 border border-gray-200/80 active:scale-95 transition-transform shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 flex justify-center items-center px-2 min-w-0">
          {branding.logoUrl ? (
            <div className="p-1 px-3 bg-white rounded-xl border border-gray-200/80 shadow-2xs flex items-center justify-center max-h-10">
              <img
                src={branding.logoUrl}
                alt={branding.storeName}
                className="h-7 max-h-7 w-auto max-w-[150px] object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          ) : (
            <h1 className="text-base font-black tracking-tight text-gray-900 truncate">
              {branding.storeName}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCart}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-gray-200/80 text-gray-800 relative transition-all active:scale-95"
            aria-label="Cart"
          >
            <ShoppingBag className="w-5 h-5" style={{ color: primaryColor }} />
            {cartItemCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 text-white font-extrabold text-[10px] rounded-full w-5 h-5 flex items-center justify-center shadow-xs border-2 border-white animate-pulse"
                style={{ backgroundColor: primaryColor }}
              >
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Image Slider Container */}
      <div className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div
            className="absolute top-4 left-4 z-10 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-xs"
            style={{ backgroundColor: primaryColor }}
          >
            -{product.discountPercentage}%
          </div>
        )}

        {/* Favorite Heart Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 z-10 bg-white p-2.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform border border-gray-100"
          aria-label="Add to wishlist"
        >
          <Heart
            className="w-5 h-5 transition-colors"
            style={{
              color: isWishlisted ? primaryColor : '#9CA3AF',
              fill: isWishlisted ? primaryColor : 'none',
            }}
          />
        </button>

        {/* Main Display Image Container */}
        <div className="w-full aspect-[9/16] max-h-[520px] flex items-center justify-center p-3 bg-slate-100 relative">
          <img
            src={images[selectedImageIndex]}
            alt={product.title}
            loading="eager"
            decoding="async"
            className="max-h-full max-w-full object-contain drop-shadow-md transition-all duration-300"
          />

          {/* Left/Right Carousel Nav Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-xs transition-transform active:scale-90"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md backdrop-blur-xs transition-transform active:scale-90"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Image Index Counter Badge e.g. 1/5 */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-xs shadow-xs">
          {selectedImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Small Thumbnail Photos Gallery (ছাট ছোট ছবি) */}
      {images.length > 1 && (
        <div className="px-4 py-3 bg-white border-b border-gray-200">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-gray-700">
            <ImageIcon className="w-4 h-4" style={{ color: primaryColor }} />
            <span>প্রোডাক্টের অন্যান্য ছবি ({images.length}টি):</span>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative w-16 aspect-[9/16] rounded-md overflow-hidden border-2 transition-all shrink-0 bg-gray-100 ${
                  selectedImageIndex === idx
                    ? 'scale-105 shadow-sm'
                    : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                }`}
                style={{
                  borderColor: selectedImageIndex === idx ? primaryColor : undefined,
                  boxShadow: selectedImageIndex === idx ? `0 0 0 2px ${primaryColor}35` : undefined,
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Product photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Content Block */}
      <div className="p-4 sm:p-6 bg-white space-y-5">
        {/* Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
            {product.title}
          </h2>

          {/* Reviews & Star Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-600">
              {product.rating || 4.8} ({product.reviewsCount || 128} reviews)
            </span>
          </div>
        </div>

        {/* Pricing & Stock Status */}
        <div className="flex items-baseline justify-between pt-1 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold" style={{ color: primaryColor }}>
              {branding.currencySymbol}
              {(Number(product.salePrice) || 0).toFixed(2)}
            </span>
            {Number(product.originalPrice) > Number(product.salePrice) && (
              <span className="text-sm font-medium text-gray-400 line-through">
                {branding.currencySymbol}
                {(Number(product.originalPrice) || 0).toFixed(2)}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            In Stock
          </span>
        </div>



        {/* Color Selection */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="text-xs font-bold text-gray-800">
              Color:{' '}
              <span className="text-gray-900 font-normal">
                {product.colors[selectedColorIndex]?.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {product.colors.map((color, idx) => {
                const isSelected = selectedColorIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'scale-110 shadow-sm' : 'hover:scale-105'
                    }`}
                    style={{
                      backgroundColor: color.hex,
                      boxShadow: isSelected ? `0 0 0 2px white, 0 0 0 4px ${primaryColor}` : 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                    }}
                    title={color.name}
                  >
                    {isSelected && (
                      <Check
                        className={`w-4 h-4 ${
                          color.hex === '#FFFFFF' || color.hex === '#F3F4F6'
                            ? 'text-gray-900'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Selector & Action Buttons */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            {/* Quantity box */}
            <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 overflow-hidden shadow-2xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 text-sm font-bold"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:bg-gray-300 text-sm font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-11 border font-bold rounded-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs sm:text-sm shadow-2xs hover:opacity-90"
              style={{
                backgroundColor: `${primaryColor}15`,
                borderColor: `${primaryColor}40`,
                color: primaryColor,
              }}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">কার্টে যোগ হয়েছে!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>কার্টে রাখুন</span>
                </>
              )}
            </button>
          </div>

          {/* Buy Now Button */}
          <button
            onClick={handleBuyNow}
            className="w-full h-12 text-white font-black rounded-md shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm sm:text-base uppercase tracking-wide"
            style={{ backgroundColor: primaryColor }}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>সরাসরি অর্ডার করুন (Buy Now)</span>
          </button>
        </div>

        {/* Product Page Guarantee Badges */}
        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-md border border-gray-200 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-[11px]">সারা দেশে ক্যাশ অন ডেলিভারি</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-semibold text-[11px]">১০০% অরিজিনাল প্রোডাক্ট</span>
          </div>
        </div>

        {/* Product Description Accordion */}
        <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
          <button
            onClick={() => setIsDescOpen(!isDescOpen)}
            className="w-full px-4 py-3 text-left font-bold text-sm text-gray-900 flex items-center justify-between hover:bg-gray-50"
          >
            <span>পণ্য বিবরণী (Product Description)</span>
            {isDescOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {isDescOpen && (
            <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
              {product.description}
            </div>
          )}
        </div>
      </div>

      {/* Persistent Floating WhatsApp Button */}
      <WhatsAppButton
        whatsappNumber={branding.whatsappNumber || branding.contactPhone}
        storeName={branding.storeName}
        productTitle={product.title}
      />
    </div>
  );
};
