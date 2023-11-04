import React from "react";
import { useCart } from "@/context/CartContext"; // Adjust this import based on the actual location
import { Box } from "@chakra-ui/react";
import { CartItem } from "@/components/cartpage/CartItem";

const CartPage = () => {
  const { cart } = useCart(); // Use useCart hook directly

  if (cart.length === 0) {
    return (
      <Box mx="auto" py="12">
        Your cart is empty.
      </Box>
    );
  }

  return (
    <Box
      mx="auto"
      px={{
        base: "4",
        md: "8",
        lg: "12",
      }}
      py={{
        base: "6",
        md: "8",
        lg: "12",
      }}
    >
      {cart.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </Box>
  );
};

export default CartPage;
