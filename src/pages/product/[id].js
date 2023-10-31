import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  List,
  ListItem,
  useToast,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import { useRouter } from "next/router";
import ProductBadge from "@/components/ProductBadge";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const toast = useToast();
  const [product, setProduct] = useState(null);

  const { AddItem } = useContext(CartContext);

  useEffect(() => {
    if (id) {
      // Fetch product details from your API
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${id}`);
          const productData = await response.json();
          setProduct(productData);
        } catch (error) {
          console.error("Failed to fetch product:", error);
        }
      };

      fetchProduct();
    }
  }, [id]);

  if (!router.isReady || !product) {
    return <Text>Loading...</Text>;
  }

  if (!product) {
    return <Text>Product not found</Text>;
  }
  return (
    <Container maxW={"7xl"}>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 18, md: 24 }}
      >
        <Flex position="relative">
          <Image
            rounded={"md"}
            alt={product.name}
            src={product.imageUrl}
            fit={"cover"}
            align={"center"}
            w={"100%"}
            h={{ base: "100%", sm: "400px", lg: "500px" }}
          />
          <ProductBadge flag={product.flag} />
        </Flex>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Box as={"header"}>
            <Heading
              lineHeight={1.1}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {product.name}
            </Heading>
            <Text color={"gray.900"} fontWeight={300} fontSize={"2xl"}>
              {product.currency} {product.price}
              {product.salePrice && (
                <>
                  <chakra.span
                    textDecoration={"line-through"}
                    color={"gray.500"}
                  >
                    {product.currency} {product.salePrice}
                  </chakra.span>
                </>
              )}
            </Text>
          </Box>
          <Text color={"gray.500"} fontSize={"2xl"} fontWeight={"300"}>
            {product.description}
          </Text>
          <List spacing={2}>
            {product.features.map((feature, index) => (
              <ListItem key={index}>{feature}</ListItem>
            ))}
          </List>
          <Button
            rounded={"none"}
            w={"full"}
            mt={8}
            size={"lg"}
            py={"7"}
            bg={"gray.900"}
            color={"white"}
            textTransform={"uppercase"}
            _hover={{
              transform: "translateY(2px)",
              boxShadow: "lg",
            }}
            onClick={() => {
              AddItem(product.id, 1);
              toast({
                title: "Item Added",
                description: `${product.name} has been added to the cart.`,
                status: "success",
                duration: 2000,
                isClosable: true,
              });
            }}
          >
            Add to cart
          </Button>
          <Stack direction="row" alignItems="center" justifyContent={"center"}>
            <MdLocalShipping />
            <Text>2-3 business days delivery</Text>
          </Stack>
        </Stack>
      </SimpleGrid>
    </Container>
  );
};

export default ProductDetail;
