import { Box } from "@chakra-ui/react";
import { ProductCard } from "@/components/ProductCard";
import { ProductGrid } from "@/components/ProductGrid";
import { data } from "@/utils/data";
import SearchBar from "@/components/SearchBar";

const AllProducts = () => {
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
      <SearchBar />
      <ProductGrid>
        {data.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>
    </Box>
  );
};

export default AllProducts;
