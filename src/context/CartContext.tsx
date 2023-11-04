import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { uniqueId } from 'lodash';

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const guestSession = getGuestSessionId();
    if (!session && !guestSession) {
      const newGuestSessionId = generateGuestSessionId();
      setGuestSessionId(newGuestSessionId);
    }
  }, [session]);

  const setGuestSessionId = (guestSessionId) => {
    localStorage.setItem('guestSessionId', guestSessionId);
  };

  const getGuestSessionId = () => {
    return localStorage.getItem('guestSessionId');
  };

  const generateGuestSessionId = () => {
    return uniqueId('guest_');
  };

  const addItem = async (productId, quantity) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const cartData = await response.json();
      if (Array.isArray(cartData.items)) { // Assume 'items' is the array of cart items
        setCart(cartData.items); // Only set if it's an array
      } else {
        // Handle the situation if it's not an array
        console.error('Expected an array for updated cart, but received:', cartData);
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);

    }
  };

  const removeItem = async (cartItemId) => {
    try {
      const response = await fetch('/api/cart/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItemId }),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const message = await response.json();
      setCart(cart.filter(item => item.id !== cartItemId)); // Update local cart state accordingly
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      // Handle error state here
    }
  };

  const updateItem = (productId, quantity) => {
    const updatedCart = cart.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
