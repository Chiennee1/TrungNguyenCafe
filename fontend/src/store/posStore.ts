import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  status: 'AVAILABLE' | 'OUT_OF_STOCK';
}

export interface CartItem extends Product {
  quantity: number;
  note?: string;
}

interface POSState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const usePOSStore = create<POSState>((set, get) => ({
  cart: [],
  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.id === product.id);
    
    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({ cart: [...cart, { ...product, quantity: 1 }] });
    }
  },
  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.id !== productId) });
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      cart: get().cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    });
  },
  clearCart: () => set({ cart: [] }),
  get total() {
    return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
