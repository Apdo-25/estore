import Layout from "@/components/Layout";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { CartProvider } from "../context/CartContext";

const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif",
    heading: "Inter, sans-serif",
  },
});
export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </ChakraProvider>
  );
}
