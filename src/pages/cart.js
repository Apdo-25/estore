import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { CartItem } from "../components/CartItem";
import { Box } from "@chakra-ui/react";

const CartPage = () => {
  const { cart } = useContext(CartContext);

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
      {cart.map(
        (item) => item.product && <CartItem key={item.id} item={item} />
      )}
    </Box>
  );
};

export default CartPage;
