import React, { useContext } from "react";
import { useColorMode, IconButton, Box, Text } from "@chakra-ui/react";
import { useCart } from "../context/CartContext";
import { FiShoppingCart } from "react-icons/fi";

export const CartIcon = () => {
  const { cart } = useCart();
  const { colorMode } = useColorMode();

  const iconColor = { light: "gray.600", dark: "gray.300" };
  const fontColor = { light: "gray.800", dark: "gray.100" };

  return (
    <Box
      position={"relative"}
      animation={cart && cart.length > 0 ? "bounce 0.6s 2" : ""}
    >
      <IconButton
        icon={<FiShoppingCart />}
        aria-label="Cart"
        variant="ghost"
        color={iconColor[colorMode]}
        _hover={{
          transition: "background-color 0.3s",
        }}
        _active={{
          transform: "scale(0.95)",
          transition: "transform 0.2s",
        }}
        transition="all 0.3s"
      />
      {cart && cart.length > 0 && (
        <Box
          position={"absolute"}
          top={"-2px"}
          right={"-2px"}
          bg={"red.400"}
          rounded={"full"}
          color={fontColor[colorMode]}
          px={2}
          fontSize={"xs"}
          fontWeight={"bold"}
        >
          {cart.length}
        </Box>
      )}
    </Box>
  );
};

import { Global, css } from "@emotion/react";

const bounceAnimation = css`
  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-5px);
    }
    60% {
      transform: translateY(-3px);
    }
  }
`;

export const globalStyles = <Global styles={bounceAnimation} />;
