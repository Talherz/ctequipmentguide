"use client";

import { createContext, useContext, useReducer, ReactNode } from "react";

/**
 * A single cart item represents a product added to the shopping cart. It
 * includes the product's identifier, slug, name, price, quantity and
 * optionally SKU or vendor/category identifiers. Additional properties
 * can be added later as needed.
 */
export interface CartItem {
  id: string | number;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string | null;
  vendor_id?: string | number | null;
  category_id?: string | number | null;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string | number } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string | number; quantity: number } }
  | { type: "CLEAR_CART" };

interface CartContextValue {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

// Initialize the cart context; will be provided in CartProvider below.
const CartContext = createContext<CartContextValue | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      // If the item is already in the cart, increase its quantity instead of
      // adding a duplicate entry.
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id,
      );
      if (existingIndex !== -1) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity:
            updatedItems[existingIndex].quantity + action.payload.quantity,
        };
        return { items: updatedItems };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM": {
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }
    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item,
      );
      return { items: updatedItems };
    }
    case "CLEAR_CART": {
      return { items: [] };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };
  const removeItem = (id: string | number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };
  const updateQuantity = (id: string | number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };
  // Compute total price; multiply price by quantity for each item.
  const total = state.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Custom hook to access cart context. Throws if used outside of CartProvider.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}