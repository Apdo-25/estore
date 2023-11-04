import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { UserProvider } from "@/context/UserContext";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import Layout from "@/components/Layout";
import { SessionProvider } from "next-auth/react";

const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif",
    heading: "Inter, sans-serif",
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <SessionProvider session={pageProps.session}>
        <UserProvider>
          <ProductProvider>
            <CartProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </CartProvider>
          </ProductProvider>
        </UserProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}
