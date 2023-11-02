import { Box } from "@chakra-ui/react";
import { ProductCard } from "@/components/ProductCard";
import { ProductGrid } from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";

const AllProducts = ({ products }) => {
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
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>
    </Box>
  );
};

export async function getServerSideProps() {
  let products = [];

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Set your default URL or get from environment variable

  try {
    const response = await fetch(`${apiUrl}/api/products`);
    products = await response.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return {
    props: {
      products,
    },
  };
}

export default AllProducts;
