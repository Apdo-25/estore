import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
  useToast,
  Flex,
  chakra,
  CircularProgress,
} from "@chakra-ui/react";
import { MdLocalShipping } from "react-icons/md";
import ProductBadge from "../../components/ProductBadge";
import { useRouter } from "next/router";
import { useProducts } from "../../context/ProductContext";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query; // Use router query to get the product ID
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const { fetchProductById, error } = useProducts(); // Use fetchProductById from context
  const [product, setProduct] = useState(null);
  const { addItemToCart } = useCart();

  useEffect(() => {
    if (id) {
      setIsLoading(true); // Set loading to true when we start fetching
      fetchProductById(id)
        .then((product) => {
          setProduct(product);
          setIsLoading(false); // Set loading to false when fetch is successful
        })
        .catch((error) => {
          console.error("Failed to fetch product:", error);
          setIsLoading(false); // Also set loading to false when fetch fails
        });
    }
  }, [id, fetchProductById]);

  if (error) {
    return <Text>{error}</Text>; // Display error if there is one
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="60vh"
      >
        <CircularProgress isIndeterminate />
      </Box>
    );
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
              addItemToCart(product.id, 1);
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
