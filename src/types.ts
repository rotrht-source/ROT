export interface ProductFeature {
  id: string;
  icon: string; // lucide icon name or label e.g., 'bluetooth', 'battery', 'volume-2', 'mic'
  title: string;
  subtitle: string;
}

export interface Product {
  id: string;
  title: string;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  category: string;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  mainImage: string;
  images: string[];
  colors: { name: string; hex: string }[];
  features?: (ProductFeature | string)[];
  description: string;
  isFlashDeal?: boolean;
  isBestSelling?: boolean;
}

export interface Category {
  id: string;
  name: string;
  iconName: string;
  bgColor?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  selectedColor?: string;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  paymentMethod: string;
}

export interface StoreBranding {
  storeName: string;
  subdomain: string;
  customDomain?: string;
  logoText: string;
  logoUrl?: string;
  primaryColor: string; // hex string e.g. #E50914 or #DC2626
  secondaryColor: string;
  currencySymbol: string;
  announcementText?: string;
  heroBannerTitle: string;
  heroBannerSubtitle: string;
  heroBannerDiscount: string;
  heroBannerImage: string;
  freeShippingThreshold: number;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  aboutStore?: string;
}

export interface Store {
  id: string;
  branding: StoreBranding;
  clientEmail: string;
  clientPassword: string; // for demo client admin access
  createdAt: string;
  products: Product[];
  categories: Category[];
  orders: Order[];
}

export type ViewMode = 'home' | 'storefront' | 'client_admin' | 'super_admin';
