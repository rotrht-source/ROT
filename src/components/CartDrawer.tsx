import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, MapPin, Phone, User, Plus, Minus } from 'lucide-react';
import { CartItem, StoreBranding, Order } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  branding: StoreBranding;
  onPlaceOrder: (order: Order) => void;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  branding,
  onPlaceOrder,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (acc, item) => acc + (Number(item.product?.salePrice) || 0) * (item.quantity || 1),
    0
  );
  const isFreeShipping = subtotal >= (branding.freeShippingThreshold || 50);
  const shippingFee = subtotal > 0 && !isFreeShipping ? 5.0 : 0.0;
  const grandTotal = subtotal + shippingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert('Please fill out name, phone number, and address.');
      return;
    }

    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: orderId,
      customerName,
      customerPhone,
      customerAddress,
      items: cart.map((c) => ({
        productId: c.product.id,
        title: c.product.title,
        price: c.product.salePrice,
        quantity: c.quantity,
        selectedColor: c.selectedColor,
        image: c.product.mainImage,
      })),
      totalAmount: grandTotal,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      paymentMethod,
    };

    onPlaceOrder(newOrder);
    setPlacedOrderId(orderId);
    setStep('success');
    onClearCart();
  };

  const resetAndClose = () => {
    setStep('cart');
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white text-slate-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div
          className="p-4 text-white flex items-center justify-between"
          style={{ backgroundColor: branding.primaryColor || '#DC2626' }}
        >
          <div className="flex items-center gap-2 font-bold">
            <ShoppingBag className="w-5 h-5" />
            <span>
              {step === 'cart' && 'শপিং কার্ট (Shopping Cart)'}
              {step === 'checkout' && 'চেকআউট ও ডেলিভারি তথ্য (Checkout & Delivery)'}
              {step === 'success' && 'অর্ডার সফল হয়েছে! (Order Placed)'}
            </span>
          </div>
          <button onClick={resetAndClose} className="p-1 hover:bg-white/10 rounded-full text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-900">
          {step === 'cart' && (
            <>
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">আপনার কার্ট খালি আছে</h3>
                  <p className="text-xs text-slate-500">পণ্য সিলেক্ট করে কার্টে যোগ করুন।</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200"
                    >
                      <img
                        src={item.product.mainImage}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded-lg bg-white border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.title}
                        </h4>
                        {item.selectedColor && (
                          <span className="text-[10px] text-slate-500 block">
                            কালার: {item.selectedColor}
                          </span>
                        )}
                        <span
                          className="text-sm font-extrabold"
                          style={{ color: branding.primaryColor }}
                        >
                          {branding.currencySymbol}
                          {(Number(item.product?.salePrice) || 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity selector */}
                      <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4 text-slate-900">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>সারা দেশে দ্রুত ক্যাশ অন ডেলিভারি সুবিধা রয়েছে</span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    আপনার নাম (Full Name) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মোঃ রহিম আহমেদ"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    মোবাইল নম্বর (Phone Number) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="যেমন: 01711223344"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    ডেলিভারি ঠিকানা (Full Address) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <textarea
                      required
                      rows={2}
                      placeholder="বাসা/হোল্ডিং নম্বর, রোড, এলাকা, জেলা"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    পেমেন্ট মাধ্যম (Payment Method)
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-2xs"
                  >
                    <option value="Cash on Delivery">ক্যাশ অন ডেলিভারি (Cash on Delivery)</option>
                    <option value="bKash / Mobile Wallet">বিকাশ / নগদ (bKash / Nagad)</option>
                    <option value="Debit / Credit Card">কার্ড পেমেন্ট (Debit / Credit Card)</option>
                  </select>
                </div>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-black text-slate-900">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                অর্ডার করার জন্য ধন্যবাদ। আপনার অর্ডার আইডি:{' '}
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{placedOrderId}</span>। স্টোর এডমিনকে অবহিত করা হয়েছে!
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {cart.length > 0 && step !== 'success' && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>মোট পণ্যের দাম (Subtotal)</span>
                <span className="font-bold text-slate-900">
                  {branding.currencySymbol}
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ (Shipping)</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">ফ্রি (FREE)</span>
                  ) : (
                    <span className="font-bold text-slate-900">{branding.currencySymbol}{shippingFee.toFixed(2)}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-slate-200">
                <span>সর্বমোট (Total)</span>
                <span style={{ color: branding.primaryColor }}>
                  {branding.currencySymbol}
                  {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-2 active:scale-95 transition-all"
                style={{ backgroundColor: branding.primaryColor || '#DC2626' }}
              >
                <span>অর্ডার করতে এগিয়ে যান (Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 bg-white font-bold text-xs rounded-xl hover:bg-slate-100 active:scale-95 transition-all"
                >
                  পিছনে
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 py-2.5 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 flex items-center justify-center gap-2 active:scale-95 transition-all"
                  style={{ backgroundColor: branding.primaryColor || '#DC2626' }}
                >
                  <span>অর্ডার নিশ্চিত করুন (Confirm Order)</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'success' && (
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <button
              onClick={resetAndClose}
              className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 active:scale-95 transition-all"
            >
              আরো কেনাকাটা করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
