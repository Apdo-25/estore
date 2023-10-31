import { createContext, useReducer, useEffect } from "react";
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@chakra-ui/react";

const initialize = {
  cart: [],
  loading: false,
};

type CartState = {
  cart: {}[];
  loading: boolean;
};

type CartContextType = CartState & {
  AddItem: (item: any) => void;
  RemoveItem: (id: string) => void;
};

type CartAction =
  | { type: "ADD_ITEM"; payload: any }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "SET_INITIAL_CART"; payload: any[] }
  | { type: "START_LOADING" }
  | { type: "STOP_LOADING" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, cart: [...state.cart, action.payload] };
    case "REMOVE_ITEM":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    case "SET_INITIAL_CART":
      return { ...state, cart: action.payload };
    case "START_LOADING":
      return { ...state, loading: true };
    case "STOP_LOADING":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialize);
  const toast = useToast();

  useEffect(() => {
    if (!Cookies.get("sessionId")) {
      Cookies.set("sessionId", uuidv4());
    }
    
    const fetchCartData = async () => {
      dispatch({ type: "START_LOADING" });
      try {
        const response = await fetch("/api/cart", {
          headers: {
            "sessionId": Cookies.get("sessionId"),
          },
        });
        const data = await response.json();
        dispatch({ type: "SET_INITIAL_CART", payload: data });
      } catch (error) {
        console.error("Failed to fetch cart data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch cart data.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        dispatch({ type: "STOP_LOADING" });
      }
    };

    fetchCartData();
  }, []);

  const AddItem = async (productId, quantity = 1) => {
    const newItem = { productId, quantity };
    
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "sessionId": Cookies.get("sessionId")
        },
        body: JSON.stringify({ productId, quantity }),
      });
    
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
  
      // Assuming the server returns the actual item that was added, with its 'id'
      dispatch({ type: "ADD_ITEM", payload: data });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  
  const RemoveItem = async (id) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        dispatch({ type: "REMOVE_ITEM", payload: id });
      } else {
        console.error("Failed to delete the item.");
        toast({
          title: "Error",
          description: "Failed to delete the item.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Failed to delete the item:", error);
      toast({
        title: "Error",
        description: "Failed to delete the item.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <CartContext.Provider value={{ ...state, AddItem, RemoveItem }}>
      {children}
    </CartContext.Provider>
  );
};
