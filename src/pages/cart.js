import React from "react";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  useColorModeValue as mode,
  CircularProgress,
} from "@chakra-ui/react";
import { CartItem as CartItemComponent } from "@/components/cartpage/CartItem";
import { CartOrderSummary } from "@/components/cartpage/CartOrderSummary";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/router";

const CartPage = () => {
  const { cart, loading, error } = useCart();
  const router = useRouter();
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="60vh"
      >
        <CircularProgress s isIndeterminate />
      </Box>
    );
  }

  // Ensure you are accessing the `items` property of `cart`
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Box mx="auto" py="12">
        Your cart is empty.
      </Box>
    );
  }

  return (
    <Box
      maxW={{ base: "3xl", lg: "7xl" }}
      mx="auto"
      px={{ base: "4", md: "8", lg: "12" }}
      py={{ base: "6", md: "8", lg: "12" }}
    >
      <Stack
        direction={{ base: "column", lg: "row" }}
        align={{ lg: "flex-start" }}
        spacing={{ base: "8", md: "16" }}
      >
        <Stack spacing={{ base: "8", md: "10" }} flex="2">
          <Heading fontSize="2xl" fontWeight="extrabold">
            Shopping Cart ({cart.items.length} items)
          </Heading>

          <Stack spacing="6">
            {cart.items.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </Stack>
        </Stack>

        <Flex direction="column" align="center" flex="1">
          <CartOrderSummary />
          <HStack mt="6" fontWeight="semibold">
            <p>or</p>
            <Link color={mode("blue.500", "blue.200")}>Continue shopping</Link>
          </HStack>
        </Flex>
      </Stack>
    </Box>
  );
};

export default CartPage;
