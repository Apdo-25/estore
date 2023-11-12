"use client";
import React, { useContext } from "react";
import {
  Flex,
  Stack,
  Image,
  Box,
  Text,
  useColorModeValue,
  CloseButton,
  useToast
} from "@chakra-ui/react";
import {useCart} from "@/context/CartContext"


type ProductType = {
  imageUrl: string;
  name: string;
  price: number;
  salePrice: number;
  currency: string;
};

type CartItemType = {
  id: string;
  quantity: number;
  product: ProductType;
};

export const CartItem = ({ item }: { item: CartItemType }) => {
  const { quantity, product } = item;
  const { removeItemFromCart } = useCart(); // Use the custom hook to get cart manipulation functions
  const toast = useToast();
  const { imageUrl, name, salePrice, currency } = product;

  const handleRemove = async () => {
    try {
      await removeItemFromCart(item.id);
      toast({
        title: "Item Removed",
        description: `${name} has been removed from the cart.`,
        status: "info",
        duration: 1000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem removing the item from the cart.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };


  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      bg={useColorModeValue("white", "gray.800")}
      rounded={{ md: "lg" }}
      shadow="base"
      mb={4}
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        w="full"
        spacing={4}
        p={4}
      >
        <Box w={{ base: "44", md: "52" }}>
          <Image
            rounded="lg"
            w="full"
            h="full"
            objectFit="cover"
            src={imageUrl}
            alt={name} // Using product name as alt text for accessibility
          />
        </Box>
        <Stack
          direction={{ base: "column", md: "row" }}
          w="full"
          justifyContent="space-between"
          alignItems="center"
          spacing={4}
        >
          <Stack spacing={0} w="full" alignItems="flex-start" textAlign="left">
            <Text
              color={useColorModeValue("gray.700", "gray.400")}
              fontWeight="semibold"
              fontSize="lg"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              {name}
            </Text>
            <Text
              color={useColorModeValue("gray.500", "gray.200")}
              fontWeight="medium"
              fontSize="sm"
            >
              {currency} {salePrice}
            </Text>
          </Stack>
          <Stack direction="row" spacing={4} alignItems="center">
            <Text
              color={useColorModeValue("gray.700", "gray.400")}
              fontWeight="semibold"
              fontSize="lg"
            >
              {quantity}
            </Text>
            <CloseButton onClick={handleRemove} />
          </Stack>
        </Stack>
      </Stack>
    </Flex>
  );
};
