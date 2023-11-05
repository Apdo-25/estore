import React from "react";
import { useColorMode, IconButton, Box } from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export const CartIcon = () => {
  const { colorMode } = useColorMode();
  const { cart } = useCart(); // Use the custom hook to get cart context

  const iconColor = { light: "gray.600", dark: "gray.300" };
  const fontColor = { light: "gray.800", dark: "gray.100" };

  // Determine the count of items in the cart
  const itemCount =
    cart?.items.reduce((count, item) => count + item.quantity, 0) ?? 0;

  return (
    <Box position={"relative"} animation={itemCount > 0 ? "bounce 0.6s 2" : ""}>
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
      {itemCount > 0 && (
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
          {itemCount}
        </Box>
      )}
    </Box>
  );
};

// The Global styles for the animation can stay as they are
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
