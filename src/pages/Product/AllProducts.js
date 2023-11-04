import { Box, CircularProgress, useToast } from "@chakra-ui/react";
import { ProductCard } from "@/components/ProductCard";
import { ProductGrid } from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";
import { useProducts } from "@/context/ProductContext";
import Pagination from "@/components/Pagination";

const AllProducts = () => {
  const { products, fetchProducts, error, totalPages, currentPage } =
    useProducts();
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        await fetchProducts();
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to load products.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [fetchProducts, toast]);

  const handlePageChange = async (newPage) => {
    // Check if newPage is within the range
    if (newPage >= 1 && newPage <= totalPages) {
      try {
        setIsLoading(true); // Set loading before fetching new page
        await fetchProducts(newPage); // Pass new page number to fetchProducts
      } catch (e) {
        toast({
          title: "Error",
          description: "Failed to load products.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

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

  if (error) {
    return <Box>Error: {error}</Box>;
  }

  return (
    <Box
      mx="auto"
      px={{ base: "4", md: "8", lg: "12" }}
      py={{ base: "6", md: "8", lg: "12" }}
    >
      <SearchBar />
      <ProductGrid>
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};

export default AllProducts;
