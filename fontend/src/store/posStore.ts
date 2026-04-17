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

const computeTotal = (cart: CartItem[]) =>
  cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const usePOSStore = create<POSState>((set, get) => ({
  cart: [],
  total: 0,

  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.id === product.id);
    let newCart: CartItem[];

    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    set({ cart: newCart, total: computeTotal(newCart) });
  },

  removeFromCart: (productId) => {
    const newCart = get().cart.filter((item) => item.id !== productId);
    set({ cart: newCart, total: computeTotal(newCart) });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    const newCart = get().cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    set({ cart: newCart, total: computeTotal(newCart) });
  },

  clearCart: () => set({ cart: [], total: 0 }),
}));
