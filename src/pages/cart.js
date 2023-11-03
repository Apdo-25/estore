import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { CartItem } from "../components/CartItem";
import { Box } from "@chakra-ui/react";

const CartPage = () => {
  const { CartItem } = useContext(CartContext);

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
      {CartItem.map((item) => {
        if (!item.product) {
          console.warn("Suspicious cart item without product:", item);
        }
        return item.product && <CartItem key={item.id} item={item} />;
      })}
    </Box>
  );
};

export default CartPage;
