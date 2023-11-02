import { createContext, useReducer, useEffect } from "react";
import { getSessionId } from "@/utils/sessionUtil";
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
  AddItem: (productId: string, quantity: number) => void;
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
    const sessionId = getSessionId();

    const fetchCartData = async () => {
      dispatch({ type: "START_LOADING" });
      try {
        const response = await fetch("/api/cart", {
          headers: {
            "session-id": sessionId,
          },
        });
        const data = await response.json();
        console.log(data);
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

  const AddItem = async (productId: string, quantity = 1) => {
    const sessionId = getSessionId();

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "session-id": sessionId,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

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

  const RemoveItem = async (id: string) => {
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
