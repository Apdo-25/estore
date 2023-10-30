import {
  AspectRatio,
  Box,
  Button,
  HStack,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Rating } from "./Rating";
import { FavouriteButton } from "./FavouriteButton";
import { PriceTag } from "./PriceTag";

import Image from "next/image";
import Link from "next/link";

import ProductBadge from "./ProductBadge";

export const ProductCard = (props) => {
  //find data
  const { product } = props;
  const { name, imageUrl, price, salePrice, rating, flag } = product;

  return (
    <Stack
      spacing={{
        base: "4",
        md: "5",
      }}
      maxW="300px"
    >
      <Box position="relative">
        <AspectRatio ratio={4 / 3}>
          <Link href={`/Product/${product.id}`} passHref>
            <Skeleton
              isLoaded={!!imageUrl}
              borderRadius={8}
              width={"1200"}
              height={"900"}
            />
            <ProductBadge flag={flag} />
            <Image
              src={imageUrl}
              alt={name}
              draggable="false"
              fallback={<Skeleton />}
              width={"1200"}
              height={"900"}
            />
          </Link>
        </AspectRatio>
        <FavouriteButton
          position="absolute"
          top="4"
          right="4"
          aria-label={`Add ${name} to your favourites`}
        />
      </Box>
      <Stack>
        <Stack spacing="1">
          <Text
            fontWeight="medium"
            color={useColorModeValue("gray.700", "gray.400")}
          >
            {name}
          </Text>
          <PriceTag price={price} salePrice={salePrice} currency="DKK" />
        </Stack>
        <HStack>
          <Rating defaultValue={rating} size="sm" />
        </HStack>
      </Stack>
      <Stack align="center">
        <Button colorScheme="blue" width="full">
          Add to cart
        </Button>
      </Stack>
    </Stack>
  );
};
