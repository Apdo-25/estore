import { createContext, useReducer, useEffect } from "react";
import { getSessionId } from "@/utils/sessionUtil";
import { useToast } from "@chakra-ui/react";
import { CartItem } from '../components/cartpage/CartItem';

const initialize = {
  CartItem: [],
  loading: false,
};

type CartItem = {
  id: string;
  product: {
    id: string;
    price: Float;
  };
  quantity: Int;
};

type CartState = {
  CartItem: [];
  loading: boolean;
};

type CartContextType = CartState & {
  AddItem: (productId: string, quantity: number) => void;
  RemoveItem: (id: string) => void;
  UpdateItem: (id: string, quantity: number) => void
};

type CartAction =
  | { type: "ADD_ITEM"; payload: any }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: [string, number] }
  | { type: "SET_INITIAL_CART"; payload: any[] }
  | { type: "START_LOADING" }
  | { type: "STOP_LOADING" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      return { ...state, CartItem: [...state.CartItem, action.payload] };
    case "REMOVE_ITEM":
      return {
        ...state,
        CartItem: state.CartItem.filter((item) => item.id !== action.payload),
      };
      case "UPADATE_ITEM":
        return {
          ...state,
          CartItem: state.CartItem.map((item) => {
            if (item.id === action.payload[0]) {
              return { ...item, quantity: action.payload[1] };
            }
            return item;
          }),
        };
    case "SET_INITIAL_CART":
      return { ...state, CartItem: action.payload };
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


  const UpdateItem = async (id: string, quantity: number) => {
    const sessionId = getSessionId();

    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "session-id": sessionId,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }

      dispatch({ type: "UPDATE_QUANTITY", payload: [id, quantity] });
    } catch (error) {
      console.error("Failed to update item in cart:", error);
      toast({
        title: "Error",
        description: "Failed to update item in cart.",
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
    <CartContext.Provider value={{ ...state, AddItem, RemoveItem, UpdateItem }}>
      {children}
    </CartContext.Provider>
  );
};
