// Video types
export interface Video {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  thumbnail: string;
  category: string;
  uploader: string;
  views: number;
  likes: number;
  uploadDate: string;
}

// Watch List types
export interface WatchListItem {
  video: Video;
  quantity: number; // kept for compatibility, represents "saved"
}

export interface WatchList {
  items: WatchListItem[];
  total: number;
}

// Legacy Product interface for backwards compatibility (maps to Video)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

// Legacy Cart interface for backwards compatibility (maps to WatchList)
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Watermark types
export interface Watermark {
  id: string;
  name: string;
  type: 'image' | 'text';
  data: string; // Base64 for image, text for text type
  opacity: number;
  position: { x: number; y: number };
  scale: number;
}

// UI state types
export interface AppState {
  cart: Cart;
  watermarks: Watermark[];
  activeWatermark: string | null;
}

// File upload types
export interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'text';
}
