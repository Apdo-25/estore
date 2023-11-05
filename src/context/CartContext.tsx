import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Product } from '@prisma/client';
import { CartItem } from '@prisma/client';



interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CartProviderProps {
  children: ReactNode;
}

interface CartContextState {
  cart: Cart | null;
  fetchCart: () => Promise<void>;
  addItemToCart: (productId: string, quantity: number) => Promise<void>;
  removeItemFromCart: (itemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextState | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchCart = useCallback(async () => {
    if (!session?.user) {
      console.error('User is not authenticated.');
      setError('User is not authenticated.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${session.user.id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data: Cart = await res.json();
      setCart(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  const addItemToCart = useCallback(async (productId: string, quantity: number) => {
    if (!session?.user || !cart) {
      setError('User is not authenticated or cart is not initialized.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${cart.id}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        throw new Error('Failed to add item to cart');
      }
      await fetchCart();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [session?.user, cart, fetchCart]);

  const removeItemFromCart = useCallback(async (itemId: string) => {
    if (!session?.user || !cart) {
      setError('User is not authenticated or cart is not initialized.');
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${cart.id}/items?itemId=${itemId}`, { // Corrected endpoint
        method: 'DELETE',
      });
  
      if (!res.ok) {
        throw new Error('Failed to remove item from cart');
      }
      await fetchCart();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [session?.user, cart, fetchCart]);
  

  useEffect(() => {
    if (session?.user) {
      fetchCart().catch(console.error);
    }
  }, [session?.user, fetchCart]);

  const contextValue = {
    cart,
    loading,
    error,
    fetchCart,
    addItemToCart,
    removeItemFromCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
